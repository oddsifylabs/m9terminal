/**
 * M9 Terminal - MLB Engine (Extended from BaseEngine)
 * Baseball-specific Taylor model with all 4 signal detections
 */

const BaseEngine = require('./base-engine');

class MLBEngine extends BaseEngine {
  constructor(config = {}) {
    super('MLB', config);
    this.minVolume = config.minVolume || 50000;
    this.sharpBookThreshold = config.sharpBookThreshold || 0.65;
  }

  /**
   * Main analysis method - entry point
   */
  async analyzeGame(gameData) {
    this.validateGameData(gameData);
    
    const gameId = gameData.gameId;
    const home = gameData.home;
    const away = gameData.away;
    const odds = gameData.odds || {};

    // MLB-specific analysis
    const homeRating = this.evaluateTeamStrength(home);
    const awayRating = this.evaluateTeamStrength(away);
    const estimatedSpread = (homeRating - awayRating) / 10;

    return {
      gameId,
      homeTeam: home.name,
      awayTeam: away.name,
      homeRating,
      awayRating,
      estimatedSpread,
      season: gameData.season || new Date().getFullYear(),
      date: gameData.date || new Date().toISOString()
    };
  }

  /**
   * Detect all 4 signals specific to MLB
   */
  async detectSignals(gameData) {
    const signals = [];

    // 1. Sharp Money Signal
    const sharpSignal = this.detectSharpMoney(gameData);
    if (sharpSignal) signals.push(this.logSignal(sharpSignal));

    // 2. Steam Signal
    const steamSignal = this.detectSteam(gameData);
    if (steamSignal) signals.push(this.logSignal(steamSignal));

    // 3. Line Value Signal
    const valueSignal = this.detectLineValue(gameData);
    if (valueSignal) signals.push(this.logSignal(valueSignal));

    // 4. Volume Anomaly Signal
    const volumeSignal = this.detectVolumeAnomaly(gameData);
    if (volumeSignal) signals.push(this.logSignal(volumeSignal));

    return signals;
  }

  /**
   * SIGNAL 1: Sharp Money Detection
   * Professional books aligned early, before public
   */
  detectSharpMoney(gameData) {
    const odds = gameData.odds || {};
    const movements = odds.movements || [];
    const books = odds.bookList || [];

    if (movements.length < 2) return null;

    // Professional books (higher limits, sharper)
    const professionalBooks = ['Pinny', 'Apex', 'SBR', '5Dimes'];
    const casualBooks = ['DraftKings', 'FanDuel', 'BetMGM'];

    // Find first pro book movement
    const firstProMove = movements.find(m => 
      professionalBooks.includes(m.book)
    );

    if (!firstProMove) return null;

    // Check alignment within 30 minutes
    const alignmentWindow = 30 * 60 * 1000;
    const alignedMoves = movements.filter(m =>
      m.timestamp <= firstProMove.timestamp + alignmentWindow &&
      m.timestamp >= firstProMove.timestamp &&
      professionalBooks.includes(m.book) &&
      Math.abs(m.line - firstProMove.line) < 0.25
    );

    if (alignedMoves.length >= 2) {
      return {
        type: 'SHARP_MONEY',
        confidence: Math.min(95, 70 + (alignedMoves.length * 5)),
        signal: `${alignedMoves.length} sharp books aligned early`,
        firstMover: firstProMove.book,
        alignment: `${alignedMoves.length}/${professionalBooks.length} pro books`,
        lineOrientation: firstProMove.line > 0 ? 'HOME' : 'AWAY',
        strength: alignedMoves.length >= 3 ? 'VERY_STRONG' : 'STRONG'
      };
    }

    return null;
  }

  /**
   * SIGNAL 2: Steam Detection
   * Public betting one way, line moves same direction
   */
  detectSteam(gameData) {
    const odds = gameData.odds || {};
    const publicPercent = odds.publicPercent || 50;
    const openLine = odds.openingLine || odds.currentLine || 0;
    const currentLine = odds.currentLine || openLine;
    const volume = odds.totalVolume || 0;

    // Public heavily on one side?
    const publicHeavy = publicPercent > 70 || publicPercent < 30;
    if (!publicHeavy) return null;

    // Did line move WITH public (true steam)?
    const movement = currentLine - openLine;
    const movedWithPublic = 
      (publicPercent > 70 && movement > 0) ||
      (publicPercent < 30 && movement < 0);

    if (!movedWithPublic) return null;

    const movementPercent = Math.abs(movement) / Math.abs(Math.max(1, openLine)) * 100;

    return {
      type: 'STEAM',
      confidence: 70 + Math.min(20, movementPercent * 2),
      signal: `Public ${publicPercent}% on side, line moved with steam`,
      publicPercent,
      movement: movement,
      movementPercent: Math.round(movementPercent * 10) / 10,
      volumeSpike: volume > 500000,
      strength: volume > 500000 ? 'STRONG' : 'MODERATE'
    };
  }

  /**
   * SIGNAL 3: Line Value Detection
   * Estimated true line differs from market line
   */
  detectLineValue(gameData) {
    const odds = gameData.odds || {};
    const currentLine = odds.currentLine || 0;
    const trueLineEstimate = this.calculateTrueLine(gameData) || 0;

    const valueGap = Math.abs(currentLine - trueLineEstimate);

    // Is there >0.5 point gap indicating value?
    if (valueGap < 0.5) return null;

    const isUndervalued = trueLineEstimate < currentLine;
    const isOvervalued = trueLineEstimate > currentLine;

    return {
      type: 'LINE_VALUE',
      confidence: 65 + Math.min(25, valueGap * 10),
      signal: isUndervalued ? 'AWAY_UNDERVALUED' : 'HOME_UNDERVALUED',
      currentLine,
      estimatedLine: Math.round(trueLineEstimate * 100) / 100,
      gap: Math.round(valueGap * 100) / 100,
      direction: isUndervalued ? 'AWAY' : 'HOME',
      strength: valueGap > 1.5 ? 'STRONG' : 'MODERATE'
    };
  }

  /**
   * SIGNAL 4: Volume Anomaly Detection
   * Unusual betting volume on one side
   */
  detectVolumeAnomaly(gameData) {
    const odds = gameData.odds || {};
    const volume = odds.totalVolume || 0;
    const avgVolume = odds.averageVolume || 50000;
    const homeVolume = odds.homeVolume || 0;
    const awayVolume = odds.awayVolume || 0;

    const volumeRatio = volume / Math.max(1, avgVolume);

    // Is volume >2x normal?
    if (volumeRatio < 1.5) return null;

    const sideVolume = Math.max(homeVolume, awayVolume);
    const sidePercent = (sideVolume / Math.max(1, volume)) * 100;

    return {
      type: 'VOLUME_ANOMALY',
      confidence: 60 + Math.min(30, (volumeRatio - 1) * 20),
      signal: `${Math.round(volumeRatio * 10) / 10}x normal volume`,
      currentVolume: volume,
      averageVolume: avgVolume,
      volumeRatio: Math.round(volumeRatio * 100) / 100,
      sidedPercent: Math.round(sidePercent),
      side: homeVolume > awayVolume ? 'HOME' : 'AWAY',
      strength: volumeRatio > 3 ? 'VERY_STRONG' : 'STRONG'
    };
  }

  /**
   * Predict game outcome
   */
  async predictOutcome(gameData) {
    this.validateGameData(gameData);

    const signals = await this.detectSignals(gameData);
    const analysis = await this.analyzeGame(gameData);

    // Aggregate signal confidence
    const confidence = signals.length > 0 
      ? Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length)
      : 50;

    // Determine side based on strongest signals
    let predictedSide = 'FLAT';
    let edgePercent = 0;

    if (signals.length > 0) {
      const sharpSignal = signals.find(s => s.type === 'SHARP_MONEY');
      const valueSignal = signals.find(s => s.type === 'LINE_VALUE');
      
      if (sharpSignal || valueSignal) {
        predictedSide = sharpSignal?.lineOrientation || valueSignal?.direction || 'FLAT';
        edgePercent = confidence > 75 ? 3 : confidence > 65 ? 2 : 1;
      }
    }

    return {
      gameId: gameData.gameId,
      predictedSide,
      confidence,
      edgePercent,
      signalCount: signals.length,
      recommendation: confidence > 75 ? 'STRONG_PLAY' : confidence > 60 ? 'PLAY' : 'MONITOR'
    };
  }

  /**
   * Calculate value in odds
   */
  async calculateValue(odds, prediction) {
    if (!prediction || prediction.predictedSide === 'FLAT') {
      return { value: 0, recommendation: 'NO_VALUE' };
    }

    const impliedProb = this.oddsToProb(odds.moneyline || odds.spread || 0);
    const trueProbability = (prediction.confidence / 100);
    const valueEdge = trueProbability - impliedProb;

    return {
      impliedProbability: Math.round(impliedProb * 1000) / 10,
      trueProbability: Math.round(trueProbability * 1000) / 10,
      valueEdge: Math.round(valueEdge * 1000) / 10,
      expectedValue: valueEdge > 0.05 ? 'POSITIVE' : 'NEGATIVE',
      recommendation: valueEdge > 0.1 ? 'STRONG_BET' : valueEdge > 0.05 ? 'BET' : 'SKIP'
    };
  }

  // ========== HELPER METHODS ==========

  /**
   * Evaluate team strength (0-100 scale)
   */
  evaluateTeamStrength(team) {
    if (!team) return 50;
    
    const winPercent = (team.wins || 0) / Math.max(1, team.gamesPlayed || 1);
    const pythag = (team.runsFor || 1) / ((team.runsFor || 1) + (team.runsAgainst || 1));
    const trends = this.calculateRecentTrends(team.recentGames || []);

    return Math.round((winPercent * 40 + pythag * 40 + trends * 20) * 100);
  }

  /**
   * Calculate recent form (last 10 games)
   */
  calculateRecentTrends(recentGames) {
    if (recentGames.length === 0) return 0.5;
    const wins = recentGames.filter(g => g.result === 'W').length;
    return wins / recentGames.length;
  }

  /**
   * Estimate true spread based on team strength
   */
  calculateTrueLine(gameData) {
    if (!gameData.home || !gameData.away) return 0;
    
    const homeRating = this.evaluateTeamStrength(gameData.home);
    const awayRating = this.evaluateTeamStrength(gameData.away);
    
    return (homeRating - awayRating) / 10;
  }

  /**
   * Convert moneyline to implied probability
   */
  oddsToProb(odds) {
    if (odds > 0) {
      return 100 / (odds + 100);
    } else {
      return Math.abs(odds) / (Math.abs(odds) + 100);
    }
  }
}

module.exports = MLBEngine;
