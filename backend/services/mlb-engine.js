/**
 * M9 Terminal — MLB Engine
 * Signal Detection + Market Intelligence + Predictive Analytics
 * 
 * This is the world-class framework for MLB market analysis
 */

// ============================================================================
// 1. SIGNAL DETECTION ENGINE
// ============================================================================

class MLBSignalDetector {
  /**
   * Detect steam, sharp money, RLM, and liquidity signals
   */
  
  constructor(options = {}) {
    this.signals = [];
    this.confidenceThreshold = options.confidenceThreshold || 0.70;
    this.windowSize = options.windowSize || 300000; // 5 minutes
  }

  /**
   * STEAM DETECTION
   * Public betting one way, line moves same way
   */
  detectSteam(odds, publicSentiment, volume) {
    const {
      openingLine,
      currentLine,
      timestamp,
      bookVolume,
      publicPercent
    } = odds;

    // Calculate movement direction
    const movement = currentLine - openingLine;
    const movementPercent = (Math.abs(movement) / Math.abs(openingLine)) * 100;

    // Is public heavily on one side?
    const isPublicHeavy = publicPercent > 65 || publicPercent < 35;

    // Did line move WITH public (steam)?
    const movedWithPublic = 
      (publicPercent > 65 && movement > 0) || 
      (publicPercent < 35 && movement < 0);

    // Volume spike indicator
    const volumeSpike = bookVolume > 500_000;

    if (isPublicHeavy && movedWithPublic && movementPercent > 3) {
      return {
        type: 'STEAM',
        confidence: 0.75,
        movement: movement,
        movementPercent: movementPercent,
        publicPercent: publicPercent,
        volumeSpike: volumeSpike,
        strength: volumeSpike ? 'STRONG' : 'MODERATE',
        recommendation: 'Consensus play - low edge but market direction confirmed',
        timestamp: timestamp
      };
    }

    return null;
  }

  /**
   * SHARP MONEY DETECTION
   * Professional books aligned early, before public
   */
  detectSharpMoney(movements, bookData) {
    /**
     * movements = [{timestamp, book, line, volume}, ...]
     * bookData = {professional: [...], casual: [...]}
     */

    // Sort by timestamp
    const sorted = movements.sort((a, b) => a.timestamp - b.timestamp);

    // Did professional books move FIRST and ALIGNED?
    const professionalBooks = bookData.professional;
    const firstProfessionalMove = sorted.find(m => 
      professionalBooks.includes(m.book)
    );

    if (!firstProfessionalMove) return null;

    // Check if other professional books aligned shortly after
    const alignmentWindow = 15 * 60 * 1000; // 15 minutes
    const alignedBooks = sorted.filter(m => 
      m.timestamp <= firstProfessionalMove.timestamp + alignmentWindow &&
      m.timestamp >= firstProfessionalMove.timestamp &&
      professionalBooks.includes(m.book) &&
      Math.abs(m.line - firstProfessionalMove.line) < 0.25
    );

    // Is alignment strong enough?
    if (alignedBooks.length >= 2) {
      return {
        type: 'SHARP_MONEY',
        confidence: 0.90,
        moveTime: firstProfessionalMove.timestamp,
        alignedBooks: alignedBooks.length,
        direction: firstProfessionalMove.line,
        strength: 'VERY_STRONG',
        recommendation: 'FOLLOW THE SHARPS - highest confidence signal',
        publicVsSharpLag: this.calculatePublicLag(sorted, firstProfessionalMove),
        timestamp: firstProfessionalMove.timestamp
      };
    }

    return null;
  }

  calculatePublicLag(movements, sharpMove) {
    // Find when public volume arrives
    const publicVolumeStart = movements.find(m => 
      m.timestamp > sharpMove.timestamp && 
      m.volume > 100_000
    );

    if (publicVolumeStart) {
      return publicVolumeStart.timestamp - sharpMove.timestamp;
    }
    return null;
  }

  /**
   * REVERSE LINE MOVEMENT
   * Most powerful signal - public betting one way, line opposite
   */
  detectRLM(publicBetting, lineMovement) {
    const { homePercent, awayPercent } = publicBetting;
    const { direction, magnitude } = lineMovement;

    // Public heavily on one side?
    const publicFavorite = homePercent > 60 ? 'HOME' : 
                          awayPercent > 60 ? 'AWAY' : null;

    if (!publicFavorite) return null;

    // Line moved OPPOSITE?
    const isFavoring = direction === publicFavorite ? 'SAME' : 'OPPOSITE';

    if (isFavoring === 'OPPOSITE' && magnitude > 0.5) {
      return {
        type: 'RLM',
        confidence: 0.95,
        publicPercent: publicFavorite === 'HOME' ? homePercent : awayPercent,
        lineFavors: direction,
        movement: magnitude,
        interpretation: `Sharps fading public (${publicFavorite} got ${homePercent}% public bets, but line favors ${direction})`,
        strength: 'ABSOLUTE_STRONGEST',
        recommendation: 'MAXIMUM EDGE - historical win rate 58%+',
        timestamp: Date.now()
      };
    }

    return null;
  }

  /**
   * LIQUIDITY SIGNALS
   * Tight spreads + high volume = informed money
   */
  detectLiquidity(currentSpread, averageSpread, volume, hourlyAverage) {
    const spreadTightness = (averageSpread - currentSpread) / averageSpread;
    const volumeMultiplier = volume / hourlyAverage;

    // Both signs of informed money?
    if (spreadTightness > 0.4 && volumeMultiplier > 3.0) {
      return {
        type: 'LIQUIDITY',
        confidence: 0.80,
        spreadTightness: spreadTightness,
        volumeMultiplier: volumeMultiplier,
        interpretation: 'Informed participants confident in their view',
        strength: 'STRONG',
        recommendation: 'Confirms other signals - use as confluence',
        timestamp: Date.now()
      };
    }

    return null;
  }

  /**
   * RUN ALL DETECTORS
   */
  async detectAllSignals(gameData) {
    const {
      odds,
      publicSentiment,
      movements,
      bookData,
      spread,
      volume
    } = gameData;

    const signals = [
      this.detectSteam(odds, publicSentiment, volume),
      this.detectSharpMoney(movements, bookData),
      this.detectRLM(publicSentiment, odds.lineMovement),
      this.detectLiquidity(spread.current, spread.average, volume.current, volume.hourlyAvg)
    ].filter(s => s !== null);

    return signals.sort((a, b) => b.confidence - a.confidence);
  }
}

// ============================================================================
// 2. MARKET INTELLIGENCE ENGINE
// ============================================================================

class MLBMarketIntelligence {
  /**
   * Track line movement, correlations, sportsbook comparison
   */

  constructor() {
    this.lineHistory = new Map(); // gameId -> movements
    this.correlations = {};
  }

  /**
   * TRACK LINE MOVEMENT
   */
  recordLineMovement(gameId, movement) {
    if (!this.lineHistory.has(gameId)) {
      this.lineHistory.set(gameId, []);
    }

    this.lineHistory.get(gameId).push({
      timestamp: Date.now(),
      ml: movement.moneyline,
      spread: movement.spread,
      total: movement.total,
      volume: movement.volume,
      source: movement.source // "opening", "sharp", "public", "final"
    });
  }

  /**
   * ANALYZE MOVEMENT
   */
  analyzeMovement(gameId) {
    const movements = this.lineHistory.get(gameId);
    if (!movements || movements.length < 2) return null;

    const opening = movements[0];
    const current = movements[movements.length - 1];

    const mlChange = current.ml - opening.ml;
    const spreadChange = current.spread - opening.spread;
    const totalChange = current.total - opening.total;

    return {
      gameId,
      opening: opening,
      current: current,
      changes: {
        ml: mlChange,
        spread: spreadChange,
        total: totalChange
      },
      velocity: this.calculateVelocity(movements),
      efficiency: this.calculateEfficiency(movements)
    };
  }

  calculateVelocity(movements) {
    // Fast movement = sharp money, slow = public
    const timespan = movements[movements.length - 1].timestamp - movements[0].timestamp;
    const totalMovement = Math.abs(movements[movements.length - 1].ml - movements[0].ml);
    return totalMovement / (timespan / 60000); // movement per minute
  }

  calculateEfficiency(movements) {
    // How much did line move vs how much volume came in?
    const totalVolume = movements.reduce((sum, m) => sum + m.volume, 0);
    const totalMove = Math.abs(movements[movements.length - 1].ml - movements[0].ml);
    return totalMove / (totalVolume / 1_000_000); // move per million in volume
  }

  /**
   * CORRELATION ANALYSIS
   */
  analyzeCorrelations(gameId, games) {
    const game = games.find(g => g.id === gameId);
    if (!game) return null;

    return {
      spreadTotal: {
        relationship: this.analyzeSpreadTotalCorrelation(game),
        anomaly: false
      },
      teamMovements: {
        correlation: this.analyzeTeamMovementCorrelation(game, games),
        interpretation: null
      },
      crossBook: {
        variance: this.analyzeCrossBookVariance(game),
        outliers: null
      }
    };
  }

  analyzeSpreadTotalCorrelation(game) {
    // Wider spreads usually = higher totals
    // Deviation = opportunity
    const expected = game.spread * 0.85 + 4.0; // rough formula
    const actual = game.total;
    const deviation = actual - expected;

    return {
      expected,
      actual,
      deviation,
      isAnomaly: Math.abs(deviation) > 0.5
    };
  }

  analyzeTeamMovementCorrelation(game, games) {
    // Do team totals match expected scoring?
    const homeTotal = game.homeTeamTotal;
    const awayTotal = game.awayTeamTotal;
    const expectedTotal = game.total;

    return {
      homeTeamTotal: homeTotal,
      awayTeamTotal: awayTotal,
      expectedSum: expectedTotal,
      actual: homeTotal + awayTotal,
      balanced: Math.abs((homeTotal + awayTotal) - expectedTotal) < 0.3
    };
  }

  analyzeCrossBookVariance(game) {
    // Which book is outlier? Usually the outlier is most informed
    const lines = game.lines; // {book: line}
    const average = Object.values(lines).reduce((a, b) => a + b) / Object.keys(lines).length;

    const variance = Object.entries(lines).map(([book, line]) => ({
      book,
      line,
      deviation: line - average,
      isOutlier: Math.abs(line - average) > 0.25
    }));

    return {
      average,
      variance,
      sharpOutlier: variance.find(v => v.isOutlier)?.book
    };
  }

  /**
   * SPORTSBOOK COMPARISON
   */
  findBestOdds(gameId, market, games) {
    const game = games.find(g => g.id === gameId);
    if (!game) return null;

    const lines = game.lines[market] || {}; // {DraftKings: -110, BetMGM: -105, ...}

    // For ML/Spread: best odds for favorite is lowest negative, for underdog is highest
    // For O/U: best O odds is highest, best U odds is lowest

    const sorted = Object.entries(lines)
      .sort((a, b) => {
        // Assuming moneyline/spread - higher is better (less juice to pay)
        return b[1] - a[1];
      });

    return {
      best: { book: sorted[0][0], line: sorted[0][1] },
      worst: { book: sorted[sorted.length - 1][0], line: sorted[sorted.length - 1][1] },
      all: sorted.map(([book, line]) => ({ book, line })),
      edgeVsBest: sorted.map(([book, line]) => ({
        book,
        line,
        vsWorse: line - sorted[sorted.length - 1][1]
      }))
    };
  }
}

// ============================================================================
// 3. PREDICTIVE ANALYTICS ENGINE
// ============================================================================

class MLBPredictiveModel {
  /**
   * Win probability + Over/Under + Player props
   */

  constructor(options = {}) {
    this.modelWeights = {
      pitching: 0.40,
      teamQuality: 0.20,
      injuries: 0.20,
      weather: 0.10,
      recentForm: 0.10
    };
  }

  /**
   * WIN PROBABILITY MODEL
   */
  predictWinProbability(homeTeam, awayTeam, game) {
    // Start at 50-50
    let homeWinProb = 0.500;

    // Pitching adjustment (40% weight)
    const pitchingAdj = this.getPitchingAdjustment(
      game.homePitcher,
      game.awayPitcher
    );
    homeWinProb += pitchingAdj * this.modelWeights.pitching;

    // Team quality (20% weight)
    const teamQualityAdj = this.getTeamQualityAdjustment(homeTeam, awayTeam);
    homeWinProb += teamQualityAdj * this.modelWeights.teamQuality;

    // Injuries (20% weight)
    const injuryAdj = this.getInjuryAdjustment(game.homeInjuries, game.awayInjuries);
    homeWinProb += injuryAdj * this.modelWeights.injuries;

    // Weather (10% weight)
    const weatherAdj = this.getWeatherAdjustment(game.weather, game.ballpark);
    homeWinProb += weatherAdj * this.modelWeights.weather;

    // Recent form (10% weight)
    const formAdj = this.getRecentFormAdjustment(homeTeam, awayTeam);
    homeWinProb += formAdj * this.modelWeights.recentForm;

    // Clamp to 0-1
    homeWinProb = Math.max(0, Math.min(1, homeWinProb));

    return {
      homeWinProb: homeWinProb,
      awayWinProb: 1 - homeWinProb,
      adjustments: {
        pitching: pitchingAdj,
        teamQuality: teamQualityAdj,
        injuries: injuryAdj,
        weather: weatherAdj,
        recentForm: formAdj
      }
    };
  }

  getPitchingAdjustment(homePitcher, awayPitcher) {
    /**
     * Compare ERA, K/9, recent form
     * Scale: -0.15 to +0.15
     */
    const eraAdj = (awayPitcher.ERA - homePitcher.ERA) * 0.05;
    const k9Adj = (homePitcher.K9 - awayPitcher.K9) * 0.02;
    const recentAdj = (homePitcher.recentERA - awayPitcher.recentERA) * 0.03;

    return eraAdj + k9Adj + recentAdj;
  }

  getTeamQualityAdjustment(homeTeam, awayTeam) {
    /**
     * Compare OPS, ERA, rankings
     * Scale: -0.10 to +0.10
     */
    const opsAdj = (homeTeam.OPS - awayTeam.OPS) * 0.04;
    const eraAdj = (awayTeam.ERA - homeTeam.ERA) * 0.03;
    const powerAdj = (homeTeam.HRPct - awayTeam.HRPct) * 0.02;

    return opsAdj + eraAdj + powerAdj;
  }

  getInjuryAdjustment(homeInjuries, awayInjuries) {
    /**
     * Impact based on player tier
     * Elite player out = -0.05 to -0.10
     */
    const homeImpact = homeInjuries.reduce((sum, inj) => sum + inj.impact, 0);
    const awayImpact = awayInjuries.reduce((sum, inj) => sum + inj.impact, 0);

    return awayImpact - homeImpact;
  }

  getWeatherAdjustment(weather, ballpark) {
    /**
     * Temperature, wind, ballpark factor
     */
    const { temperature, wind, windDirection } = weather;

    let adj = 0;

    // Temperature effect
    if (temperature < 50) adj -= 0.02; // cold = lower scoring
    if (temperature > 85) adj += 0.02; // hot = higher scoring

    // Wind effect (depends on ballpark)
    if (wind > 12 && windDirection === 'OUT') adj += 0.03;
    if (wind > 12 && windDirection === 'IN') adj -= 0.03;

    // Ballpark effect
    adj += (ballpark.runFactor - 1.0) * 0.05;

    return adj;
  }

  getRecentFormAdjustment(homeTeam, awayTeam) {
    /**
     * Last 10 games performance
     */
    const homeWinPct = homeTeam.last10Wins / 10;
    const awayWinPct = awayTeam.last10Wins / 10;

    return (homeWinPct - awayWinPct) * 0.05;
  }

  /**
   * EXPECTED VALUE CALCULATION
   */
  calculateEV(modelProb, odds) {
    /**
     * EV = (model_prob * payout) - stake
     * Or as percent: (model_prob * decimal_odds) - 1
     */
    
    // Convert American odds to decimal
    const decimalOdds = odds < 0 
      ? 100 / Math.abs(odds) + 1
      : odds / 100 + 1;

    const ev = (modelProb * decimalOdds) - 1;
    const evPercent = ev * 100;

    return {
      ev: ev,
      evPercent: evPercent,
      recommendation: evPercent > 5 ? 'BET' : 'PASS',
      kellyFraction: modelProb * (decimalOdds - 1) - (1 - modelProb),
      betSize: {
        fullKelly: modelProb * (decimalOdds - 1) - (1 - modelProb),
        halfKelly: (modelProb * (decimalOdds - 1) - (1 - modelProb)) / 2,
        quarterKelly: (modelProb * (decimalOdds - 1) - (1 - modelProb)) / 4
      }
    };
  }

  /**
   * OVER/UNDER MODEL
   */
  predictTotal(homeTeam, awayTeam, game) {
    /**
     * Expected runs = team run rates +/- adjustments
     */
    let homeRuns = homeTeam.runsPerGame;
    let awayRuns = awayTeam.runsPerGame;

    // Ballpark adjustment
    homeRuns *= game.ballpark.runFactor;
    awayRuns *= game.ballpark.runFactor;

    // Weather adjustment
    if (game.weather.temperature < 50) {
      homeRuns *= 0.98;
      awayRuns *= 0.98;
    }

    // Recent form adjustment
    homeRuns *= (homeTeam.last10Avg / homeTeam.seasonAvg);
    awayRuns *= (awayTeam.last10Avg / awayTeam.seasonAvg);

    const expectedTotal = homeRuns + awayRuns;

    return {
      expectedTotal,
      homeTeamTotal: homeRuns,
      awayTeamTotal: awayRuns,
      adjustments: {
        ballpark: game.ballpark.runFactor,
        weather: game.weather.temperature < 50 ? 0.98 : 1.0,
        recentForm: true
      }
    };
  }

  /**
   * PLAYER PROP MODEL
   */
  predictPlayerProp(player, propType, game) {
    /**
     * propType: "home_runs", "hits", "strikeouts", etc.
     */
    
    if (propType === 'home_runs') {
      return this.predictHRs(player, game);
    } else if (propType === 'hits') {
      return this.predictHits(player, game);
    }
    // ... more prop types
  }

  predictHRs(player, game) {
    const seasonHRRate = player.homeRuns / player.atBats;
    const vsOpponentHRRate = player.vsOpponentStats?.hrRate || seasonHRRate;
    
    // Weather effect on HRs
    const tempAdjustment = game.weather.temperature > 75 ? 1.05 : 0.95;
    
    // Ballpark effect
    const parkEffect = game.ballpark.homeRunFactor;
    
    // Expected at bats
    const expectedABs = player.platesPerGame * 0.85; // 85% plate appearance rate
    
    const expectedHRRate = Math.min(
      vsOpponentHRRate * tempAdjustment * parkEffect,
      0.15 // cap at 15%
    );
    
    // Probability of 2+ HRs
    const prob2Plus = 1 - Math.pow(1 - expectedHRRate, expectedABs);
    
    return {
      expectedHRRate,
      expectedABs,
      prob0HRs: Math.pow(1 - expectedHRRate, expectedABs),
      prob1HR: expectedABs * expectedHRRate * Math.pow(1 - expectedHRRate, expectedABs - 1),
      prob2Plus: prob2Plus,
      prediction: prob2Plus > 0.35 ? 'OVER' : 'UNDER'
    };
  }

  // ... more prop models
}

// ============================================================================
// 4. SYNTHESIS ENGINE
// ============================================================================

class MLBOpportunitySynthesis {
  /**
   * Combine all 3 pillars into confidence scores and recommendations
   */

  synthesizeOpportunity(signals, marketIntel, prediction, game) {
    // Score each pillar (0-33 points each)
    const signalScore = this.scoreSignals(signals);
    const marketScore = this.scoreMarketIntel(marketIntel);
    const predictionScore = this.scorePrediction(prediction);

    const totalScore = (signalScore + marketScore + predictionScore) / 99 * 100;

    return {
      game: game.id,
      opportunity: game.recommendation,
      totalConfidence: totalScore,
      rating: this.getRating(totalScore),
      scores: {
        signals: signalScore,
        market: marketScore,
        prediction: predictionScore
      },
      recommendation: this.getRecommendation(totalScore),
      betSize: this.calculateBetSize(totalScore),
      timestamp: Date.now()
    };
  }

  scoreSignals(signals) {
    if (!signals || signals.length === 0) return 0;

    let score = 0;

    signals.forEach(signal => {
      if (signal.type === 'STEAM') score += 5;
      if (signal.type === 'SHARP_MONEY') score += 8;
      if (signal.type === 'RLM') score += 10; // strongest
      if (signal.type === 'LIQUIDITY') score += 5;
    });

    return Math.min(score, 33);
  }

  scoreMarketIntel(intel) {
    let score = 0;

    if (intel.correlation?.anomaly === false) score += 6;
    if (intel.sharpbooksAligned) score += 8;
    if (intel.movementVelocity === 'sharp') score += 8;
    if (intel.efficiency > 0.5) score += 5;

    return Math.min(score, 33);
  }

  scorePrediction(prediction) {
    let score = 0;

    // EV size
    const evPercent = Math.abs(prediction.evPercent);
    if (evPercent > 15) score += 10;
    else if (evPercent > 10) score += 8;
    else if (evPercent > 5) score += 5;

    // Model confidence
    const modelConfidence = Math.abs(prediction.homeWinProb - 0.5);
    if (modelConfidence > 0.25) score += 8;
    else if (modelConfidence > 0.15) score += 5;

    score += 5; // base

    return Math.min(score, 33);
  }

  getRating(score) {
    if (score >= 85) return 'A+ (MAXIMUM)';
    if (score >= 70) return 'A (HIGH)';
    if (score >= 55) return 'B (MODERATE)';
    if (score >= 40) return 'C (LOW)';
    return 'D (SKIP)';
  }

  getRecommendation(score) {
    if (score >= 85) return 'MAXIMUM CONFIDENCE - Full Kelly';
    if (score >= 70) return 'HIGH CONFIDENCE - Half Kelly';
    if (score >= 55) return 'MODERATE - Quarter Kelly';
    if (score >= 40) return 'LOW - Small size only';
    return 'SKIP - Wait for better';
  }

  calculateBetSize(score, bankroll = 10000) {
    const kellyPercent = this.getKellyPercent(score);
    return (bankroll * kellyPercent) / 100;
  }

  getKellyPercent(score) {
    if (score >= 85) return 2.8; // Full Kelly (28%)
    if (score >= 70) return 1.4; // Half Kelly
    if (score >= 55) return 0.7; // Quarter Kelly
    if (score >= 40) return 0.35; // 1/8 Kelly
    return 0;
  }
}

// ============================================================================
// 5. ORCHESTRATION
// ============================================================================

class MLBEngine {
  constructor(options = {}) {
    this.signalDetector = new MLBSignalDetector(options);
    this.marketIntel = new MLBMarketIntelligence();
    this.predictiveModel = new MLBPredictiveModel(options);
    this.synthesis = new MLBOpportunitySynthesis();
  }

  async analyzeGame(gameData) {
    // Run all 3 pipelines in parallel
    const [signals, intel, prediction] = await Promise.all([
      this.signalDetector.detectAllSignals(gameData),
      this.marketIntel.analyzeMovement(gameData.gameId),
      this.predictiveModel.predictWinProbability(
        gameData.homeTeam,
        gameData.awayTeam,
        gameData
      )
    ]);

    // Calculate EV
    const ev = this.predictiveModel.calculateEV(
      prediction.homeWinProb,
      gameData.odds.moneyline
    );

    // Synthesize into opportunity
    const opportunity = this.synthesis.synthesizeOpportunity(
      signals,
      intel,
      { ...prediction, ...ev },
      gameData
    );

    return {
      gameId: gameData.gameId,
      signals,
      marketIntelligence: intel,
      prediction,
      ev,
      opportunity,
      timestamp: Date.now()
    };
  }

  async analyzeMLBDay(gamesForDay) {
    // Analyze all games
    const opportunities = await Promise.all(
      gamesForDay.map(game => this.analyzeGame(game))
    );

    // Rank by confidence
    return opportunities
      .sort((a, b) => b.opportunity.totalConfidence - a.opportunity.totalConfidence)
      .slice(0, 10); // Top 10
  }
}

module.exports = {
  MLBEngine,
  MLBSignalDetector,
  MLBMarketIntelligence,
  MLBPredictiveModel,
  MLBOpportunitySynthesis
};
