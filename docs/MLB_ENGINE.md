---
title: M9 Terminal — MLB Engine Architecture
subtitle: World-Class Sports Market Intelligence for Major League Baseball
version: 1.0.0
date: "2026-06-01"
---

# M9 Terminal — MLB Engine

## Executive Overview

The **MLB Engine** is a hybrid market intelligence system that combines three powerful approaches:

1. **Signal Detection** — Real-time anomalies (steam, sharp money, RLM)
2. **Market Intelligence** — Line movement, correlations, liquidity tracking
3. **Predictive Analytics** — Game outcome models + expected value calculations

**Goal:** Identify profitable opportunities across games, spreads, totals, and props.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     M9 TERMINAL — MLB ENGINE                    │
└─────────────────────────────────────────────────────────────────┘

INPUT LAYER
├── Live Odds (Odds API, multiple sportsbooks)
├── Game Data (SportsData.io — lineups, weather, injuries)
├── Historical Data (past seasons, CLV, model performance)
├── Market Microstructure (volume, spread, movement velocity)
└── Sentiment & Context (narrative tracking, expert consensus)

PROCESSING LAYER (3 Pipelines Running in Parallel)
│
├─ PIPELINE 1: SIGNAL DETECTION
│  ├── Steam Detection (odds moving against public money)
│  ├── Sharp Money Detection (coordinated movements)
│  ├── Reverse Line Movement (public betting one way, line moving other)
│  ├── Opening-to-Close Movement (% of line movement)
│  └── Liquidity Signals (volume spikes, bid-ask spreads)
│
├─ PIPELINE 2: MARKET INTELLIGENCE
│  ├── Line Movement Tracking (historical snapshot every 5-10 min)
│  ├── Correlation Analysis (team movements, prop correlations)
│  ├── Market Efficiency Testing (deviation from consensus)
│  ├── Sportsbook Comparison (value across different books)
│  └── Movement Velocity (how fast line is moving — sharp indicator)
│
└─ PIPELINE 3: PREDICTIVE ANALYTICS
   ├── Win Probability Models (ML, spread, implied prob vs actual)
   ├── Over/Under Models (run scoring, pace, weather adjustments)
   ├── Player Prop Models (batting avg, hits, strikeouts vs line)
   ├── Positional Analysis (key injuries, matchups)
   └── Expected Value Calculation (model % vs odds)

SYNTHESIS LAYER
├── Cross-Validation (do all 3 pipelines agree?)
├── Confidence Scoring (0-100 based on multiple signals)
├── Opportunity Ranking (by edge size, confidence, liquidity)
└── Execution Strategy (bet size, best book, timing)

OUTPUT LAYER
├── Signal Alert (high-confidence opportunities)
├── Market Report (line movement, key correlations)
├── Model Recommendation (prediction + EV)
└── Trade Execution (where, how much, when)

FEEDBACK LOOP
├── CLV Tracking (actual vs predicted)
├── Model Recalibration (daily)
├── Signal Accuracy Tracking (sharp signal success rate)
└── Continuous Improvement
```

---

## 2. Signal Detection Pipeline

### 2.1 Steam Detection

**What is it:** Sudden, coordinated line movement from recreational money.

**How to detect:**
```javascript
// Steam Signal Algorithm
steamSignal = {
  // Monitor opening line vs current line
  openingLine: -110,
  currentLine: -125,
  movementPercent: (currentLine - openingLine) / openingLine * 100, // 13.6%
  
  // Check direction: does movement match public sentiment?
  publicSentiment: 72, // % betting public on favorite
  lineFavor: "favorite", // line moved toward favorite
  
  // Steam = public betting one way, line also moved that way
  isSteam: publicSentiment > 65 && lineFavor === "favorite",
  confidence: 0.85,
  
  // Additional confirmation: volume spike?
  volumeSpike: true, // unusual bet volume
  
  reason: "Public backing favorite, sharp books moving line — consensus play"
}
```

**Detection window:** Real-time, especially 30min before game

**Usefulness:** Identifies consensus plays (usually low edge, but confirms market direction)

---

### 2.2 Sharp Money Detection

**What is it:** Professional money moving lines before the public notices.

**How to detect:**
```javascript
// Sharp Money Signal Algorithm
sharpSignal = {
  // Scenario: Line opens at -110 on Yankee ML
  openingLine: -110,
  
  // Sharp book (more professional action) moves first
  book1Movement: "moved to -115 at 8:00am",
  book2Movement: "moved to -115 at 8:02am",
  book3Movement: "moved to -110 (holdout)",
  
  // Professional books aligned BEFORE public volume arrives
  sharpsAligned: true,
  movementVelocity: "fast but controlled",
  publicVolume: "delayed by 30min",
  
  // The tell: coordinated early movement
  indicators: {
    movementTiming: "before public",
    movementAlignment: "professional books unanimous",
    movementVelocity: "controlled (not panic)",
    volumeSequence: "sharps first, public second",
    confidenceLevel: 0.92
  },
  
  reason: "Professional syndicate positioning before public",
  recommendation: "FOLLOW THE SHARPS"
}
```

**Detection window:** First 15-30 minutes after opening lines

**Usefulness:** Highest-confidence edge signals (professional money has better information)

---

### 2.3 Reverse Line Movement (RLM)

**What is it:** Public betting one way, but line moving the opposite direction (most powerful signal).

**How to detect:**
```javascript
// Reverse Line Movement Algorithm
rlmSignal = {
  scenario: "Home team favored by public, but line moves to favor road team",
  
  // Public betting:
  publicBetting: {
    homeTeamPercent: 68,
    roadTeamPercent: 32
  },
  
  // But line moves OPPOSITE:
  lineMovement: {
    openingLine: "Home -5",
    currentLine: "Home -3.5",
    direction: "toward road team (against public)",
    sharpsMovingLine: true
  },
  
  // The interpretation:
  interpretation: "Sharps know something (injury, lineup, intel) — fading public",
  powerLevel: "EXTREMELY HIGH",
  confidenceScore: 0.95,
  
  // This is the holy grail:
  implication: "Sharps betting against public consensus",
  historicalWinRate: 0.58, // RLM systems historically hit 58%+
  
  reason: "When sharps fade public, usually right"
}
```

**Detection window:** Any time before game, especially final hour

**Usefulness:** Most reliable signal (sharpest professionals betting their money)

---

### 2.4 Liquidity & Volume Signals

**What is it:** Unusual volume or spread tightening indicates professional interest.

**How to detect:**
```javascript
// Liquidity Signal Algorithm
liquiditySignal = {
  // Track bid-ask spread tightness
  bidAskSpread: {
    normal: 0.15, // typical spread
    current: 0.07, // half normal
    tightness: "unusual"
  },
  
  // Track volume velocity
  volume: {
    hourlyAverage: 500_000,
    lastHour: 2_000_000, // 4x normal
    spikeMultiplier: 4.0,
    sharpIndicator: true
  },
  
  // Combination: tight spread + high volume = informed money
  interpretation: "Informed participants confident in their view",
  confidenceScore: 0.80,
  
  reason: "Professional/institutional money always moves volume/spread first"
}
```

**Detection window:** Continuous monitoring

**Usefulness:** Confirms other signals, shows confidence level

---

## 3. Market Intelligence Pipeline

### 3.1 Line Movement Tracking

**What to track:**
```javascript
// Line Movement History Object
const lineMovementHistory = {
  gameId: "MLB_2026_NYY_BOS_20260603",
  sport: "MLB",
  teams: { home: "Boston", away: "New York Yankees" },
  
  movements: [
    {
      timestamp: "2026-06-02T14:00:00Z",
      source: "opening lines",
      line: { ml: -110, spread: -5.0, over_under: 8.5 },
      volume: 100_000,
      notes: "market opens"
    },
    {
      timestamp: "2026-06-02T14:30:00Z",
      source: "professional sharp action",
      line: { ml: -115, spread: -5.5, over_under: 8.5 },
      volume: 500_000,
      movement: { ml: "5 cents tighter", spread: "-0.5" },
      notes: "sharp money on Yankees"
    },
    {
      timestamp: "2026-06-02T15:00:00Z",
      source: "public volume",
      line: { ml: -105, spread: -4.5, over_under: 8.5 },
      volume: 1_200_000,
      movement: { ml: "public fading", spread: "+0.5" },
      notes: "public on Red Sox, sharps pulling back"
    },
    {
      timestamp: "2026-06-02T19:30:00Z",
      source: "pre-game (90min before)",
      line: { ml: -110, spread: -5.0, over_under: 8.5 },
      volume: 2_500_000,
      movement: { ml: "settled", spread: "settled" },
      notes: "final line"
    }
  ],
  
  // Analysis
  analysis: {
    openToClose: {
      mlMovement: "0 cents (settle back)",
      spreadMovement: "0 (centered)",
      publicVsSharp: "public faded sharps"
    },
    keyInsight: "Sharps positioned early, public fought them, line settled neutral",
    interpretation: "Likely balanced sharp positioning"
  }
}
```

**Tracking frequency:** Every 5-10 minutes

**Key metrics:**
- Opening vs current vs closing lines
- Volume-weighted average price (VWAP)
- Movement velocity (fast = sharp, slow = public)
- Direction (with or against public)

---

### 3.2 Correlation Analysis

**What correlates:**
```javascript
// Correlation Analysis
correlations = {
  // Spread-Total Correlation
  spreadToTotal: {
    relationship: "Wider spreads usually = higher totals",
    current: {
      spread: 5.5,
      total: 8.5,
      correlation: 0.75,
      interpretation: "Normal relationship"
    },
    anomaly: {
      spread: 2.0, // low
      total: 9.5, // high
      correlation: -0.60,
      interpretation: "ANOMALY: Wide open game expected, but sharps fading?"
    }
  },
  
  // Team Movement Correlation
  teamMovements: {
    yankeesFavored: "by 5.5",
    yankeesTeamTotal: 4.5,
    redSoxTeamTotal: 4.0,
    analysis: "Expected if Yankees expected to score more"
  },
  
  // Prop Correlations
  playerProps: {
    aaronJudge: { homeRuns: 1.5, hitsPlusBB: 2.5 },
    correlation: "High correlation expected",
    anomaly: "If HR line up but hits line down = unusual"
  },
  
  // Cross-Sportsbook Correlation
  bookDifferences: {
    book1: "Yankees -5.5",
    book2: "Yankees -5.0",
    book3: "Yankees -4.5",
    analysis: "5.5 is sharp outlier (likely most informed)",
    recommendation: "Fade to -4.5 if betting Yankees"
  }
}
```

**Why it matters:** Correlations break = edge opportunity

---

### 3.3 Sportsbook Comparison

**The algorithm:**
```javascript
// Sportsbook Comparison Matrix
sportsbooks = {
  // Same game, 4 books, different lines
  game: "Yankees ML",
  
  current: {
    book1_DraftKings: { line: -110, odds: -110 },      // sharp book
    book2_BetMGM: { line: -105, odds: -105 },          // balanced
    book3_BetRivers: { line: -115, odds: -115 },       // sharp book
    book4_FanDuel: { line: -100, odds: -100 }          // most generous
  },
  
  analysis: {
    bestOdds: -100, // FanDuel
    worstOdds: -115, // BetRivers
    edgeVsFanDuel: {
      draftkings: "+10 vs best",
      betmgm: "-5 vs best",
      betrivers: "-15 vs best (avoid)"
    },
    
    recommendation: {
      if_bullishYankees: "Bet FanDuel at -100 (best price)",
      if_bearishYankees: "Bet BetRivers at -115 (most desperate)"
    }
  }
}
```

**Core principle:** Always take best available odds

---

## 4. Predictive Analytics Pipeline

### 4.1 Win Probability Models

**Three-part model:**

```javascript
// MLB Win Probability Model
winProbabilityModel = {
  // INPUT FACTORS
  factors: {
    // Team Quality
    teamStrength: {
      yankees: {
        teamOPS: 0.825,
        teamERA: 3.45,
        recentForm: "5-2 (L10)",
        rank: "1st AL East"
      },
      redSox: {
        teamOPS: 0.795,
        teamERA: 3.75,
        recentForm: "4-3 (L10)",
        rank: "3rd AL East"
      }
    },
    
    // Pitcher Quality (most important)
    pitchers: {
      yankees: {
        starter: "Gerrit Cole",
        season_ERA: 2.95,
        season_K9: 9.8,
        recentForm: "2-0, 2.15 ERA (L5 games)",
        homeFieldAdv: true
      },
      redSox: {
        starter: "Nathan Eovaldi",
        season_ERA: 3.45,
        season_K9: 8.9,
        recentForm: "1-1, 4.20 ERA (L5 games)",
        roadRecord: "3-5"
      }
    },
    
    // Lineup & Injuries
    lineups: {
      yankees: {
        absences: "none",
        key_players: ["Aaron Judge", "Juan Soto", "Anthony Volpe"],
        injuries: []
      },
      redSox: {
        absences: "Rafael Devers (hamstring)",
        key_players: ["Jarren Duran", "Tyler O'Neill"],
        injuries: ["Devers out 3-4 weeks"]
      }
    },
    
    // Stadium & Weather
    context: {
      stadium: "Fenway Park",
      temperature: 72,
      wind: "NNW 8 mph (minimal impact)",
      precipitation: "clear",
      ballpark_factor: {
        runs_allowed: 0.95,
        home_runs: 1.05,
        effect: "slightly hitter-friendly"
      }
    }
  },
  
  // CALCULATION
  calculation: {
    // Start with baseline
    baselineYankees: 0.500, // 50-50 at neutral site
    
    // Adjust for each factor
    adjustments: {
      teamQuality: +0.08,    // Yankees stronger (OPS diff)
      pitching: +0.12,       // Cole >> Eovaldi
      injuries: +0.05,       // Red Sox missing Devers
      homeField: -0.02,      // Red Sox advantage
      recentForm: +0.03,     // Yankees hot
      weather: 0.00          // neutral
    },
    
    // Sum adjustments
    totalAdjustment: +0.26,
    
    // Final probability
    yankeeWinProbability: 0.76, // 76% to win
    redSoxWinProbability: 0.24  // 24% to win
  },
  
  // COMPARE TO MARKET
  marketComparison: {
    yankees: {
      modelProbability: 0.76,
      impliedProbability: { // from -110 odds
        calculation: "100 / (110 + 100) = 47.6%",
        impliedProb: 0.476
      },
      
      // The edge!
      edge: {
        model: 0.76,
        market: 0.476,
        difference: +0.284, // 28.4% edge!
        interpretation: "Model says 76% to win, market says 48%",
        recommendation: "BET YANKEES (major undervalue)"
      }
    }
  },
  
  // EXPECTED VALUE
  ev: {
    bet: "Yankees ML at -110",
    stake: 100,
    odds: -110,
    
    calculation: {
      // (model_prob * payout) - (bet_amount)
      // (0.76 * 100) + (0.76 * 100) - 100
      expectedPayout: 76 * 2.0 - 100, // wins 76 times, loses 24
      expectedValue: 52,
      evPercent: 52 / 100, // +52% EV
      kellyFraction: 0.28 // bet 28% of bankroll
    },
    
    sizing: {
      bankroll: 10000,
      kellySuggestion: 2800,
      conservativeSize: 1000, // 1/10 Kelly
      recommendation: "Bet $1000 at -110"
    }
  }
}
```

**Model inputs (in priority order):**
1. **Pitching matchup** (40% weight) — most predictive
2. **Team strength** (20%)
3. **Injuries/lineup** (20%)
4. **Weather/ballpark** (10%)
5. **Recent form** (10%)

---

### 4.2 Over/Under Models

```javascript
// MLB Total Runs Model
overUnderModel = {
  factors: {
    // Run Scoring
    yankees: {
      runsPerGame: 4.85,
      offensiveRating: 4.2, // runs scored vs league avg
      baseRunning: "good"
    },
    redSox: {
      runsPerGame: 4.15,
      offensiveRating: 3.8,
      baseRunning: "average"
    },
    
    // Pitching Defense
    yankees: {
      runsAllowed: 3.45,
      defensiveRating: 3.6,
      bullpen: "strong"
    },
    redSox: {
      runsAllowed: 3.75,
      defensiveRating: 3.9,
      bullpen: "average"
    },
    
    // Park Factor
    fenwayPark: {
      runFactor: 0.95,
      leftFieldEffect: "Green Monster = HRs"
    },
    
    // Weather
    temperature: 72,
    windEffect: "minimal"
  },
  
  calculation: {
    yankeeRuns: 4.85 + 0.15, // slight boost at Fenway
    redSoxRuns: 4.15,
    
    totalRuns: 4.85 + 4.15,
    expectedTotal: 9.0,
    
    marketLine: 8.5,
    
    edge: {
      model: 9.0,
      market: 8.5,
      difference: 0.5,
      recommendation: "OVER 8.5 (model says 9.0)"
    }
  }
}
```

---

### 4.3 Player Prop Models

```javascript
// MLB Player Prop Model (Aaron Judge HR)
playerPropModel = {
  player: "Aaron Judge",
  prop: "Home Runs",
  line: 1.5,
  
  factors: {
    // Season Stats
    seasonStats: {
      atBats: 250,
      homeRuns: 28,
      hrRate: 28 / 250, // 11.2% per AB
      expectedHRs: 28 / 45 * 162 // ~100 for season pace
    },
    
    // vs Pitcher
    vsEovaldi: {
      atBats: 8,
      homeRuns: 1,
      historical: "1 HR in 8 AB vs Eovaldi"
    },
    
    // Park Factor
    fenwayPark: {
      hrFactor: 1.05,
      leftField: "Judge typically pulls"
    },
    
    // Metrics
    metrics: {
      launchAngle: 28,
      exitVelo: 98,
      hardHitRate: 0.42
    }
  },
  
  calculation: {
    seasonHRRate: 0.112, // 11.2% per AB
    expectedABs: 4.2,
    
    probabilityOver: {
      calculation: "1 - (1 - 0.112)^4.2",
      result: 0.38 // 38% chance of 2+ HRs
    },
    
    probabilityUnder: {
      calculation: "1 - 0.38",
      result: 0.62 // 62% chance of 0-1 HRs
    }
  },
  
  marketComparison: {
    over: { odds: -105, impliedProb: 0.512 },
    under: { odds: -115, impliedProb: 0.535 },
    
    model: {
      overProb: 0.38,
      underProb: 0.62
    },
    
    edge: {
      recommendation: "UNDER 1.5 at -115",
      modelSays: "62% for under",
      marketSays: "53.5%",
      edgeSize: 0.085
    }
  }
}
```

---

## 5. Synthesis & Opportunity Ranking

### 5.1 Confidence Scoring

```javascript
// Unified Confidence Score
confidenceScore = {
  opportunity: "Yankees ML at -110",
  
  // Signal Detection Pillar (0-33 points)
  signalDetection: {
    steamDetected: true, // +5
    sharpMoneyDetected: true, // +8
    rlmDetected: false, // +0
    liquidityConfirmed: true, // +5
    subtotal: 18 // out of 33
  },
  
  // Market Intelligence Pillar (0-33 points)
  marketIntelligence: {
    lineMovement: "supports Yankees", // +6
    correlationNormal: true, // +5
    sharpbooksAligned: true, // +8
    movementVelocity: "controlled (sharp)", // +5
    subtotal: 24 // out of 33
  },
  
  // Predictive Analytics Pillar (0-33 points)
  predictiveAnalytics: {
    modelEdge: 0.28, // +10 (large edge)
    modelConsensus: true, // +8
    injuryFactor: "favorable", // +5
    weatherNeutral: true, // +5
    subtotal: 28 // out of 33
  },
  
  // TOTAL SCORE
  totalScore: (18 + 24 + 28) / 99 * 100,
  finalScore: 84, // out of 100
  
  // Interpretation
  interpretation: {
    score: 84,
    rating: "A+ (Strongest Opportunity)",
    recommendation: "MAXIMUM CONFIDENCE PLAY",
    sizing: "Bet full Kelly or higher"
  }
}
```

**Scoring bands:**
- **85-100:** Maximum confidence (bet full Kelly)
- **70-84:** High confidence (half Kelly)
- **55-69:** Moderate confidence (quarter Kelly)
- **40-54:** Low confidence (small size)
- **<40:** Skip (wait for better)

---

### 5.2 Opportunity Ranking

```javascript
// MLB Daily Opportunity Ranking
opportunities = [
  {
    rank: 1,
    game: "NYY vs BOS",
    opportunity: "Yankees ML",
    edgeSize: 0.28,
    confidence: 84,
    liquidity: "high",
    bestBook: "FanDuel",
    bestOdds: -100,
    recommendedBet: {
      amount: 2000,
      ratio: "Full Kelly (28% bankroll)"
    }
  },
  {
    rank: 2,
    game: "NYY vs BOS",
    opportunity: "Over 8.5",
    edgeSize: 0.12,
    confidence: 72,
    liquidity: "high",
    bestBook: "DraftKings",
    bestOdds: -110,
    recommendedBet: {
      amount: 1000,
      ratio: "Half Kelly"
    }
  },
  {
    rank: 3,
    game: "LAD vs SD",
    opportunity: "Mookie Betts Over 1.5 Hits",
    edgeSize: 0.08,
    confidence: 65,
    liquidity: "medium",
    bestBook: "BetMGM",
    bestOdds: -110,
    recommendedBet: {
      amount: 400,
      ratio: "Quarter Kelly"
    }
  },
  // ... more opportunities
]
```

---

## 6. Real-Time Monitoring & Execution

### 6.1 Game-Day Workflow

```
T-24h (Day before)
├── Research phase
├── Model runs for next day's games
├── Market monitoring begins
└── Identify highest conviction plays

T-6h (Morning of game)
├── Sharps begin positioning
├── Track opening lines
├── Signal detection activates
└── Update models with latest info

T-2h (Pre-game)
├── Line movement peaks
├── Final model runs
├── RLM detection active
├── Execute highest-conviction plays

T-30min (Final lock)
├── Late-breaking news check
├── Injured players validation
├── Last-minute models
└── Execute final bets

T-0 (Game start)
├── Pause new bets
├── Monitor live betting if available
└── Begin post-game analysis

T+Game (Post-game)
├── Record results
├── Calculate CLV
├── Update model accuracy
├── Log signal performance
└── Continuous improvement
```

---

## 7. MLB-Specific Considerations

### 7.1 Pitcher Dominance Factor

**Why pitchers are 40% of the model:**
- Pitcher quality more predictive than team average
- Different pitcher = different game outcome
- Weather affects pitcher more than hitter
- Bullpen usage changes game dynamics

**Key pitcher metrics:**
- ERA vs league average
- K/9 (strikeouts per 9 innings)
- Walkrate (free passes = more scoring)
- Ground ball rate (GDP vs doubles)
- Recent form (last 5 games)
- Home vs road performance

---

### 7.2 Ballpark Effect

**Key ballpark factors:**
```javascript
ballparkFactors = {
  fenwayPark: {
    runFactor: 0.95,
    homeRunFactor: 1.05,
    doublesFactor: 1.12,
    reason: "Green Monster, short left field"
  },
  yangkeesStadium: {
    runFactor: 0.98,
    homeRunFactor: 1.08,
    reason: "Short right porch"
  },
  // ... etc for all 30 parks
}
```

---

### 7.3 Weather Impact

**Rain = lower scoring:**
- Ball doesn't carry as far
- Pitcher benefits (harder to hit)
- Games can be suspended/postponed

**Wind = runs:**
- Out-to-center = more HRs
- Out-to-field = fewer HRs
- Trades (field effects vary by park)

**Temperature:**
- Warmer = more air = more HRs
- Cold = deadens ball
- Check Denver (altitude affects everything)

---

### 7.4 Injury/Lineup Impact

**Who matters most:**
1. **Starting pitcher** (40% impact)
2. **Best hitter** (20% impact)
3. **Catcher** (10% impact — pitcher quality)
4. **Elite reliever** (10% impact)
5. **Rest of lineup** (20% impact)

**Rafael Devers out?** -5% to Red Sox win prob
**Gerrit Cole unavailable?** -15% to Yankees

---

## 8. Technology Stack

### 8.1 Data Sources

```javascript
dataSources = {
  oddsFeed: {
    provider: "Odds API",
    latency: "5-10 seconds",
    booksCovered: 15,
    marketsCovered: "ML, spread, O/U, props",
    updateFrequency: "real-time"
  },
  
  gameData: {
    provider: "SportsData.io",
    latency: "real-time",
    fields: ["lineups", "injuries", "weather", "stadium"],
    updateFrequency: "continuous"
  },
  
  historicalData: {
    source: "Baseball Reference, Statcast",
    fields: ["season stats", "matchup history", "trends"],
    updateFrequency: "daily"
  }
}
```

### 8.2 Processing Stack

```
Real-Time:
├── Node.js stream processing
├── Redis for caching
├── WebSocket for live updates
└── Kafka for event streaming (future)

Analytics:
├── Python (model training)
├── TensorFlow/PyTorch (ML models)
├── Pandas (data manipulation)
└── Claude API (research/insights)

Database:
├── PostgreSQL (primary)
├── TimescaleDB (time-series data)
├── Elasticsearch (search)
└── Redis (cache layer)
```

---

## 9. Performance Metrics

### 9.1 What We Track

```javascript
// Daily Tracking
const dailyMetrics = {
  signals: {
    steamSignalsIssued: 12,
    steamSignalWinRate: 0.58,
    sharpMoneyDetections: 8,
    sharpMoneyWinRate: 0.65,
    rlmDetections: 3,
    rlmWinRate: 0.75
  },
  
  predictions: {
    modelRunsDaily: 15,
    averagePredictionError: 2.3,
    hitRate: 0.56,
    averageEdge: 0.12
  },
  
  execution: {
    betsPlaced: 18,
    betTotal: 4500,
    cumulativeCLV: +185,
    winRate: 0.61,
    roi: 0.041 // 4.1% ROI
  }
}
```

---

## 10. Roadmap

**Phase 1 (Weeks 1-4): Foundation**
- ✅ Architecture design (this doc)
- [ ] Data pipeline setup
- [ ] Model training

**Phase 2 (Weeks 5-8): Alpha Testing**
- [ ] Signal detection live
- [ ] Backtesting on historical data
- [ ] Performance tracking

**Phase 3 (Weeks 9-12): Beta Expansion**
- [ ] All 3 pillars live
- [ ] Real-money testing (small size)
- [ ] Model refinement

**Phase 4 (Weeks 13-16): Production**
- [ ] Full scale
- [ ] Multi-book execution
- [ ] Continuous optimization

---

## Summary

**The MLB Engine combines three powerful approaches:**

1. **Signal Detection** → Find anomalies (steam, sharp money, RLM)
2. **Market Intelligence** → Track movement, correlations, spreads
3. **Predictive Analytics** → Model outcomes + calculate edge

**Result:** The most comprehensive sports betting market intelligence system ever built for MLB.

**Success looks like:**
- 58%+ win rate on signal-based bets
- 55%+ hit rate on model predictions
- Average +4-6% ROI annually
- Consistent profitable growth

---

**M9 Terminal — MLB Engine v1.0**

*Built for serious traders who understand that better information creates better decisions.*
