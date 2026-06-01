/**
 * M9 Terminal - Engine Integration Route
 * Connect EngineRouter to main backend API
 * Available at /api/engine/*
 */

const express = require('express');
const router = express.Router();
const EngineRouter = require('../services/engines/engine-router');
const MLBEngine = require('../services/engines/mlb-engine');

// Initialize engines
const engineRouter = new EngineRouter();
const mlbEngine = new MLBEngine({
  confidenceThreshold: 0.65
});
engineRouter.registerEngine('MLB', mlbEngine);

// ============================================================================
// HEALTH & STATUS
// ============================================================================

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    engines: engineRouter.getSports(),
    timestamp: new Date().toISOString()
  });
});

router.get('/status', (req, res) => {
  res.json(engineRouter.getAllStatus());
});

router.get('/status/:sport', (req, res) => {
  try {
    res.json(engineRouter.getEngineStatus(req.params.sport.toUpperCase()));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ============================================================================
// ANALYSIS
// ============================================================================

/**
 * POST /api/engine/analyze/:sport
 * Analyze a game
 */
router.post('/analyze/:sport', async (req, res) => {
  try {
    const sport = req.params.sport.toUpperCase();
    const result = await engineRouter.analyzeGame(sport, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/engine/signals/:sport
 * Get signals only
 */
router.post('/signals/:sport', async (req, res) => {
  try {
    const sport = req.params.sport.toUpperCase();
    const signals = await engineRouter.getSignals(sport, req.body);
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
 * POST /api/engine/predict/:sport
 * Get prediction only
 */
router.post('/predict/:sport', async (req, res) => {
  try {
    const sport = req.params.sport.toUpperCase();
    const prediction = await engineRouter.getPrediction(sport, req.body);
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
 * POST /api/engine/compare
 * Compare signals across sports
 */
router.post('/compare', async (req, res) => {
  try {
    const { sports, gameData } = req.body;
    const comparison = await engineRouter.compareSignals(sports, gameData);
    res.json(comparison);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================================================
// CACHE
// ============================================================================

router.get('/cache', (req, res) => {
  res.json(engineRouter.getCacheStats());
});

router.delete('/cache', (req, res) => {
  const message = engineRouter.clearCache();
  res.json({ message, timestamp: new Date().toISOString() });
});

router.delete('/cache/:sport', (req, res) => {
  const message = engineRouter.clearCache(req.params.sport.toUpperCase());
  res.json({ message, timestamp: new Date().toISOString() });
});

// ============================================================================
// ENGINES
// ============================================================================

router.get('/engines', (req, res) => {
  res.json({
    available: engineRouter.getSports(),
    total: engineRouter.getSports().length,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
