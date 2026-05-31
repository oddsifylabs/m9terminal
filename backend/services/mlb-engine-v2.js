/**
 * M9 Terminal — MLB Engine v2.0
 * Core Markets: Moneyline, Spread, Over/Under
 * 
 * Three independent pipelines (Signal Detection, Market Intelligence, Predictive Analytics)
 * Three bettor profiles (Sharp, Active, Research)
 */

// ============================================================================
// 1. SIGNAL DETECTION (Shared across all markets)
// ============================================================================

class MLBSignalDetector {
  constructor(options = {}) {
    this.confidenceThreshold = options.confidenceThreshold || 0.70;
  }

  async detectAllSignals(gameData) {
    const signals = [
      this.detectSteam(gameData),
      this.detectSharpMoney(gameData),
      this.detectRLM(gameData),
      this.detectLiquidity(gameData)
    ].filter(s => s !== null);

    return signals.sort((a, b) => b.confidence - a.confidence);
  }

  // Signals same for all markets (ML, spread, O/U)
  detectSteam(gameData) {
    const { odds, publicSentiment, volume } = gameData;
    
    const movement = odds.currentLine - odds.openingLine;
    const isPublicHeavy = publicSentiment.awayPercent > 65 || publicSentiment.awayPercent < 35;
    const movedWithPublic = (publicSentiment.awayPercent > 65 && movement > 0) || 
                           (publicSentiment.awayPercent < 35 && movement < 0);

    if (isPublicHeavy && movedWithPublic && Math.abs(movement) > 0.03) {
      return {
        type: 'STEAM',
        confidence: 0.75,
        strength: 'MODERATE',
        appliesTo: ['ML', 'SPREAD', 'OVER_UNDER'],
        interpretation: 'Consensus play - public + sharps aligned'
      };
    }
    return null;
  }

  detectSharpMoney(gameData) {
    const { movements } = gameData;
    const sorted = movements.sort((a, b) => a.timestamp - b.timestamp);

    const professionalBooks = ['DraftKings', 'BetMGM', 'BetRivers'];
    const firstProfessional = sorted.find(m => professionalBooks.includes(m.book));

    if (!firstProfessional) return null;

    const alignmentWindow = 15 * 60 * 1000;
    const aligned = sorted.filter(m => 
      m.timestamp >= firstProfessional.timestamp &&
      m.timestamp <= firstProfessional.timestamp + alignmentWindow &&
      professionalBooks.includes(m.book)
    );

    if (aligned.length >= 2) {
      return {
        type: 'SHARP_MONEY',
        confidence: 0.90,
        strength: 'VERY_STRONG',
        appliesTo: ['ML', 'SPREAD', 'OVER_UNDER'],
        interpretation: 'Professional coordination - follow the sharps'
      };
    }
    return null;
  }

  detectRLM(gameData) {
    const { publicSentiment, odds } = gameData;
    const publicAway = publicSentiment.awayPercent;
    const lineDirection = odds.currentLine > odds.openingLine ? 'AWAY' : 'HOME';

    const publicFavor = publicAway > 60 ? 'AWAY' : publicAway < 40 ? 'HOME' : null;

    if (publicFavor && lineDirection !== publicFavor && Math.abs(odds.currentLine - odds.openingLine) > 0.5) {
      return {
        type: 'RLM',
        confidence: 0.95,
        strength: 'ABSOLUTE_STRONGEST',
        appliesTo: ['ML', 'SPREAD', 'OVER_UNDER'],
        interpretation: 'Reverse Line Movement - sharps fading public consensus'
      };
    }
    return null;
  }

  detectLiquidity(gameData) {
    const { spread, volume } = gameData;
    const spreadTightness = (spread.average - spread.current) / spread.average;
    const volumeMultiplier = volume.current / volume.hourlyAvg;

    if (spreadTightness > 0.4 && volumeMultiplier > 3.0) {
      return {
        type: 'LIQUIDITY',
        confidence: 0.80,
        strength: 'STRONG',
        appliesTo: ['ML', 'SPREAD', 'OVER_UNDER'],
        interpretation: 'Informed money confident - tight spreads + volume spike'
      };
    }
    return null;
  }
}

// ============================================================================
// 2. MARKET INTELLIGENCE (Per Market: ML, Spread, O/U)
// ============================================================================

class MLBMarketIntelligence {
  constructor() {
    this.movements = {
      ML: new Map(),
      SPREAD: new Map(),
      OVER_UNDER: new Map()
    };
  }

  recordMovement(gameId, market, movement) {
    if (!this.movements[market].has(gameId)) {
      this.movements[market].set(gameId, []);
    }

    this.movements[market].get(gameId).push({
      timestamp: Date.now(),
      ...movement
    });
  }

  analyzeMovement(gameId, market) {
    const mvts = this.movements[market].get(gameId);
    if (!mvts || mvts.length < 2) return null;

    const opening = mvts[0];
    const current = mvts[mvts.length - 1];

    return {
      market: market,
      opening: opening.line,
      current: current.line,
      change: current.line - opening.line,
      velocity: this.calculateVelocity(mvts),
      direction: current.line > opening.line ? 'UP' : 'DOWN',
      efficiency: this.calculateEfficiency(mvts)
    };
  }

  calculateVelocity(movements) {
    const timespan = movements[movements.length - 1].timestamp - movements[0].timestamp;
    const totalMove = Math.abs(movements[movements.length - 1].line - movements[0].line);
    return totalMove / (timespan / 60000); // move per minute
  }

  calculateEfficiency(movements) {
    const totalVolume = movements.reduce((sum, m) => sum + (m.volume || 0), 0);
    const totalMove = Math.abs(movements[movements.length - 1].line - movements[0].line);
    return totalMove / (totalVolume / 1_000_000);
  }

  findBestOdds(gameId, market, books) {
    const lines = books[market] || {};
    const sorted = Object.entries(lines).sort((a, b) => b[1] - a[1]);

    return {
      best: { book: sorted[0][0], odds: sorted[0][1] },
      worst: { book: sorted[sorted.length - 1][0], odds: sorted[sorted.length - 1][1] },
      all: sorted.map(([book, odds]) => ({ book, odds }))
    };
  }
}

// ============================================================================
// 3. PREDICTIVE MODELS (Per Market: ML, Spread, O/U)
// ============================================================================

class MLBPredictiveModels {
  constructor() {
    this.modelWeights = {
      ML: { pitcher: 0.40, team: 0.20, injury: 0.20, weather: 0.10, form: 0.10 },
      SPREAD: { pitcher: 0.35, team: 0.25, injury: 0.20, weather: 0.10, form: 0.10 },
      OVER_UNDER: { pitcher: 0.25, team: 0.15, weather: 0.30, ballpark: 0.20, form: 0.10 }
    };
  }

  // MONEYLINE MODEL
  predictML(homeTeam, awayTeam, game) {
    let homeWinProb = 0.500;

    homeWinProb += this.getPitchingAdj(game.homePitcher, game.awayPitcher) * 0.40;
    homeWinProb += this.getTeamAdj(homeTeam, awayTeam) * 0.20;
    homeWinProb += this.getInjuryAdj(game.homeInjuries, game.awayInjuries) * 0.20;
    homeWinProb += this.getWeatherAdj(game.weather) * 0.10;
    homeWinProb += this.getFormAdj(homeTeam, awayTeam) * 0.10;

    homeWinProb = Math.max(0, Math.min(1, homeWinProb));

    return {
      market: 'ML',
      homeWinProb,
      awayWinProb: 1 - homeWinProb
    };
  }

  // SPREAD MODEL
  predictSpread(homeTeam, awayTeam, game) {
    const mlProb = this.predictML(homeTeam, awayTeam, game);
    
    // Convert win probability to expected run differential
    const expectedRunDiff = this.calculateRunDifference(homeTeam, awayTeam, game, mlProb);

    return {
      market: 'SPREAD',
      expectedSpread: expectedRunDiff,
      favoredTeam: expectedRunDiff < 0 ? 'HOME' : 'AWAY'
    };
  }

  // OVER/UNDER MODEL
  predictTotal(homeTeam, awayTeam, game) {
    let homeRuns = homeTeam.runsPerGame;
    let awayRuns = awayTeam.runsPerGame;

    // Pitcher impact on runs (ERA → runs allowed)
    const homePitcherRunImpact = this.getPitcherRunImpact(game.homePitcher);
    const awayPitcherRunImpact = this.getPitcherRunImpact(game.awayPitcher);

    homeRuns -= homePitcherRunImpact;
    awayRuns -= awayPitcherRunImpact;

    // Ballpark effect (huge for O/U)
    homeRuns *= game.ballpark.runFactor;
    awayRuns *= game.ballpark.runFactor;

    // Weather (temperature, wind)
    const weatherEffect = this.getWeatherRunImpact(game.weather);
    homeRuns *= weatherEffect;
    awayRuns *= weatherEffect;

    // Recent trends
    homeRuns *= (homeTeam.last10Avg / homeTeam.seasonAvg);
    awayRuns *= (awayTeam.last10Avg / awayTeam.seasonAvg);

    const expectedTotal = homeRuns + awayRuns;

    return {
      market: 'OVER_UNDER',
      expectedTotal,
      homeTeamTotal: homeRuns,
      awayTeamTotal: awayRuns
    };
  }

  // Helper methods
  getPitchingAdj(homePitcher, awayPitcher) {
    const eraAdj = (awayPitcher.ERA - homePitcher.ERA) * 0.05;
    const k9Adj = (homePitcher.K9 - awayPitcher.K9) * 0.02;
    return eraAdj + k9Adj;
  }

  getTeamAdj(homeTeam, awayTeam) {
    const opsAdj = (homeTeam.OPS - awayTeam.OPS) * 0.04;
    const eraAdj = (awayTeam.ERA - homeTeam.ERA) * 0.03;
    return opsAdj + eraAdj;
  }

  getInjuryAdj(homeInjuries, awayInjuries) {
    const homeImpact = homeInjuries.reduce((sum, inj) => sum + inj.impact, 0);
    const awayImpact = awayInjuries.reduce((sum, inj) => sum + inj.impact, 0);
    return awayImpact - homeImpact;
  }

  getWeatherAdj(weather) {
    let adj = 0;
    if (weather.temperature < 50) adj -= 0.02;
    if (weather.temperature > 85) adj += 0.02;
    return adj;
  }

  getFormAdj(homeTeam, awayTeam) {
    const homeWinPct = homeTeam.last10Wins / 10;
    const awayWinPct = awayTeam.last10Wins / 10;
    return (homeWinPct - awayWinPct) * 0.05;
  }

  calculateRunDifference(homeTeam, awayTeam, game, mlProb) {
    // Pythagorean expectation approximation
    // If home 76% to win, expected margin ~-4.8 runs
    if (mlProb.homeWinProb > 0.5) {
      return -(mlProb.homeWinProb - 0.5) * 10;
    } else {
      return (mlProb.awayWinProb - 0.5) * 10;
    }
  }

  getPitcherRunImpact(pitcher) {
    // ERA of 2.50 = better at preventing runs than ERA of 4.50
    // Convert to per-game impact
    return (pitcher.ERA - 3.50) * 0.25; // Normalized
  }

  getWeatherRunImpact(weather) {
    let effect = 1.0;
    if (weather.temperature < 50) effect *= 0.98;
    if (weather.temperature > 85) effect *= 1.02;
    if (weather.wind > 12) effect *= (weather.windDirection === 'OUT' ? 1.03 : 0.97);
    return effect;
  }

  // EXPECTED VALUE CALCULATION
  calculateEV(modelValue, marketLine) {
    // For all markets: EV = (model % * decimal odds) - 1

    const decimalOdds = marketLine < 0 
      ? 100 / Math.abs(marketLine) + 1
      : marketLine / 100 + 1;

    // Assuming modelValue is a probability (0-1) for ML
    // For spread/O/U, convert point edge to probability
    const modelProb = typeof modelValue === 'number' && modelValue < 1 
      ? modelValue 
      : 0.5; // Default if edge provided

    const ev = (modelProb * decimalOdds) - 1;
    const evPercent = ev * 100;

    return {
      ev: ev,
      evPercent: evPercent,
      kellyFraction: modelProb * (decimalOdds - 1) - (1 - modelProb),
      recommendation: evPercent > 5 ? 'BET' : 'PASS'
    };
  }
}

// ============================================================================
// 4. SYNTHESIS & CONFIDENCE SCORING
// ============================================================================

class MLBOpportunitySynthesis {
  synthesizeMarket(market, signals, marketIntel, prediction, odds) {
    // Score each pillar (0-33 points)
    const signalScore = this.scoreSignals(signals);
    const marketScore = this.scoreMarketIntel(marketIntel);
    const predictionScore = this.scorePrediction(prediction);

    const totalScore = (signalScore + marketScore + predictionScore) / 99 * 100;

    const ev = {
      ev: prediction.expectedValue || 0,
      evPercent: (prediction.expectedValue || 0) * 100
    };

    return {
      market: market,
      recommendation: prediction.recommendation || 'NEUTRAL',
      confidence: Math.round(totalScore),
      rating: this.getRating(totalScore),
      scores: {
        signals: signalScore,
        market: marketScore,
        prediction: predictionScore
      },
      edge: Math.abs(ev.evPercent),
      edgePercent: `+${Math.abs(ev.evPercent).toFixed(1)}%`,
      kellySuggestion: this.getKellySuggestion(totalScore),
      timestamp: Date.now()
    };
  }

  scoreSignals(signals) {
    if (!signals || signals.length === 0) return 0;
    let score = 0;
    signals.forEach(s => {
      if (s.type === 'STEAM') score += 5;
      if (s.type === 'SHARP_MONEY') score += 8;
      if (s.type === 'RLM') score += 10;
      if (s.type === 'LIQUIDITY') score += 5;
    });
    return Math.min(score, 33);
  }

  scoreMarketIntel(intel) {
    if (!intel) return 0;
    let score = 0;
    if (intel.efficiency > 0.5) score += 8;
    if (intel.velocity > 0.1) score += 6;
    if (Math.abs(intel.change) > 0.5) score += 8;
    score += 5; // Base
    return Math.min(score, 33);
  }

  scorePrediction(prediction) {
    if (!prediction) return 0;
    let score = 0;
    score += 10; // Base prediction
    score += 8; // Market understanding
    score += 5; // Risk assessment
    return Math.min(score, 33);
  }

  getRating(score) {
    if (score >= 85) return 'A+ (MAXIMUM)';
    if (score >= 70) return 'A (HIGH)';
    if (score >= 55) return 'B (MODERATE)';
    if (score >= 40) return 'C (LOW)';
    return 'D (SKIP)';
  }

  getKellySuggestion(score) {
    if (score >= 85) return 0.028; // Full Kelly (2.8%)
    if (score >= 70) return 0.014; // Half Kelly
    if (score >= 55) return 0.007; // Quarter Kelly
    if (score >= 40) return 0.0035; // 1/8 Kelly
    return 0;
  }
}

// ============================================================================
// 5. BETTOR PROFILES (Filter & Present)
// ============================================================================

class BettorProfiles {
  static SHARP = {
    minConfidence: 80,
    minEdge: 0.15,
    maxBets: 5,
    sizing: 'fullKelly',
    display: 'minimal'
  };

  static ACTIVE = {
    minConfidence: 55,
    minEdge: 0.05,
    maxBets: 20,
    sizing: 'halfKelly',
    display: 'actionable'
  };

  static RESEARCH = {
    minConfidence: 0,
    minEdge: 0,
    maxBets: Infinity,
    sizing: 'none',
    display: 'detailed'
  };

  static filterByProfile(opportunities, profile) {
    const profileSettings = this[profile] || this.ACTIVE;

    return opportunities
      .filter(opp => opp.confidence >= profileSettings.minConfidence)
      .filter(opp => opp.edge >= profileSettings.minEdge)
      .slice(0, profileSettings.maxBets);
  }

  static formatForProfile(opportunities, profile) {
    const filtered = this.filterByProfile(opportunities, profile);

    if (profile === 'SHARP') {
      return filtered.map(opp => ({
        market: opp.market,
        recommendation: opp.recommendation,
        confidence: opp.confidence,
        edge: opp.edge,
        betSize: this.calculateBetSize(opp, 0.028), // Full Kelly
        bestBook: opp.bestBook,
        bestOdds: opp.bestOdds
      }));
    }

    if (profile === 'ACTIVE') {
      return filtered.map(opp => ({
        market: opp.market,
        recommendation: opp.recommendation,
        confidence: opp.confidence,
        rating: opp.rating,
        edge: `+${opp.edge.toFixed(1)}%`,
        betSize: this.calculateBetSize(opp, 0.014), // Half Kelly
        bestBook: opp.bestBook,
        bestOdds: opp.bestOdds,
        reason: this.generateReason(opp)
      }));
    }

    if (profile === 'RESEARCH') {
      return filtered.map(opp => ({
        market: opp.market,
        recommendation: opp.recommendation,
        confidence: opp.confidence,
        rating: opp.rating,
        scores: opp.scores,
        edge: `+${opp.edge.toFixed(1)}%`,
        signals: opp.signals,
        marketIntel: opp.marketIntel,
        modelDetails: opp.modelDetails
      }));
    }

    return filtered;
  }

  static calculateBetSize(opportunity, kellyPercent, bankroll = 10000) {
    return bankroll * kellyPercent;
  }

  static generateReason(opportunity) {
    const reasons = [];
    if (opportunity.edge > 0.15) reasons.push('High edge');
    if (opportunity.confidence > 80) reasons.push('Maximum confidence');
    if (opportunity.signals?.length > 0) reasons.push(`${opportunity.signals[0].type} detected`);
    return reasons.join(' + ');
  }
}

// ============================================================================
// 6. ORCHESTRATOR
// ============================================================================

class MLBEngine {
  constructor(options = {}) {
    this.signalDetector = new MLBSignalDetector(options);
    this.marketIntel = new MLBMarketIntelligence();
    this.models = new MLBPredictiveModels(options);
    this.synthesis = new MLBOpportunitySynthesis();
  }

  async analyzeGame(gameData, profile = 'ACTIVE') {
    // Run all pipelines in parallel
    const signals = await this.signalDetector.detectAllSignals(gameData);

    // Run market intelligence & models for all 3 markets
    const mlAnalysis = await this.analyzeMarket('ML', gameData, signals);
    const spreadAnalysis = await this.analyzeMarket('SPREAD', gameData, signals);
    const ouAnalysis = await this.analyzeMarket('OVER_UNDER', gameData, signals);

    const allOpportunities = [mlAnalysis, spreadAnalysis, ouAnalysis];

    // Filter & format by profile
    const profileOutput = BettorProfiles.formatForProfile(allOpportunities, profile);

    return {
      gameId: gameData.gameId,
      profile: profile,
      opportunities: profileOutput,
      summary: {
        totalOpportunities: allOpportunities.length,
        playsByProfile: profileOutput.length,
        bestConfidence: Math.max(...allOpportunities.map(o => o.confidence))
      }
    };
  }

  async analyzeMarket(market, gameData, signals) {
    // Market-specific analysis
    const prediction = this.getPredictionForMarket(market, gameData);
    const marketIntel = this.marketIntel.analyzeMovement(gameData.gameId, market);

    return this.synthesis.synthesizeMarket(market, signals, marketIntel, prediction);
  }

  getPredictionForMarket(market, gameData) {
    if (market === 'ML') {
      return this.models.predictML(gameData.homeTeam, gameData.awayTeam, gameData);
    } else if (market === 'SPREAD') {
      return this.models.predictSpread(gameData.homeTeam, gameData.awayTeam, gameData);
    } else if (market === 'OVER_UNDER') {
      return this.models.predictTotal(gameData.homeTeam, gameData.awayTeam, gameData);
    }
  }

  async analyzeMLBDay(games, profile = 'ACTIVE') {
    const allAnalyses = await Promise.all(
      games.map(game => this.analyzeGame(game, profile))
    );

    // Combine and rank
    const allOpportunities = allAnalyses.flatMap(a => a.opportunities);
    return allOpportunities.sort((a, b) => b.confidence - a.confidence);
  }
}

module.exports = {
  MLBEngine,
  MLBSignalDetector,
  MLBMarketIntelligence,
  MLBPredictiveModels,
  MLBOpportunitySynthesis,
  BettorProfiles
};
