/**
 * MLB Engine API Routes — LIVE DATA
 * Real odds, real game data, real verification
 */

const express = require('express');
const { MLBEngineLiveData } = require('../services/live-data-integration');
const auth = require('../middleware/auth');

const router = express.Router();
const engine = new MLBEngineLiveData({
  oddsApiKey: process.env.ODDS_API_KEY,
  sportsDataKey: process.env.SPORTSDATA_IO_API_KEY
});

/**
 * POST /api/mlb/analyze-today
 * 
 * Analyze TODAY's MLB games with REAL LIVE DATA
 * 
 * Query params:
 *   profile: "sharp|active|research" (default: active)
 * 
 * Response: All games with live odds, real team data, verified info
 */
router.post('/analyze-today', auth, async (req, res) => {
  try {
    const { profile = 'ACTIVE' } = req.body;

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    console.log(`📊 Analyzing MLB games for ${today}...`);
    console.log(`📡 Data sources: Odds API + SportsData.io`);

    // Fetch and analyze with REAL DATA
    const analysis = await engine.analyzeMLBDay(today, profile);

    if (!analysis.success) {
      return res.status(400).json({
        success: false,
        error: analysis.error,
        message: analysis.message,
        note: 'Check API keys: ODDS_API_KEY and SPORTSDATA_IO_API_KEY'
      });
    }

    // Verify data quality
    const qualityChecks = analysis.games.map(game => 
      engine.validateDataQuality(game)
    );

    // Find best odds for each game
    const bestOdds = analysis.games.map(game => ({
      game: game.gameId,
      ml: engine.findBestOdds(game, 'moneyline'),
      spread: engine.findBestOdds(game, 'spread'),
      total: engine.findBestOdds(game, 'total')
    }));

    return res.json({
      success: true,
      date: today,
      profile: profile,
      
      gamesAnalyzed: analysis.games.length,
      
      summary: {
        totalGames: analysis.summary.totalGames,
        gamesWithOdds: analysis.summary.gamesWithOdds,
        gamesWithGameDetails: analysis.summary.gamesWithDetails,
        gamesWithTeamStats: analysis.summary.gamesWithTeamStats,
        dataCompleteness: `${Math.round((analysis.summary.gamesWithTeamStats / analysis.summary.totalGames) * 100)}%`
      },
      
      dataSources: analysis.dataSources,
      
      dataQuality: {
        gamesFullyVerified: qualityChecks.filter(q => q.validation.dataQuality === 'HIGH').length,
        allBooksCovered: qualityChecks.filter(q => q.validation.allBooksPresent).length,
        weatherAvailable: qualityChecks.filter(q => q.validation.hasWeather).length
      },
      
      bestOdds: bestOdds.slice(0, 10), // Top 10 games
      
      games: analysis.games.map(game => ({
        gameId: game.gameId,
        teams: `${game.awayTeam} @ ${game.homeTeam}`,
        commenceTime: game.commenceTime,
        
        // Real verified data
        odds: {
          available: Object.keys(game.bookOdds).length,
          books: Object.keys(game.bookOdds).join(', ')
        },
        
        gameDetails: game.details ? {
          weather: game.details.weather,
          stadium: game.details.stadium.name
        } : null,
        
        teamStats: {
          home: game.homeTeamStats ? {
            name: game.homeTeamStats.name,
            winPct: game.homeTeamStats.winPercentage,
            runsPerGame: game.homeTeamStats.runsPerGame,
            ERA: game.homeTeamStats.ERA,
            OPS: game.homeTeamStats.OPS
          } : null,
          away: game.awayTeamStats ? {
            name: game.awayTeamStats.name,
            winPct: game.awayTeamStats.winPercentage,
            runsPerGame: game.awayTeamStats.runsPerGame,
            ERA: game.awayTeamStats.ERA,
            OPS: game.awayTeamStats.OPS
          } : null
        },
        
        dataVerification: game.dataVerification
      })).slice(0, 15) // Top 15 games
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
      note: 'Ensure API keys are set in environment variables'
    });
  }
});

/**
 * GET /api/mlb/odds/:sport/:league
 * 
 * Get LIVE ODDS for a specific sport/league
 * Real-time data from Odds API
 * 
 * Example: /api/mlb/odds/baseball/mlb
 */
router.get('/odds/:sport/:league', auth, async (req, res) => {
  try {
    const { sport, league } = req.params;
    const sportKey = `${sport}_${league}`; // e.g., "baseball_mlb"

    console.log(`📊 Fetching live odds for ${sportKey}...`);

    const oddsData = await engine.dataFetcher.getLiveOdds(sportKey);

    if (!oddsData.success) {
      return res.status(400).json({
        error: oddsData.error,
        fallback: 'Live odds unavailable'
      });
    }

    // Process raw odds
    const processedOdds = oddsData.games.map(game => {
      const processed = engine.processor.processOddsData(game);

      // Find best odds
      const bestML = engine.findBestOdds(processed, 'moneyline');
      const bestSpread = engine.findBestOdds(processed, 'spread');
      const bestTotal = engine.findBestOdds(processed, 'total');

      return {
        game: processed.gameId,
        teams: `${processed.awayTeam} @ ${processed.homeTeam}`,
        startTime: processed.commenceTime,
        bookCount: Object.keys(processed.bookOdds).length,
        bestOdds: {
          moneyline: bestML.bestOdds[0],
          spread: bestSpread.bestOdds[0],
          total: bestTotal.bestOdds[0]
        },
        allBooks: processed.bookOdds
      };
    });

    return res.json({
      success: true,
      sport: sportKey,
      gamesCount: processedOdds.length,
      lastUpdate: oddsData.timestamp,
      dataFreshness: 'Real-time',
      source: oddsData.source,
      games: processedOdds
    });

  } catch (error) {
    console.error('Odds fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch odds',
      message: error.message
    });
  }
});

/**
 * GET /api/mlb/game/:gameId/data
 * 
 * Get VERIFIED DATA for a specific game
 * Combines: Odds + Game Details + Team Stats
 */
router.get('/game/:gameId/data', auth, async (req, res) => {
  try {
    const { gameId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    // Get all games for today
    const analysis = await engine.analyzeMLBDay(today);

    if (!analysis.success) {
      return res.status(400).json({
        error: 'Could not fetch game data',
        gameId: gameId
      });
    }

    // Find specific game
    const game = analysis.games.find(g => g.gameId === gameId);

    if (!game) {
      return res.status(404).json({
        error: 'Game not found',
        gameId: gameId,
        available: analysis.games.map(g => g.gameId)
      });
    }

    // Validate data
    const validation = engine.validateDataQuality(game);

    return res.json({
      success: true,
      gameId: gameId,
      
      verification: {
        dataQuality: validation.validation.dataQuality,
        verified: validation.validation.hasOdds && validation.validation.hasTeamStats,
        readyForAnalysis: validation.readyForAnalysis
      },
      
      game: {
        teams: `${game.awayTeam} @ ${game.homeTeam}`,
        startTime: game.commenceTime,
        
        odds: {
          count: Object.keys(game.bookOdds).length,
          sportsbooks: Object.keys(game.bookOdds),
          bestOdds: {
            moneyline: engine.findBestOdds(game, 'moneyline').bestOdds[0],
            spread: engine.findBestOdds(game, 'spread').bestOdds[0],
            total: engine.findBestOdds(game, 'total').bestOdds[0]
          }
        },
        
        details: game.details ? {
          weather: {
            temperature: game.details.weather.temperature,
            windSpeed: game.details.weather.windSpeed,
            windDirection: game.details.weather.windDirection,
            precipitation: game.details.weather.precipitation
          },
          stadium: game.details.stadium.name,
          status: game.details.status
        } : null,
        
        teamStats: {
          home: game.homeTeamStats ? {
            team: game.homeTeamStats.name,
            record: `${game.homeTeamStats.wins}-${game.homeTeamStats.losses}`,
            winPct: game.homeTeamStats.winPercentage,
            stats: {
              runsPerGame: game.homeTeamStats.runsPerGame,
              runsAllowed: game.homeTeamStats.runsAllowed,
              ERA: game.homeTeamStats.ERA,
              OPS: game.homeTeamStats.OPS,
              K9: game.homeTeamStats.K9,
              lastTenWins: game.homeTeamStats.lastTenWins
            }
          } : null,
          away: game.awayTeamStats ? {
            team: game.awayTeamStats.name,
            record: `${game.awayTeamStats.wins}-${game.awayTeamStats.losses}`,
            winPct: game.awayTeamStats.winPercentage,
            stats: {
              runsPerGame: game.awayTeamStats.runsPerGame,
              runsAllowed: game.awayTeamStats.runsAllowed,
              ERA: game.awayTeamStats.ERA,
              OPS: game.awayTeamStats.OPS,
              K9: game.awayTeamStats.K9,
              lastTenWins: game.awayTeamStats.lastTenWins
            }
          } : null
        }
      },
      
      dataSources: {
        odds: 'Odds API (the-odds-api.com)',
        gameDetails: 'SportsData.io',
        teamStats: 'SportsData.io',
        updated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Game data fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch game data',
      message: error.message
    });
  }
});

/**
 * POST /api/mlb/test-data-integration
 * 
 * Test real data integration
 * Verify APIs are working and returning valid data
 */
router.post('/test-data-integration', auth, async (req, res) => {
  try {
    console.log('🧪 Testing data integration...\n');

    const tests = {
      oddsApi: null,
      sportsDataApi: null,
      dataProcessing: null,
      bestOdds: null
    };

    // Test 1: Odds API
    console.log('1️⃣  Testing Odds API...');
    const oddsTest = await engine.dataFetcher.getLiveOdds();
    tests.oddsApi = {
      success: oddsTest.success,
      gamesReturned: oddsTest.count,
      dataFreshness: oddsTest.dataFreshness,
      status: oddsTest.success ? '✅ Working' : '❌ Failed',
      error: oddsTest.error
    };
    console.log(`   ${tests.oddsApi.status}: ${oddsTest.count} games`);

    // Test 2: SportsData.io
    console.log('2️⃣  Testing SportsData.io...');
    const today = new Date().toISOString().split('T')[0];
    const sportsDataTest = await engine.dataFetcher.getGameData(today);
    tests.sportsDataApi = {
      success: sportsDataTest.success,
      gamesReturned: sportsDataTest.count,
      dataFreshness: sportsDataTest.dataFreshness,
      status: sportsDataTest.success ? '✅ Working' : '❌ Failed',
      error: sportsDataTest.error
    };
    console.log(`   ${tests.sportsDataApi.status}: ${sportsDataTest.count} games`);

    // Test 3: Data processing
    console.log('3️⃣  Testing data processing...');
    if (oddsTest.success && oddsTest.games.length > 0) {
      const processed = engine.processor.processOddsData(oddsTest.games[0]);
      tests.dataProcessing = {
        success: true,
        fieldsExtracted: Object.keys(processed).length,
        hasGameId: !!processed.gameId,
        hasOdds: Object.keys(processed.bookOdds).length > 0,
        status: '✅ Working'
      };
      console.log(`   ${tests.dataProcessing.status}: ${tests.dataProcessing.fieldsExtracted} fields extracted`);
    }

    // Test 4: Best odds finder
    console.log('4️⃣  Testing best odds finder...');
    if (oddsTest.success && oddsTest.games.length > 0) {
      const game = engine.processor.processOddsData(oddsTest.games[0]);
      const bestOdds = engine.findBestOdds(game, 'moneyline');
      tests.bestOdds = {
        success: true,
        oddCount: bestOdds.oddCount,
        hasWinner: bestOdds.bestOdds.length > 0,
        status: '✅ Working'
      };
      console.log(`   ${tests.bestOdds.status}: ${bestOdds.oddCount} books offering ML`);
    }

    console.log('\n✅ Integration test complete!\n');

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: tests,
      summary: {
        oddsApiWorking: tests.oddsApi.success,
        sportsDataWorking: tests.sportsDataApi.success,
        dataProcessingWorking: tests.dataProcessing?.success || false,
        bestOddsWorking: tests.bestOdds?.success || false,
        allSystemsGo: tests.oddsApi.success && tests.sportsDataApi.success
      },
      recommendation: tests.oddsApi.success && tests.sportsDataApi.success
        ? '🚀 Ready for production analysis'
        : '⚠️ Check API keys and credentials'
    });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      error: 'Integration test failed',
      message: error.message,
      nextSteps: 'Check ODDS_API_KEY and SPORTSDATA_IO_API_KEY environment variables'
    });
  }
});

module.exports = router;
