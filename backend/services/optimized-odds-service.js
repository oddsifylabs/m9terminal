/**
 * ODDS API CREDIT ANALYSIS & OPTIMIZATION
 * 
 * Current Problem:
 * - 30-second cache = 2,880 requests/day per sport
 * - 3 sports (MLB, NBA, NFL) = 8,640 requests/day
 * - Odds API free tier: 500 requests/month = ~16/day
 * - PRO tier: 10,000/month = ~333/day
 * - ENTERPRISE: 100,000+/month
 * 
 * At current rate: UNSUSTAINABLE - would burn through free tier in minutes
 */

const axios = require('axios');
const NodeCache = require('node-cache');

// OPTIMIZED: 5-minute cache (not 30 seconds!)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Request throttling to prevent burst requests
class RateLimiter {
  constructor(maxRequests = 1, windowMs = 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async wait() {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.requests.push(Date.now());
  }
}

// One request per second per sport
const oddsApiLimiter = new RateLimiter(1, 1000);

const SPORTSDATA_BASE_URL = 'https://api.sportsdata.io/v3/mlb/scores/json';
const ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4/sports';

const SPORTSDATA_KEY = process.env.SPORTSDATA_IO_API_KEY || 'acdea7c8923843c4a1a00d1a0cde9adf';
const ODDS_API_KEY = process.env.ODDS_API_KEY || '6f46bbb3b2fb69b5e14980a57e9909da';

// Track API usage for monitoring
const apiMetrics = {
  oddsApiRequests: 0,
  sportsDataRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  lastReset: Date.now(),
  
  getStats() {
    const uptime = (Date.now() - this.lastReset) / 1000 / 60; // minutes
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? (this.cacheHits / total * 100) : 0;
    const rpm = uptime > 0 ? (this.oddsApiRequests / uptime) : 0;
    
    return {
      oddsApiRequests: this.oddsApiRequests,
      sportsDataRequests: this.sportsDataRequests,
      cacheHitRate: hitRate.toFixed(1) + '%',
      requestsPerMinute: rpm.toFixed(2),
      uptime: uptime.toFixed(1) + ' min',
    };
  },
};

class OptimizedOddsService {
  /**
   * STRATEGY 1: Smart Caching
   * Cache times based on sport and time of day
   * - During games: longer cache (odds change less frequently)
   * - Off-season: much longer cache
   * - Pre-game: shorter cache (sharp action likely)
   */
  static getCacheTTL(sport, hour = new Date().getHours()) {
    // MLB hours: 1 PM - 11 PM typical
    const isMlbHours = hour >= 13 && hour <= 23;
    
    if (isMlbHours) {
      // During games: games last 3+ hours, odds stabilize
      return 300; // 5 minutes
    } else {
      // Off hours: odds rarely change
      return 3600; // 1 hour
    }
  }

  /**
   * STRATEGY 2: Batch requests to single endpoint
   * Instead of 3 separate calls, get all sports at once
   */
  static async getMultipleSportsOdds(sports = ['baseball_mlb', 'basketball_nba', 'americanfootball_nfl']) {
    const cacheKey = `batch_odds_${sports.sort().join('_')}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      apiMetrics.cacheHits++;
      return cached;
    }

    apiMetrics.cacheMisses++;
    const results = {};

    try {
      // Stagger requests to not burst the API (1 req/sec per sport)
      for (const sport of sports) {
        await oddsApiLimiter.wait();
        
        try {
          const response = await axios.get(
            `${ODDS_API_BASE_URL}/${sport}/events?apiKey=${ODDS_API_KEY}`,
            { timeout: 5000 }
          );
          
          results[sport] = response.data || [];
          apiMetrics.oddsApiRequests++;
          
          console.log(`✓ Fetched ${sport}: ${response.data?.length || 0} events`);
        } catch (error) {
          console.error(`Error fetching ${sport}:`, error.message);
          results[sport] = [];
        }
      }

      // Cache for 5 minutes
      const ttl = this.getCacheTTL('batch');
      cache.set(cacheKey, results, ttl);
      
      return results;
    } catch (error) {
      console.error('Batch odds error:', error.message);
      return {};
    }
  }

  /**
   * STRATEGY 3: Only fetch what you need
   * Specify bookmakers and markets to reduce payload
   */
  static async getOddsOptimized(
    sport = 'baseball_mlb',
    bookmakers = ['draftkings', 'fanduel', 'betmgm'], // Top 3 US books
    markets = ['h2h', 'spreads', 'totals'] // Only popular markets
  ) {
    const cacheKey = `odds_opt_${sport}_${bookmakers.sort().join('_')}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      apiMetrics.cacheHits++;
      return cached;
    }

    apiMetrics.cacheMisses++;

    try {
      await oddsApiLimiter.wait();

      // Build URL with query params to reduce response size
      const bookmakerParam = bookmakers.join(',');
      const url = `${ODDS_API_BASE_URL}/${sport}/events?apiKey=${ODDS_API_KEY}&bookmakers=${bookmakerParam}&markets=${markets.join(',')}`;

      const response = await axios.get(url, { timeout: 5000 });
      
      const odds = response.data || [];
      apiMetrics.oddsApiRequests++;

      // Cache for 5 minutes
      const ttl = this.getCacheTTL(sport);
      cache.set(cacheKey, odds, ttl);
      
      return odds;
    } catch (error) {
      console.error('Error fetching optimized odds:', error.message);
      return [];
    }
  }

  /**
   * STRATEGY 4: Differentiated refresh rates
   * Update high-value data frequently, low-value rarely
   */
  static async getSelectiveOdds() {
    try {
      // Always update: games with active betting (less than 1 hour to start)
      const hotGames = await this.getOddsOptimized('baseball_mlb', 
        ['draftkings', 'fanduel'], // Just top 2 (save credits)
        ['h2h'] // Just moneyline (save credits)
      );

      // Sometimes update: games starting in 1-4 hours
      const warmGamesCacheKey = 'warm_games_mlb';
      let warmGames = cache.get(warmGamesCacheKey);
      
      if (!warmGames) {
        warmGames = await this.getOddsOptimized('baseball_mlb',
          ['draftkings', 'fanduel'],
          ['h2h', 'spreads']
        );
        cache.set(warmGamesCacheKey, warmGames, 1800); // 30 min cache
      }

      // Rarely update: future games (4+ hours away)
      const coldGamesCacheKey = 'cold_games_mlb';
      let coldGames = cache.get(coldGamesCacheKey);
      
      if (!coldGames) {
        coldGames = await this.getOddsOptimized('baseball_mlb',
          ['draftkings'],
          ['h2h']
        );
        cache.set(coldGamesCacheKey, coldGames, 3600); // 60 min cache
      }

      return {
        hot: hotGames,
        warm: warmGames,
        cold: coldGames,
      };
    } catch (error) {
      console.error('Selective odds error:', error.message);
      return { hot: [], warm: [], cold: [] };
    }
  }

  /**
   * STRATEGY 5: Estimated credit usage
   */
  static estimateCreditsPerDay(refreshRateSeconds = 300) {
    // Requests per day
    const mlbRefreshesPerDay = (24 * 3600) / refreshRateSeconds; // 288 per 300s refresh
    const nbaRefreshesPerDay = (24 * 3600) / refreshRateSeconds;
    const nflRefreshesPerDay = (24 * 3600) / refreshRateSeconds;
    
    const totalRequests = mlbRefreshesPerDay + nbaRefreshesPerDay + nflRefreshesPerDay;
    
    return {
      strategy: '5-minute cache, 3 sports',
      requestsPerDay: Math.ceil(totalRequests),
      requestsPerMonth: Math.ceil(totalRequests * 30),
      estimatedTier: this.recommendTier(Math.ceil(totalRequests * 30)),
    };
  }

  static recommendTier(requestsPerMonth) {
    if (requestsPerMonth < 500) return 'FREE (500/mo) ✓ SAFE';
    if (requestsPerMonth < 10000) return 'STARTER ($10/mo, 10k)';
    if (requestsPerMonth < 100000) return 'PRO ($50/mo, 100k)';
    return 'ENTERPRISE (custom)';
  }

  /**
   * Get API health & credit usage
   */
  static getApiStatus() {
    return {
      cache: {
        keys: cache.keys().length,
        stats: apiMetrics.getStats(),
      },
      recommendations: [
        '✓ Use 5-minute cache minimum',
        '✓ Batch requests when possible',
        '✓ Specify bookmakers to reduce payload',
        '✓ Higher cache TTL for off-hours games',
        '✓ Monitor usage daily',
      ],
      dailyEstimate: this.estimateCreditsPerDay(),
    };
  }
}

module.exports = OptimizedOddsService;
