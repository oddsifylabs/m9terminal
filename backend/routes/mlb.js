/**
 * MLB Engine API Route
 * POST /api/mlb/analyze-game
 * 
 * Analyze a single game using the full MLB engine
 */

const express = require('express');
const { MLBEngine } = require('../services/mlb-engine');
const auth = require('../middleware/auth');

const router = express.Router();
const engine = new MLBEngine();

/**
 * POST /api/mlb/analyze-game
 * 
 * Analyze a single MLB game for opportunities
 * 
 * Request body:
 * {
 *   gameId: "MLB_2026_NYY_BOS_20260603",
 *   homeTeam: "Boston Red Sox",
 *   awayTeam: "New York Yankees",
 *   homePitcher: { name: "Nathan Eovaldi", ERA: 3.45, K9: 8.9, ... },
 *   awayPitcher: { name: "Gerrit Cole", ERA: 2.95, K9: 9.8, ... },
 *   odds: {
 *     moneyline: -110,
 *     spread: -5.0,
 *     total: 8.5,
 *     openingLine: -110,
 *     currentLine: -110
 *   },
 *   publicSentiment: {
 *     homePercent: 45,
 *     awayPercent: 55
 *   },
 *   weather: {
 *     temperature: 72,
 *     wind: 8,
 *     windDirection: "NNW",
 *     precipitation: 0
 *   },
 *   movements: [...],
 *   bookData: {...}
 * }
 */
router.post('/analyze-game', auth, async (req, res) => {
  try {
    const { gameId, homeTeam, awayTeam, ...gameData } = req.body;

    // Validate input
    if (!gameId || !homeTeam || !awayTeam) {
      return res.status(400).json({
        error: 'Missing required fields: gameId, homeTeam, awayTeam'
      });
    }

    // Run analysis
    const analysis = await engine.analyzeGame({
      gameId,
      homeTeam,
      awayTeam,
      ...gameData
    });

    // Store in database (if needed)
    // await db.query('INSERT INTO mlb_analyses ...')

    return res.json({
      success: true,
      analysis: {
        gameId: analysis.gameId,
        
        // Top signals
        signals: analysis.signals.slice(0, 3).map(s => ({
          type: s.type,
          confidence: s.confidence,
          strength: s.strength,
          recommendation: s.recommendation
        })),
        
        // Market analysis
        marketIntelligence: {
          lineMovement: analysis.marketIntelligence?.changes,
          velocity: analysis.marketIntelligence?.velocity,
          efficiency: analysis.marketIntelligence?.efficiency
        },
        
        // Model prediction
        prediction: {
          homeWinProbability: analysis.prediction.homeWinProb,
          awayWinProbability: analysis.prediction.awayWinProb,
          adjustments: analysis.prediction.adjustments
        },
        
        // Expected value
        expectedValue: {
          ev: analysis.ev.ev.toFixed(4),
          evPercent: analysis.ev.evPercent.toFixed(2),
          recommendation: analysis.ev.recommendation
        },
        
        // Final opportunity
        opportunity: {
          game: analysis.opportunity.game,
          recommendation: analysis.opportunity.recommendation,
          totalConfidence: analysis.opportunity.totalConfidence.toFixed(0),
          rating: analysis.opportunity.rating,
          betSize: {
            suggestion: analysis.opportunity.betSize.toFixed(2),
            ratio: analysis.opportunity.ratio
          }
        }
      },
      timestamp: new Date(analysis.timestamp).toISOString()
    });

  } catch (error) {
    console.error('MLB analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

/**
 * POST /api/mlb/analyze-day
 * 
 * Analyze all games for a given day
 * Returns top opportunities ranked by confidence
 */
router.post('/analyze-day', auth, async (req, res) => {
  try {
    const { date, games } = req.body;

    if (!games || !Array.isArray(games)) {
      return res.status(400).json({
        error: 'Missing or invalid games array'
      });
    }

    // Analyze all games
    const opportunities = await engine.analyzeMLBDay(games);

    return res.json({
      success: true,
      date,
      topOpportunities: opportunities.slice(0, 10).map(opp => ({
        rank: opportunities.indexOf(opp) + 1,
        gameId: opp.gameId,
        signal: opp.opportunity.recommendation,
        confidence: opp.opportunity.totalConfidence.toFixed(0),
        rating: opp.opportunity.rating,
        betSuggestion: {
          amount: opp.opportunity.betSize.toFixed(2),
          recommendation: opp.opportunity.recommendation
        }
      })),
      summary: {
        gamesAnalyzed: games.length,
        opportunitiesFound: opportunities.filter(
          o => o.opportunity.totalConfidence >= 55
        ).length,
        maximumConfidence: opportunities.filter(
          o => o.opportunity.totalConfidence >= 85
        ).length
      }
    });

  } catch (error) {
    console.error('MLB day analysis error:', error);
    res.status(500).json({
      error: 'Day analysis failed',
      message: error.message
    });
  }
});

/**
 * GET /api/mlb/opportunities
 * 
 * Get today's top opportunities (with optional filters)
 */
router.get('/opportunities', auth, async (req, res) => {
  try {
    const { minConfidence = 70 } = req.query;

    // Fetch from database
    // const opportunities = await db.query(
    //   `SELECT * FROM mlb_analyses 
    //    WHERE confidence >= $1 
    //    AND date = CURRENT_DATE
    //    ORDER BY confidence DESC
    //    LIMIT 20`,
    //   [minConfidence]
    // );

    // Mock response
    const mockOpportunities = [
      {
        id: 1,
        gameId: 'MLB_2026_NYY_BOS_20260603',
        opportunity: 'Yankees ML',
        confidence: 84,
        rating: 'A+ (MAXIMUM)',
        recommendation: 'Full Kelly',
        betSize: 2800,
        signals: 3,
        ev: 0.28,
        evPercent: 28
      },
      {
        id: 2,
        gameId: 'MLB_2026_NYY_BOS_20260603',
        opportunity: 'Over 8.5',
        confidence: 72,
        rating: 'A (HIGH)',
        recommendation: 'Half Kelly',
        betSize: 1400,
        signals: 2,
        ev: 0.12,
        evPercent: 12
      }
    ];

    return res.json({
      success: true,
      opportunities: mockOpportunities,
      summary: {
        total: mockOpportunities.length,
        maximumConfidence: mockOpportunities.filter(o => o.confidence >= 85).length,
        highConfidence: mockOpportunities.filter(o => o.confidence >= 70).length
      }
    });

  } catch (error) {
    console.error('Opportunities fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch opportunities',
      message: error.message
    });
  }
});

/**
 * GET /api/mlb/signal/:type
 * 
 * Get all opportunities with a specific signal type
 * E.g., /api/mlb/signal/RLM
 */
router.get('/signal/:type', auth, (req, res) => {
  const { type } = req.params;

  const validSignals = ['STEAM', 'SHARP_MONEY', 'RLM', 'LIQUIDITY'];

  if (!validSignals.includes(type.toUpperCase())) {
    return res.status(400).json({
      error: 'Invalid signal type',
      validTypes: validSignals
    });
  }

  // Fetch from database where signal_type = type
  // For now, mock response

  return res.json({
    success: true,
    signalType: type,
    opportunities: [
      {
        gameId: 'MLB_2026_NYY_BOS_20260603',
        signal: type,
        confidence: 0.92,
        recommendation: 'FOLLOW THE SHARPS'
      }
    ]
  });
});

/**
 * POST /api/mlb/test
 * 
 * Test the MLB engine with sample data
 */
router.post('/test', async (req, res) => {
  try {
    // Sample game data
    const sampleGame = {
      gameId: 'MLB_2026_NYY_BOS_20260603',
      homeTeam: {
        name: 'Boston Red Sox',
        OPS: 0.795,
        ERA: 3.75,
        runsPerGame: 4.15,
        last10Wins: 4,
        last10Avg: 4.2,
        seasonAvg: 4.15
      },
      awayTeam: {
        name: 'New York Yankees',
        OPS: 0.825,
        ERA: 3.45,
        runsPerGame: 4.85,
        last10Wins: 5,
        last10Avg: 5.1,
        seasonAvg: 4.85
      },
      homePitcher: {
        name: 'Nathan Eovaldi',
        ERA: 3.45,
        K9: 8.9,
        recentERA: 4.20,
        innings: 45
      },
      awayPitcher: {
        name: 'Gerrit Cole',
        ERA: 2.95,
        K9: 9.8,
        recentERA: 2.15,
        innings: 50
      },
      odds: {
        moneyline: -110,
        spread: -5.0,
        total: 8.5,
        openingLine: -110,
        currentLine: -110,
        lineMovement: {
          direction: 'AWAY',
          magnitude: 0.5
        }
      },
      publicSentiment: {
        homePercent: 45,
        awayPercent: 55
      },
      weather: {
        temperature: 72,
        wind: 8,
        windDirection: 'NNW',
        precipitation: 0
      },
      ballpark: {
        name: 'Fenway Park',
        runFactor: 0.95,
        homeRunFactor: 1.05
      },
      homeInjuries: [],
      awayInjuries: [],
      movements: [
        {
          timestamp: Date.now() - 3600000,
          book: 'DraftKings',
          line: -110,
          volume: 100000,
          source: 'opening'
        },
        {
          timestamp: Date.now() - 1800000,
          book: 'BetMGM',
          line: -115,
          volume: 500000,
          source: 'sharp'
        }
      ],
      bookData: {
        professional: ['DraftKings', 'BetMGM', 'BetRivers'],
        casual: ['FanDuel', 'Caesars']
      }
    };

    // Run analysis
    const result = await engine.analyzeGame(sampleGame);

    return res.json({
      success: true,
      result,
      message: 'MLB Engine test completed successfully'
    });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      error: 'Test failed',
      message: error.message
    });
  }
});

module.exports = router;
