/**
 * M9 Terminal - Engine Test Server
 * Deploy and test BaseEngine + EngineRouter on localhost:3010
 */

const express = require('express');
const EngineRouter = require('./engines/engine-router');
const MLBEngine = require('./engines/mlb-engine');

const app = express();
const PORT = process.env.ENGINE_PORT || 3010;

// Initialize router and engines
const router = new EngineRouter();
const mlbEngine = new MLBEngine({
  confidenceThreshold: 0.65
});

router.registerEngine('MLB', mlbEngine);

// Middleware
app.use(express.json());

// ============================================================================
// HEALTH & STATUS ENDPOINTS
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: PORT,
    engines: router.getSports(),
    cache: router.getCacheStats()
  });
});

app.get('/status', (req, res) => {
  res.json(router.getAllStatus());
});

app.get('/status/:sport', (req, res) => {
  try {
    res.json(router.getEngineStatus(req.params.sport));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ============================================================================
// ANALYSIS ENDPOINTS
// ============================================================================

/**
 * POST /analyze/:sport
 * Analyze a single game
 * 
 * Body:
 * {
 *   gameId: "game123",
 *   home: { name: "NYY", wins: 50, gamesPlayed: 100, ... },
 *   away: { name: "BOS", wins: 48, gamesPlayed: 100, ... },
 *   odds: { currentLine: -1.5, openingLine: -1, publicPercent: 65, ... },
 *   date: "2026-06-01",
 *   season: 2026
 * }
 */
app.post('/analyze/:sport', async (req, res) => {
  try {
    const sport = req.params.sport.toUpperCase();
    const result = await router.analyzeGame(sport, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /signals/:sport
 * Get signals for a game (without full analysis)
 */
app.post('/signals/:sport', async (req, res) => {
  try {
    const sport = req.params.sport.toUpperCase();
    const signals = await router.getSignals(sport, req.body);
    res.json({
      sport,
      signals,
      count: signals.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /predict/:sport
 * Get prediction for a game
 */
app.post('/predict/:sport', async (req, res) => {
  try {
    const sport = req.params.sport.toUpperCase();
    const prediction = await router.getPrediction(sport, req.body);
    res.json({
      sport,
      prediction,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /compare
 * Compare signals across multiple sports
 * 
 * Body:
 * {
 *   sports: ['MLB', 'NFL'],
 *   gameData: {
 *     MLB: { gameId: "...", home: {...}, away: {...}, ... },
 *     NFL: { gameId: "...", home: {...}, away: {...}, ... }
 *   }
 * }
 */
app.post('/compare', async (req, res) => {
  try {
    const { sports, gameData } = req.body;
    const comparison = await router.compareSignals(sports, gameData);
    res.json(comparison);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

app.get('/cache', (req, res) => {
  res.json(router.getCacheStats());
});

app.delete('/cache', (req, res) => {
  const message = router.clearCache();
  res.json({ message, timestamp: new Date().toISOString() });
});

app.delete('/cache/:sport', (req, res) => {
  const message = router.clearCache(req.params.sport.toUpperCase());
  res.json({ message, timestamp: new Date().toISOString() });
});

// ============================================================================
// ENGINES ENDPOINTS
// ============================================================================

app.get('/engines', (req, res) => {
  res.json({
    available: router.getSports(),
    total: router.getSports().length,
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║     M9 Terminal - Engine Test Server       ║
╚════════════════════════════════════════════╝

✓ Port: ${PORT}
✓ Engines: ${router.getSports().join(', ')}
✓ Health: GET http://localhost:${PORT}/health
✓ Status: GET http://localhost:${PORT}/status
✓ Analyze: POST http://localhost:${PORT}/analyze/mlb
✓ Signals: POST http://localhost:${PORT}/signals/mlb
✓ Predict: POST http://localhost:${PORT}/predict/mlb

Ready for analysis...
  `);
});

module.exports = app;
