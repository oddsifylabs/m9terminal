/**
 * M9 Terminal - MLB Live Data Service
 * Real-time integration with SportsData.io and The Odds API
 */

const axios = require('axios');
const NodeCache = require('node-cache');

// Cache with 30-second TTL for live data
const cache = new NodeCache({ stdTTL: 30, checkperiod: 10 });

const SPORTSDATA_BASE_URL = 'https://api.sportsdata.io/v3/mlb/scores/json';
const ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4/sports';

const SPORTSDATA_KEY = process.env.SPORTSDATA_IO_API_KEY || 'acdea7c8923843c4a1a00d1a0cde9adf';
const ODDS_API_KEY = process.env.ODDS_API_KEY || '6f46bbb3b2fb69b5e14980a57e9909da';

class MLBLiveDataService {
  /**
   * Get today's games from SportsData.io
   */
  static async getTodayGames() {
    const cacheKey = 'mlb_today_games';
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(
        `${SPORTSDATA_BASE_URL}/GamesByDate/2026-06-03?key=${SPORTSDATA_KEY}`,
        { timeout: 5000 }
      );

      const games = response.data || [];
      cache.set(cacheKey, games);
      return games;
    } catch (error) {
      console.error('Error fetching games from SportsData:', error.message);
      return [];
    }
  }

  /**
   * Get live odds from The Odds API
   */
  static async getLiveOdds(sport = 'baseball_mlb') {
    const cacheKey = `odds_${sport}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(
        `${ODDS_API_BASE_URL}/${sport}/events?apiKey=${ODDS_API_KEY}`,
        { timeout: 5000 }
      );

      const odds = response.data || [];
      cache.set(cacheKey, odds);
      return odds;
    } catch (error) {
      console.error('Error fetching odds:', error.message);
      return [];
    }
  }

  /**
   * Get odds for specific markets
   */
  static async getMarketOdds(sport = 'baseball_mlb', markets = ['h2h', 'spreads', 'totals']) {
    const cacheKey = `market_odds_${sport}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const marketParam = markets.join(',');
      const response = await axios.get(
        `${ODDS_API_BASE_URL}/${sport}/events?apiKey=${ODDS_API_KEY}&markets=${marketParam}`,
        { timeout: 5000 }
      );

      const odds = response.data || [];
      cache.set(cacheKey, odds);
      return odds;
    } catch (error) {
      console.error('Error fetching market odds:', error.message);
      return [];
    }
  }

  /**
   * Merge game data with odds data
   */
  static async enrichGamesWithOdds(games) {
    try {
      const odds = await this.getMarketOdds();
      
      return games.map(game => {
        const gameOdds = odds.find(o => 
          o.home_team === game.HomeTeam && o.away_team === game.AwayTeam
        );

        return {
          gameId: game.GameID,
          teams: `${game.AwayTeam} @ ${game.HomeTeam}`,
          awayTeam: game.AwayTeam,
          homeTeam: game.HomeTeam,
          commenceTime: game.Day || new Date().toISOString(),
          stadium: game.Stadium || 'TBD',
          weather: game.WeatherCondition || 'Unknown',
          status: game.Status,
          score: {
            away: game.AwayTeamRuns,
            home: game.HomeTeamRuns,
          },
          odds: gameOdds ? this.formatOdds(gameOdds) : {},
          bookOdds: gameOdds ? this.extractBookOdds(gameOdds) : {},
        };
      });
    } catch (error) {
      console.error('Error enriching games with odds:', error.message);
      return games;
    }
  }

  /**
   * Format odds from The Odds API response
   */
  static formatOdds(gameOdds) {
    const formatted = {};

    if (!gameOdds.bookmakers) {
      return formatted;
    }

    gameOdds.bookmakers.forEach(bookmaker => {
      const book = bookmaker.key;
      formatted[book] = {};

      bookmaker.markets?.forEach(market => {
        if (market.key === 'h2h') {
          formatted[book].moneyline = market.outcomes[0]?.odds;
        } else if (market.key === 'spreads') {
          formatted[book].spread = market.outcomes[0]?.point;
          formatted[book].spreadOdds = market.outcomes[0]?.odds;
        } else if (market.key === 'totals') {
          formatted[book].total = market.outcomes[0]?.point;
          formatted[book].totalOdds = market.outcomes[0]?.odds;
        }
      });
    });

    return formatted;
  }

  /**
   * Extract odds by sportsbook for comparison
   */
  static extractBookOdds(gameOdds) {
    const bookOdds = {};

    if (!gameOdds.bookmakers) {
      return bookOdds;
    }

    gameOdds.bookmakers.forEach(bookmaker => {
      const book = bookmaker.title || bookmaker.key;
      bookOdds[book] = {};

      bookmaker.markets?.forEach(market => {
        if (market.key === 'h2h' && market.outcomes) {
          // Get away team moneyline odds
          bookOdds[book].moneyline = market.outcomes[0]?.odds;
        } else if (market.key === 'spreads' && market.outcomes) {
          bookOdds[book].spread = market.outcomes[0]?.point;
        } else if (market.key === 'totals' && market.outcomes) {
          bookOdds[book].total = market.outcomes[0]?.point;
        }
      });
    });

    return bookOdds;
  }

  /**
   * Get all data for today's games with enriched odds
   */
  static async getTodayGamesWithOdds() {
    const cacheKey = 'mlb_today_enriched';
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const games = await this.getTodayGames();
      const enrichedGames = await this.enrichGamesWithOdds(games);
      cache.set(cacheKey, enrichedGames);
      return enrichedGames;
    } catch (error) {
      console.error('Error getting enriched games:', error.message);
      return [];
    }
  }

  /**
   * Clear cache (for testing)
   */
  static clearCache() {
    cache.flushAll();
  }
}

module.exports = MLBLiveDataService;
