/**
 * M9 Terminal - BaseEngine
 * Abstract parent class for all sport-specific engines
 * Defines common interface for Taylor models across all 8 sports
 */

class BaseEngine {
  constructor(sport, config = {}) {
    this.sport = sport;
    this.config = config;
    this.confidenceThreshold = config.confidenceThreshold || 0.50;
    this.signals = [];
    this.predictions = [];
    this.lastUpdated = null;
  }

  /**
   * Analyze a game (must be implemented by child classes)
   */
  async analyzeGame(gameData) {
    throw new Error(`analyzeGame() must be implemented by ${this.sport}Engine`);
  }

  /**
   * Detect 4 universal signals (must be implemented by child classes)
   * 1. Sharp Money
   * 2. Steam
   * 3. Line Value
   * 4. Volume Anomaly
   */
  async detectSignals(gameData) {
    throw new Error(`detectSignals() must be implemented by ${this.sport}Engine`);
  }

  /**
   * Predict game outcome (must be implemented by child classes)
   */
  async predictOutcome(gameData) {
    throw new Error(`predictOutcome() must be implemented by ${this.sport}Engine`);
  }

  /**
   * Calculate value in odds (must be implemented by child classes)
   */
  async calculateValue(odds, prediction) {
    throw new Error(`calculateValue() must be implemented by ${this.sport}Engine`);
  }

  /**
   * Shared utility: Normalize confidence to 0-100 scale
   */
  normalizeConfidence(score) {
    if (typeof score !== 'number') return 0;
    return Math.max(0, Math.min(100, Math.round(score * 100)));
  }

  /**
   * Shared utility: Format standard response
   */
  formatResponse(data) {
    return {
      sport: this.sport,
      timestamp: new Date().toISOString(),
      lastUpdated: this.lastUpdated,
      ...data
    };
  }

  /**
   * Shared utility: Validate game data structure
   */
  validateGameData(gameData) {
    if (!gameData) {
      throw new Error('Game data is required');
    }
    if (!gameData.gameId) {
      throw new Error('Game ID is required');
    }
    if (!gameData.home || !gameData.away) {
      throw new Error('Home and away team data required');
    }
    return true;
  }

  /**
   * Shared utility: Log signal for tracking
   */
  logSignal(signal) {
    this.signals.push({
      ...signal,
      timestamp: new Date().toISOString(),
      sport: this.sport
    });
    return signal;
  }

  /**
   * Shared utility: Get all signals
   */
  getSignals() {
    return this.signals;
  }

  /**
   * Shared utility: Clear old signals (older than 1 hour)
   */
  clearOldSignals(ageMinutes = 60) {
    const cutoff = Date.now() - (ageMinutes * 60 * 1000);
    this.signals = this.signals.filter(s => new Date(s.timestamp).getTime() > cutoff);
  }

  /**
   * Shared utility: Calculate moving average confidence
   */
  getAverageConfidence(numSamples = 10) {
    if (this.signals.length === 0) return 0;
    const recent = this.signals.slice(-numSamples);
    const total = recent.reduce((sum, s) => sum + (s.confidence || 0), 0);
    return Math.round(total / recent.length);
  }

  /**
   * Shared utility: Status report
   */
  getStatus() {
    return {
      sport: this.sport,
      signaturesGenerated: this.signals.length,
      averageConfidence: this.getAverageConfidence(),
      lastUpdated: this.lastUpdated,
      isHealthy: this.signals.length > 0
    };
  }
}

module.exports = BaseEngine;
