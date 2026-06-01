# Multi-League Taylor Model Architecture
## Creating Independent Models for MLB, NBA, NFL, NHL

---

## Executive Overview

Your architecture requires **4 independent engines**, each with:
- Own Taylor model (tailored to league characteristics)
- Own logic engine (sport-specific rules)
- Own signal detection (league-specific patterns)
- Own prediction algorithms
- Shared infrastructure (API layer, caching, data ingestion)

---

## Current State Analysis

### ✅ Already Built
- **MLB Engine** (`mlb-engine.js`, `mlb-engine-v2.js`, `mlb-live-data.js`)
  - Signal detection (Steam, Sharp Money, RLM, Liquidity)
  - Market intelligence
  - Predictive analytics
  - 815 lines of production code

### ❌ Still Needed
- NBA Engine (basketball-specific logic)
- NFL Engine (football-specific logic)
- NHL Engine (hockey-specific logic)
- Master router (selects correct engine per sport)
- Unified API layer
- Cross-league comparison tools

---

## Architecture: Multi-League System

```
┌─────────────────────────────────────────────────────────────┐
│                     M9 TERMINAL BACKEND                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  API LAYER (Unified Entry Point)                            │
│  ├─ POST /api/analyze-game (routes to correct engine)       │
│  ├─ GET /api/signals/:sport (sport-specific signals)        │
│  ├─ GET /api/predictions/:sport (league predictions)        │
│  └─ GET /api/comparison (cross-league analysis)             │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            TAYLOR MODELS (League Engines)              │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  MLB Engine                    NBA Engine             │ │
│  │  ├─ Baseball-specific rules     ├─ Basketball rules   │ │
│  │  ├─ Pitching metrics            ├─ Pace & spacing     │ │
│  │  ├─ Home/Away patterns          ├─ Back-to-back       │ │
│  │  ├─ Weather factors             ├─ Lineup rotation    │ │
│  │  ├─ Regression analysis         ├─ Player fatigue     │ │
│  │  └─ 162-game season model       └─ 82-game season     │ │
│  │                                                        │ │
│  │  NFL Engine                    NHL Engine             │ │
│  │  ├─ Football-specific rules     ├─ Hockey rules       │ │
│  │  ├─ Down-based progression      ├─ Possession time    │ │
│  │  ├─ Play-call patterns          ├─ Ice time allocation│ │
│  │  ├─ Red zone efficiency         ├─ Special teams      │ │
│  │  ├─ Defensive matchups          ├─ Trade deadline     │ │
│  │  └─ 17-game season model        └─ 82-game season     │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  SHARED INFRASTRUCTURE                                       │
│  ├─ Data Ingestion (SportsData.io, Odds API)               │
│  ├─ Caching Layer (5-min cache per league)                 │
│  ├─ Signal Detection Framework (4 universal signals)       │
│  ├─ Confidence Scoring (0-100%)                            │
│  ├─ User Profiles (SHARP, ACTIVE, RESEARCH)               │
│  └─ Persistence Layer (bet history, signals log)           │
│                                                               │
│  ANALYSIS TOOLS                                              │
│  ├─ Consensus Tracker (compare across leagues)             │
│  ├─ Correlation Matrix (league correlations)               │
│  ├─ Volume Analysis (cross-league volume patterns)          │
│  └─ Arbitrage Detector (cross-book opportunities)          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Architecture Foundation (Week 1)

### Step 1: Create Engine Base Class
**File:** `backend/services/engines/base-engine.js`

```javascript
/**
 * BaseEngine - Abstract class for all sport engines
 * Provides common interface for all Taylor models
 */
class BaseEngine {
  constructor(sport, config = {}) {
    this.sport = sport;
    this.config = config;
    this.signals = [];
    this.predictions = [];
    this.confidence = 0;
  }

  /**
   * Override in child classes
   */
  async analyzeGame(gameData) {
    throw new Error('analyzeGame must be implemented in child class');
  }

  async detectSignals(gameData) {
    throw new Error('detectSignals must be implemented in child class');
  }

  async predictOutcome(gameData) {
    throw new Error('predictOutcome must be implemented in child class');
  }

  async calculateValue(odds) {
    throw new Error('calculateValue must be implemented in child class');
  }

  /**
   * Shared methods across all engines
   */
  normalizeConfidence(score) {
    return Math.min(Math.max(score, 0), 100);
  }

  formatResponse(data) {
    return {
      sport: this.sport,
      timestamp: new Date().toISOString(),
      ...data
    };
  }
}

module.exports = BaseEngine;
```

### Step 2: Refactor MLB Engine
**File:** `backend/services/engines/mlb-engine.js`

Convert existing `mlb-engine.js` to extend BaseEngine:

```javascript
const BaseEngine = require('./base-engine');

class MLBEngine extends BaseEngine {
  constructor(config = {}) {
    super('MLB', config);
    this.seasonLength = 162;
    this.gamesPerWeek = 7;
    this.weatherCritical = true; // Weather matters in baseball
  }

  async analyzeGame(gameData) {
    // Existing MLB logic here
    // But now it's part of unified architecture
  }
}

module.exports = MLBEngine;
```

### Step 3: Create Master Router
**File:** `backend/services/engines/engine-router.js`

```javascript
const MLBEngine = require('./mlb-engine');
const NBAEngine = require('./nba-engine'); // Coming
const NFLEngine = require('./nfl-engine'); // Coming
const NHLEngine = require('./nhl-engine'); // Coming

class EngineRouter {
  constructor() {
    this.engines = {
      'baseball_mlb': new MLBEngine(),
      'basketball_nba': new NBAEngine(),
      'americanfootball_nfl': new NFLEngine(),
      'ice_hockey_nhl': new NHLEngine()
    };
  }

  async analyzeGame(sport, gameData) {
    const engine = this.engines[sport];
    if (!engine) {
      throw new Error(`Engine not found for sport: ${sport}`);
    }
    return await engine.analyzeGame(gameData);
  }

  async getSignals(sport, gameData) {
    const engine = this.engines[sport];
    return await engine.detectSignals(gameData);
  }

  async getPrediction(sport, gameData) {
    const engine = this.engines[sport];
    return await engine.predictOutcome(gameData);
  }
}

module.exports = EngineRouter;
```

---

## Phase 2: NBA Engine (Week 2)

### NBA-Specific Characteristics
1. **Season:** 82 games (Oct-Apr)
2. **Game frequency:** 3-4 games per week
3. **Key metrics:** Pace, spacing, bench scoring, player rotation
4. **Variance factors:** Back-to-back games, rest days, road/home splits
5. **Unique patterns:** Defensive schemes, pick-and-roll efficiency, three-point shooting

### File Structure
```
backend/services/engines/
├─ nba-engine.js
├─ nba-models/
│  ├─ pace-model.js
│  ├─ spacing-model.js
│  ├─ rotation-model.js
│  ├─ defensive-model.js
│  └─ three-point-model.js
└─ nba-data/
   ├─ league-averages.json
   ├─ player-stats.json
   └─ team-patterns.json
```

### Core NBA Logic
```javascript
class NBAEngine extends BaseEngine {
  constructor(config = {}) {
    super('NBA', config);
    this.seasonLength = 82;
    this.gamesPerWeek = 3.5;
    this.backToBackCritical = true;
    this.playerRotationVariance = 'HIGH';
  }

  /**
   * NBA-specific: Analyze rest patterns
   */
  analyzeRestSituation(gameData) {
    const homeRest = gameData.home.daysSinceLastGame;
    const awayRest = gameData.away.daysSinceLastGame;
    
    // Back-to-back penalty: -5 to -8 points
    const homeBackToBackPenalty = homeRest === 1 ? -5 : 0;
    const awayBackToBackPenalty = awayRest === 1 ? -5 : 0;

    return {
      homeAdvantage: homeBackToBackPenalty === 0 && awayBackToBackPenalty < 0 ? 2 : 0,
      awayAdvantage: awayBackToBackPenalty === 0 && homeBackToBackPenalty < 0 ? 2 : 0,
      neutralFactor: homeRest === awayRest ? 0 : Math.abs(homeRest - awayRest) * 1.5
    };
  }

  /**
   * NBA-specific: Pace analysis
   */
  analyzePace(gameData) {
    const homeOffensivePace = gameData.home.stats.paceOffensive;
    const awayDefensivePace = gameData.away.stats.paceDefensive;
    
    const paceMatchup = homeOffensivePace - awayDefensivePace;
    
    return {
      expectedPossessions: paceMatchup > 0 ? 'FAST' : 'SLOW',
      offensiveOutput: paceMatchup > 0 ? 'ELEVATED' : 'SUPPRESSED',
      confidence: Math.abs(paceMatchup) * 0.5
    };
  }

  /**
   * NBA-specific: Bench scoring
   */
  analyzeBenchStrength(gameData) {
    const homeBenchPoints = gameData.home.stats.benchPointsPerGame;
    const awayBenchPoints = gameData.away.stats.benchPointsPerGame;
    
    return {
      homeDepth: homeBenchPoints > 30 ? 'STRONG' : 'WEAK',
      awayDepth: awayBenchPoints > 30 ? 'STRONG' : 'WEAK',
      depthAdvantage: homeBenchPoints - awayBenchPoints
    };
  }
}
```

---

## Phase 3: NFL Engine (Week 3)

### NFL-Specific Characteristics
1. **Season:** 17 games (Sep-Jan)
2. **Game frequency:** 1 game per week (highly rested)
3. **Key metrics:** Red zone efficiency, play-calling tendencies, defensive schemes
4. **Variance factors:** Weather (wind, rain, snow), turf, altitude
5. **Unique patterns:** Down-and-distance progression, defensive matchups, coaching adjustments

### Core NFL Logic
```javascript
class NFLEngine extends BaseEngine {
  constructor(config = {}) {
    super('NFL', config);
    this.seasonLength = 17;
    this.gamesPerWeek = 1;
    this.weatherCritical = true;
    this.playCallingPatterns = true;
  }

  /**
   * NFL-specific: Red zone analysis
   */
  analyzeRedZone(gameData) {
    const homeRedZoneEfficiency = gameData.home.stats.redZonePercentage;
    const awayRedZoneEfficiency = gameData.away.stats.redZonePercentage;
    
    return {
      homeStrength: homeRedZoneEfficiency > 60 ? 'STRONG' : 'WEAK',
      awayWeakness: awayRedZoneEfficiency < 50 ? 'EXPLOITABLE' : 'SOLID',
      pointsPredicted: (homeRedZoneEfficiency - awayRedZoneEfficiency) * 0.3
    };
  }

  /**
   * NFL-specific: Weather impact
   */
  analyzeWeather(gameData) {
    const { wind, precipitation, temperature } = gameData.weather;
    
    let impact = 0;
    
    // Wind affects pass game
    if (wind > 12) impact += 2; // Over/under more likely
    
    // Snow reduces scoring
    if (precipitation === 'snow') impact += 3;
    
    // Cold affects kicking
    if (temperature < 32) impact += 1;
    
    return {
      totalImpact: impact,
      affectedMarkets: impact > 3 ? ['TOTAL', 'PASSING_YARDS'] : ['TOTAL'],
      recommendation: impact > 5 ? 'UNDER favored' : 'NEUTRAL'
    };
  }

  /**
   * NFL-specific: Down-based progression
   */
  analyzeDownProgression(gameData) {
    const homeFirstDownPercentage = gameData.home.stats.firstDownPercentage;
    const awayDefensivePerformance = 100 - gameData.away.stats.firstDownPercentage;
    
    return {
      homeDriveLength: homeFirstDownPercentage > 45 ? 'EXTENDED' : 'STALLED',
      awayDefense: awayDefensivePerformance > 55 ? 'STRONG' : 'VULNERABLE',
      drivesPerGame: homeFirstDownPercentage * 0.15
    };
  }
}
```

---

## Phase 4: NHL Engine (Week 4)

### NHL-Specific Characteristics
1. **Season:** 82 games (Oct-Apr, playoffs May-Jun)
2. **Game frequency:** 3-4 games per week
3. **Key metrics:** Possession time, special teams (power play/penalty kill), goaltender strength
4. **Variance factors:** Trade deadline, injuries to star players, back-to-back games
5. **Unique patterns:** Corsi/Fenwick (possession metrics), save percentage, shot quality

### Core NHL Logic
```javascript
class NHLEngine extends BaseEngine {
  constructor(config = {}) {
    super('NHL', config);
    this.seasonLength = 82;
    this.gamesPerWeek = 3.5;
    this.goaltenderCritical = true;
    this.specialTeamsCritical = true;
  }

  /**
   * NHL-specific: Goaltender analysis
   */
  analyzeGoaltenders(gameData) {
    const homeGoalie = gameData.home.goaltender;
    const awayGoalie = gameData.away.goaltender;
    
    return {
      homeGoaltieStrength: homeGoalie.savePercentage > 0.920 ? 'ELITE' : 'AVERAGE',
      awayGoaltieWeakness: awayGoalie.savePercentage < 0.900 ? 'EXPLOITABLE' : 'SOLID',
      tipsAdvantage: homeGoalie.savePercentage - awayGoalie.savePercentage,
      expectedGoals: (homeGoalie.goalsAgainstAverage + awayGoalie.goalsAgainstAverage) / 2
    };
  }

  /**
   * NHL-specific: Special teams
   */
  analyzeSpecialTeams(gameData) {
    const homePowerPlayPercentage = gameData.home.stats.powerPlayPercentage;
    const awayPenaltyKillPercentage = gameData.away.stats.penaltyKillPercentage;
    
    return {
      homePowerPlayStrength: homePowerPlayPercentage > 20 ? 'ELITE' : 'AVERAGE',
      awayPenaltyKillWeakness: awayPenaltyKillPercentage < 80 ? 'VULNERABLE' : 'SOLID',
      expectedGoalsFromPowerPlay: homePowerPlayPercentage * 0.15,
      predictedCorrelation: 0.35 // Power play goals correlate 35% with final score
    };
  }

  /**
   * NHL-specific: Possession analysis (Corsi)
   */
  analyzePossession(gameData) {
    const homeCorsi = gameData.home.stats.corsiPercentage;
    const awayCorsi = gameData.away.stats.corsiPercentage;
    
    return {
      homeControl: homeCorsi > 52 ? 'DOMINANT' : homeCorsi < 48 ? 'WEAK' : 'BALANCED',
      awayControl: awayCorsi > 52 ? 'DOMINANT' : awayCorsi < 48 ? 'WEAK' : 'BALANCED',
      expectedOutcome: homeCorsi > 52 ? 'HOME_FAVORED' : 'COMPETITIVE',
      confidence: Math.abs(homeCorsi - 50) / 50 * 100
    };
  }
}
```

---

## Unified API Layer

### File: `backend/routes/unified-analysis.js`

```javascript
const express = require('express');
const router = express.Router();
const EngineRouter = require('../services/engines/engine-router');

const engineRouter = new EngineRouter();

/**
 * POST /api/analyze-game
 * Route to correct engine and return analysis
 */
router.post('/analyze-game', async (req, res) => {
  try {
    const { sport, gameData } = req.body;
    
    const analysis = await engineRouter.analyzeGame(sport, gameData);
    
    res.json({
      sport,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/signals/:sport/:gameId
 * Get sport-specific signals
 */
router.get('/signals/:sport/:gameId', async (req, res) => {
  try {
    const { sport, gameId } = req.params;
    
    // Fetch game data from database/API
    const gameData = await fetchGameData(gameId);
    
    const signals = await engineRouter.getSignals(sport, gameData);
    
    res.json({
      sport,
      gameId,
      signals,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/predictions/:sport/:gameId
 * Get sport-specific predictions
 */
router.get('/predictions/:sport/:gameId', async (req, res) => {
  try {
    const { sport, gameId } = req.params;
    
    const gameData = await fetchGameData(gameId);
    const prediction = await engineRouter.getPrediction(sport, gameData);
    
    res.json({
      sport,
      gameId,
      prediction,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/comparison
 * Cross-league analysis and correlation
 */
router.get('/comparison', async (req, res) => {
  try {
    const sports = ['baseball_mlb', 'basketball_nba', 'americanfootball_nfl', 'ice_hockey_nhl'];
    
    const comparisons = {
      highestConfidenceSignals: [],
      correlations: {},
      volumeComparison: {},
      timestamps: new Date().toISOString()
    };
    
    // Get signals from all leagues
    // Compare and correlate
    
    res.json(comparisons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

---

## Implementation Timeline

### Week 1: Foundation
- [ ] Create BaseEngine abstract class
- [ ] Refactor MLB engine to extend BaseEngine
- [ ] Create EngineRouter
- [ ] Test routing logic
- [ ] Status: _________

### Week 2: NBA Engine
- [ ] Analyze NBA data characteristics
- [ ] Build NBA engine (pace, rest, bench, three-point models)
- [ ] Integration test with RouterEngine
- [ ] Add NBA signals to frontend
- [ ] Status: _________

### Week 3: NFL Engine
- [ ] Analyze NFL data characteristics
- [ ] Build NFL engine (red zone, weather, down progression)
- [ ] Integration test
- [ ] Add NFL signals to frontend
- [ ] Status: _________

### Week 4: NHL Engine
- [ ] Analyze NHL data characteristics
- [ ] Build NHL engine (goaltending, special teams, possession)
- [ ] Integration test
- [ ] Add NHL signals to frontend
- [ ] Status: _________

### Week 5: Unified API & Cross-League Analysis
- [ ] Build unified analysis routes
- [ ] Implement cross-league comparison
- [ ] Create league correlation matrix
- [ ] Build comparison UI
- [ ] Status: _________

### Week 6: Frontend Integration
- [ ] Update Markets page to use sport-specific signals
- [ ] Create sport-selector with analytics
- [ ] Build cross-league dashboard
- [ ] Add comparison tools
- [ ] Status: _________

### Week 7: Testing & Optimization
- [ ] Performance testing
- [ ] Accuracy validation
- [ ] Signal verification
- [ ] API optimization
- [ ] Status: _________

### Week 8: Deployment
- [ ] Deploy to Railway
- [ ] Monitor live signals
- [ ] Adjust parameters
- [ ] Go live
- [ ] Status: _________

---

## Data Structure per Engine

### Game Data Format (Unified Across Sports)
```javascript
{
  // Metadata
  sport: 'basketball_nba',
  gameId: 'nba_2024_1234',
  startTime: '2024-01-15T19:30:00Z',
  
  // Home Team
  home: {
    teamId: 'lakers',
    name: 'Los Angeles Lakers',
    // Sport-specific stats (varies)
    stats: {
      // NBA
      paceOffensive: 101.2,
      offensiveRating: 115.3,
      defensiveRating: 108.2,
      // NFL
      redZonePercentage: 65,
      // NHL
      powerPlayPercentage: 22.5,
      // MLB
      runsPerGame: 4.2
    }
  },
  
  // Away Team (same structure)
  away: { /* ... */ },
  
  // Sport-specific data
  weather: { /* For MLB, NFL */ },
  injuryReport: [ /* ... */ ],
  
  // Odds
  odds: {
    moneyline: { home: -110, away: -110 },
    spread: { line: -3.5, home: -110, away: -110 },
    total: { line: 215.5, over: -110, under: -110 }
  }
}
```

---

## Model Performance Tracking

### File: `backend/services/model-performance.js`

```javascript
class ModelPerformanceTracker {
  constructor() {
    this.predictions = new Map(); // sport -> [predictions]
    this.results = new Map();
  }

  /**
   * Log a prediction
   */
  logPrediction(sport, gameId, prediction, confidence) {
    if (!this.predictions.has(sport)) {
      this.predictions.set(sport, []);
    }
    
    this.predictions.get(sport).push({
      gameId,
      prediction,
      confidence,
      timestamp: Date.now()
    });
  }

  /**
   * Log actual result
   */
  logResult(sport, gameId, actualOutcome) {
    if (!this.results.has(sport)) {
      this.results.set(sport, []);
    }
    
    this.results.get(sport).push({
      gameId,
      outcome: actualOutcome,
      timestamp: Date.now()
    });
  }

  /**
   * Calculate hit rate per sport
   */
  getPerformanceMetrics(sport) {
    const preds = this.predictions.get(sport) || [];
    const results = this.results.get(sport) || [];
    
    let correct = 0;
    let total = 0;
    let totalConfidence = 0;
    
    results.forEach(result => {
      const pred = preds.find(p => p.gameId === result.gameId);
      if (pred) {
        total++;
        totalConfidence += pred.confidence;
        if (pred.prediction === result.outcome) {
          correct++;
        }
      }
    });
    
    return {
      sport,
      hitRate: total > 0 ? (correct / total * 100).toFixed(2) + '%' : 'N/A',
      sampleSize: total,
      averageConfidence: total > 0 ? (totalConfidence / total).toFixed(0) : 0
    };
  }
}
```

---

## Key Design Principles

### 1. **Modularity**
Each engine is independent with its own:
- Data models
- Signal detection logic
- Confidence scoring
- Prediction algorithms

### 2. **Consistency**
All engines share:
- Common interface (BaseEngine)
- Standard response format
- Unified routing (EngineRouter)
- Consistent confidence scoring (0-100)

### 3. **Extensibility**
New engines can be added by:
1. Creating `new-sport-engine.js` extending BaseEngine
2. Registering in EngineRouter
3. No changes needed to API layer

### 4. **Performance**
- Cache per league (5-minute TTL)
- Lazy load engines (only when needed)
- Parallel analysis across sports
- Stream signals as they're generated

---

## Testing Strategy

### Unit Tests (Per Engine)
```javascript
// test/nba-engine.test.js
describe('NBAEngine', () => {
  it('should detect back-to-back penalty', () => {
    const gameData = {
      home: { daysSinceLastGame: 1 },
      away: { daysSinceLastGame: 2 }
    };
    const result = nbaEngine.analyzeRestSituation(gameData);
    expect(result.homeBackToBackPenalty).toBe(-5);
  });
});
```

### Integration Tests (Router)
```javascript
// test/engine-router.test.js
describe('EngineRouter', () => {
  it('should route MLB analysis to MLBEngine', async () => {
    const result = await router.analyzeGame('baseball_mlb', mlbGameData);
    expect(result.sport).toBe('baseball_mlb');
  });
});
```

### Accuracy Tests (Post-Launch)
```javascript
// Every week: Compare predictions to actual outcomes
// Update model parameters based on performance
// Track hit rate per league
```

---

## Deployment Checklist

- [ ] BaseEngine abstract class created and tested
- [ ] MLB engine refactored to use BaseEngine
- [ ] EngineRouter created and tested
- [ ] NBA engine built and integrated
- [ ] NFL engine built and integrated
- [ ] NHL engine built and integrated
- [ ] Unified API routes created
- [ ] Cross-league comparison implemented
- [ ] Frontend updated with sport selectors
- [ ] Model performance tracking live
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Deployed to production

---

## Expected Outcomes

### Short-term (Month 1)
- ✅ 4 independent engines live
- ✅ Sport-specific signals working
- ✅ API fully operational
- ✅ Initial accuracy baseline established

### Medium-term (Month 2-3)
- ✅ Hit rates stabilizing (target: 55-60% baseline)
- ✅ Cross-league correlations identified
- ✅ User adoption of sport-specific signals
- ✅ First revenue from multiple sports

### Long-term (Month 4+)
- ✅ Hit rates improving (60%+ possible with fine-tuning)
- ✅ High-confidence signals emerge
- ✅ Portfolio of recommendations across all sports
- ✅ Scaled user base generating revenue

---

## Next Steps

1. **Review and Approve** this architecture
2. **Assign Developer** to Week 1 foundation work
3. **Parallel Development** of NBA/NFL/NHL engines in Weeks 2-4
4. **Integration Testing** in Week 5
5. **Frontend Updates** in Week 6
6. **Launch** with all 4 engines operational

---

**Ready to build the world-class Taylor models for all major sports leagues!** 🚀

Would you like me to:
1. Start implementing Week 1 (BaseEngine + Router)?
2. Build the NBA engine first?
3. Refine the architecture based on feedback?
4. Create detailed specifications for each engine?
