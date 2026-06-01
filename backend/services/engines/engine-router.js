/**
 * M9 Terminal - Engine Router
 * Central dispatcher that routes analysis requests to the correct sport engine
 * Supports all 8 sports with extensible design
 */

const BaseEngine = require('./base-engine');

class EngineRouter {
  constructor() {
    this.engines = new Map();
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes per sport
    this.performanceMetrics = new Map();
  }

  /**
   * Register an engine for a sport
   */
  registerEngine(sportId, engine) {
    if (!(engine instanceof BaseEngine)) {
      throw new Error(`Engine must extend BaseEngine, got ${engine.constructor.name}`);
    }
    this.engines.set(sportId, engine);
    this.performanceMetrics.set(sportId, {
      analysisCount: 0,
      averageResponseTime: 0,
      lastAnalyzed: null
    });
    console.log(`✓ Engine registered: ${sportId}`);
  }

  /**
   * Get engine for a sport
   */
  getEngine(sportId) {
    if (!this.engines.has(sportId)) {
      throw new Error(`No engine registered for sport: ${sportId}`);
    }
    return this.engines.get(sportId);
  }

  /**
   * List all registered sports
   */
  getSports() {
    return Array.from(this.engines.keys());
  }

  /**
   * Analyze a game (main entry point)
   */
  async analyzeGame(sportId, gameData) {
    const startTime = Date.now();
    
    try {
      const engine = this.getEngine(sportId);
      
      // Check cache first
      const cacheKey = `${sportId}:${gameData.gameId}`;
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheExpiry) {
          return {
            ...cached.data,
            fromCache: true
          };
        }
      }
      
      // Validate data
      engine.validateGameData(gameData);
      
      // Perform analysis
      const analysis = await engine.analyzeGame(gameData);
      
      // Detect signals
      const signals = await engine.detectSignals(gameData);
      
      // Make prediction
      const prediction = await engine.predictOutcome(gameData);
      
      // Calculate value
      const value = gameData.odds ? await engine.calculateValue(gameData.odds, prediction) : null;
      
      // Format response
      const response = engine.formatResponse({
        gameId: gameData.gameId,
        analysis,
        signals,
        prediction,
        value,
        confidence: engine.getAverageConfidence()
      });
      
      // Cache result
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      
      // Update metrics
      this.updateMetrics(sportId, Date.now() - startTime);
      
      return response;
    } catch (error) {
      console.error(`Analysis error (${sportId}):`, error.message);
      throw error;
    }
  }

  /**
   * Get signals for a game
   */
  async getSignals(sportId, gameData) {
    const engine = this.getEngine(sportId);
    engine.validateGameData(gameData);
    return await engine.detectSignals(gameData);
  }

  /**
   * Get prediction for a game
   */
  async getPrediction(sportId, gameData) {
    const engine = this.getEngine(sportId);
    engine.validateGameData(gameData);
    return await engine.predictOutcome(gameData);
  }

  /**
   * Compare signals across sports
   */
  async compareSignals(sports, gameDataMap) {
    const comparison = {
      timestamp: new Date().toISOString(),
      sports: {},
      summary: {
        totalSignals: 0,
        highestConfidence: 0,
        lowestConfidence: 100,
        averageConfidence: 0
      }
    };

    let totalConfidence = 0;
    let signalCount = 0;

    for (const sportId of sports) {
      if (!gameDataMap[sportId]) continue;
      
      try {
        const signals = await this.getSignals(sportId, gameDataMap[sportId]);
        comparison.sports[sportId] = signals;
        
        signals.forEach(signal => {
          signalCount++;
          const conf = signal.confidence || 0;
          totalConfidence += conf;
          comparison.summary.highestConfidence = Math.max(comparison.summary.highestConfidence, conf);
          comparison.summary.lowestConfidence = Math.min(comparison.summary.lowestConfidence, conf);
        });
      } catch (error) {
        console.error(`Comparison error (${sportId}):`, error.message);
      }
    }

    if (signalCount > 0) {
      comparison.summary.totalSignals = signalCount;
      comparison.summary.averageConfidence = Math.round(totalConfidence / signalCount);
    }

    return comparison;
  }

  /**
   * Get engine status
   */
  getEngineStatus(sportId) {
    const engine = this.getEngine(sportId);
    const metrics = this.performanceMetrics.get(sportId) || {};
    
    return {
      sport: sportId,
      engineStatus: engine.getStatus(),
      performance: metrics
    };
  }

  /**
   * Get all engines status
   */
  getAllStatus() {
    const status = {};
    for (const sportId of this.engines.keys()) {
      status[sportId] = this.getEngineStatus(sportId);
    }
    return status;
  }

  /**
   * Update performance metrics
   */
  updateMetrics(sportId, responseTime) {
    const metrics = this.performanceMetrics.get(sportId);
    if (!metrics) return;

    metrics.analysisCount++;
    metrics.lastAnalyzed = new Date().toISOString();
    
    // Calculate moving average response time
    const currentAvg = metrics.averageResponseTime || 0;
    metrics.averageResponseTime = 
      (currentAvg * (metrics.analysisCount - 1) + responseTime) / metrics.analysisCount;
  }

  /**
   * Clear cache for specific sport or all
   */
  clearCache(sportId = null) {
    if (sportId) {
      const keysToDelete = [];
      for (const [key] of this.cache) {
        if (key.startsWith(`${sportId}:`)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => this.cache.delete(key));
      return `Cleared ${keysToDelete.length} cache entries for ${sportId}`;
    } else {
      const count = this.cache.size;
      this.cache.clear();
      return `Cleared all ${count} cache entries`;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      ttlMs: this.cacheExpiry,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = EngineRouter;
