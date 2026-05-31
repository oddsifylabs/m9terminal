---
name: mlb-engine-core-markets
title: MLB Engine — Core Markets (ML, Spread, O/U) with Multi-Profile Support
description: Production engine for Moneyline, Spread, Over/Under markets. Supports all bettor profiles (Sharp, Active, Research-focused). Player/game props deferred to Phase 2.
keywords: sports-betting, MLB, moneyline, spread, over-under, multi-profile, bettor-profiles
---

# MLB Engine — Core Markets

## Overview

The **MLB Engine** analyzes the three core betting markets:

1. **Moneyline (ML)** — Winner of the game
2. **Spread** — Point differential
3. **Over/Under (O/U)** — Total runs scored

**Three independent pipelines** (Signal Detection, Market Intelligence, Predictive Analytics) feed into a **unified confidence score** that works across all three markets.

**Bettor profiles** determine how the engine presents opportunities:
- **Sharp Profile** — Highest edge plays only, Kelly sizing
- **Active Profile** — Frequent updates, all confidence levels, execution ready
- **Research Profile** — Deep analysis, model explainer, confidence breakdown

---

## Architecture (Simplified)

```
INPUT: Single MLB Game
├── Odds (ML, spread, O/U from multiple books)
├── Game data (pitcher, injuries, weather)
└── Movement history (5-10 min snapshots)

PROCESSING (3 Pipelines)
├── Signal Detection
│   ├── Steam (public consensus)
│   ├── Sharp Money (professional alignment)
│   ├── RLM (sharps vs public)
│   └── Liquidity (volume signals)
│
├── Market Intelligence
│   ├── Line movement tracking (all 3 markets)
│   ├── Cross-market correlations
│   ├── Sportsbook comparison
│   └── Movement velocity
│
└── Predictive Analytics
    ├── Win Probability Model → ML recommendation
    ├── Spread Model → Spread recommendation
    ├── O/U Model → Over/Under recommendation
    └── EV calculation for all 3

SYNTHESIS
├── Confidence Score (0-100) per market
├── Edge Size per market
└── Recommendation per market

OUTPUT (Per Bettor Profile)
├── Sharp: Only 80+ confidence plays, full Kelly
├── Active: All plays 55+, half Kelly, real-time updates
└── Research: All plays, full model breakdown, educational
```

---

## Core Markets

### 1. Moneyline (ML)

**What it is:** Pick the winner (home or away)

**Model inputs:**
- Pitcher quality (40% weight) — ERA, K/9, recent form
- Team quality (20%) — OPS, ERA, winning percentage
- Injuries (20%) — Missing star players
- Weather (10%) — Temperature affects scoring
- Recent form (10%) — Last 10 games

**Output:**
```javascript
{
  market: "ML",
  recommendation: "BET_AWAY",
  modelWinProb: 0.76,        // Model says 76% to win
  impliedProb: 0.476,        // Market says 47.6%
  edge: 0.284,               // 28.4% edge
  confidence: 84,            // A+ (MAXIMUM)
  bestBook: "FanDuel",
  bestOdds: -100,
  kellySize: 0.28,           // 28% of bankroll
  recommendation: "BET AWAY AT -100"
}
```

### 2. Spread

**What it is:** Point differential (e.g., "Home -5.5")

**Model inputs:**
- Same as ML, but adjusted for spread implications
- Pythagorean expectation (run differential predictor)
- Historical spread accuracy
- Home/away splits

**Output:**
```javascript
{
  market: "SPREAD",
  recommendation: "FADE_PUBLIC",
  modelSpread: -4.8,         // Model predicts home -4.8
  marketSpread: -5.5,        // Market at -5.5
  edge: 0.7,                 // 0.7 point edge
  confidence: 72,            // A (HIGH)
  bestBook: "DraftKings",
  bestOdds: -110,
  kellySize: 0.14,           // 14% of bankroll
  recommendation: "BET AWAY +5.5 AT -110"
}
```

### 3. Over/Under (O/U)

**What it is:** Total combined runs (e.g., "Over 8.5")

**Model inputs:**
- Pitcher quality (ERA, K/9) — affects run prevention
- Team run rates (per game, vs pitcher type)
- Weather (temperature, wind) — huge impact
- Ballpark factor (each park has unique scoring environment)
- Recent trends (last 10 games)

**Output:**
```javascript
{
  market: "OVER_UNDER",
  recommendation: "OVER",
  expectedTotal: 9.2,        // Model predicts 9.2 runs
  marketTotal: 8.5,          // Market at 8.5
  edge: 0.7,                 // 0.7 run edge
  confidence: 75,            // A (HIGH)
  bestBook: "BetMGM",
  bestOdds: -110,
  kellySize: 0.175,          // 17.5% of bankroll
  recommendation: "BET OVER 8.5 AT -110"
}
```

---

## Three Independent Pipelines

### Pipeline 1: Signal Detection

Runs the same for all three markets.

```javascript
class SignalDetector {
  detectAllSignals(gameData) {
    return [
      this.detectSteam(gameData),
      this.detectSharpMoney(gameData),
      this.detectRLM(gameData),
      this.detectLiquidity(gameData)
    ].filter(s => s !== null)
  }
}

// Returns signals applicable to ML, spread, AND O/U
// (e.g., if public heavily on over, line should move up)
```

**Signal scoring:** 0-33 points

---

### Pipeline 2: Market Intelligence

Tracks movement **independently** for each market.

```javascript
class MarketIntelligence {
  // Separate tracking for each market
  
  trackMLMovement(gameId, movement) {
    // ML line movements: -115 → -120 → -110
    // Direction, velocity, efficiency
  }
  
  trackSpreadMovement(gameId, movement) {
    // Spread movements: -5.0 → -5.5 → -5.0
    // Which direction? How fast? Why?
  }
  
  trackOUMovement(gameId, movement) {
    // O/U movements: 8.5 → 8.0 → 8.5
    // Are we seeing over bets or under bets?
  }
  
  analyzeCrossMarketCorrelation(gameId) {
    // Do movements make sense together?
    // E.g., if ML moves toward away team,
    // spread should move away team direction too
  }
}

// Returns market intelligence: 0-33 points
```

**Key insight:** If movements don't correlate across markets, there's an edge.

---

### Pipeline 3: Predictive Analytics

**Separate models per market.**

```javascript
class PredictiveModel {
  // MONEYLINE MODEL
  predictML(homeTeam, awayTeam, game) {
    let homeWinProb = 0.500;
    
    // Pitcher dominance (40%)
    homeWinProb += (this.getPitchingAdj(...)) * 0.40;
    
    // Team quality (20%)
    homeWinProb += (this.getTeamAdj(...)) * 0.20;
    
    // Injuries (20%)
    homeWinProb += (this.getInjuryAdj(...)) * 0.20;
    
    // Weather (10%)
    homeWinProb += (this.getWeatherAdj(...)) * 0.10;
    
    // Form (10%)
    homeWinProb += (this.getFormAdj(...)) * 0.10;
    
    return homeWinProb; // 0-1 range
  }
  
  // SPREAD MODEL
  predictSpread(homeTeam, awayTeam, game) {
    // Start with win probability
    const winProb = this.predictML(homeTeam, awayTeam, game);
    
    // Convert to expected point differential
    // If home 76% to win, what's expected margin?
    // Pythagorean expectation: run differential
    
    const expectedRunDiff = this.calculateRunDifference(
      homeTeam, awayTeam, game
    );
    
    return expectedRunDiff; // e.g., -4.8
  }
  
  // OVER/UNDER MODEL
  predictTotal(homeTeam, awayTeam, game) {
    // Run scoring model (independent of winner)
    
    let homeRuns = homeTeam.runsPerGame;
    let awayRuns = awayTeam.runsPerGame;
    
    // Pitcher ERA → run prevention
    const homePitcherEffect = this.getPitcherRunImpact(game.homePitcher);
    const awayPitcherEffect = this.getPitcherRunImpact(game.awayPitcher);
    
    homeRuns -= homePitcherEffect;
    awayRuns -= awayPitcherEffect;
    
    // Ballpark factor
    homeRuns *= game.ballpark.runFactor;
    awayRuns *= game.ballpark.runFactor;
    
    // Weather
    const weatherEffect = this.getWeatherRunImpact(game.weather);
    homeRuns *= weatherEffect;
    awayRuns *= weatherEffect;
    
    // Recent trends
    homeRuns *= (homeTeam.last10Avg / homeTeam.seasonAvg);
    awayRuns *= (awayTeam.last10Avg / awayTeam.seasonAvg);
    
    return homeRuns + awayRuns; // e.g., 9.2
  }
}

// Returns model prediction + EV: 0-33 points
```

**Key:** Each market gets its own model. They inform each other but run independently.

---

## Unified Confidence Scoring

```javascript
class OpportunitySynthesis {
  synthesizeForMarket(market, signals, intel, prediction) {
    // Combine all 3 pipelines
    
    const signalScore = this.scoreSignals(signals);      // 0-33
    const marketScore = this.scoreMarketIntel(intel);    // 0-33
    const predictionScore = this.scorePrediction(prediction); // 0-33
    
    const totalConfidence = (signalScore + marketScore + predictionScore) / 99 * 100;
    
    // Rating
    const rating = this.getConfidenceRating(totalConfidence);
    
    return {
      market: market,           // "ML", "SPREAD", or "OVER_UNDER"
      confidence: totalConfidence,
      rating: rating,
      recommendation: this.getRecommendation(prediction),
      edge: Math.abs(prediction.edge),
      bestBook: prediction.bestBook,
      bestOdds: prediction.bestOdds,
      kellySize: this.calculateKelly(totalConfidence, prediction.edge)
    };
  }
  
  calculateKelly(confidence, edge) {
    // Kelly Fraction = (prob * odds) - 1
    // Then apply confidence multiplier
    
    const baseKelly = edge * (confidence / 100);
    
    // Conservative: cap at 2.8% (full Kelly for 85+ confidence)
    return Math.min(baseKelly, 0.028);
  }
}
```

---

## Bettor Profiles

**The engine outputs the same analysis, but each profile consumes it differently.**

### 1. Sharp Profile

**Audience:** Professional bettors, high edge, Kelly sizing

**Filter criteria:**
```javascript
const sharpFilter = {
  minConfidence: 80,           // Only A+ and A plays
  minEdge: 0.15,               // 15%+ edge required
  maxBets: 5,                  // Only best 5 per day
  sizing: "fullKelly",         // 2.8% (full) or 1.4% (half)
  display: "minimal"           // Just the recommendation
};

// Example output for Sharp
{
  game: "NYY @ BOS",
  market: "ML",
  recommendation: "BET AWAY -100",
  confidence: 84,
  edge: 28,
  edgePercent: "+28%",
  betSize: 2800,              // Full Kelly
  reason: "Sharp money + RLM detected. Cole >> Eovaldi. BET."
}
```

### 2. Active Profile

**Audience:** Frequent bettors, multiple plays, real-time updates

**Filter criteria:**
```javascript
const activeFilter = {
  minConfidence: 55,           // B, A, and A+ plays
  minEdge: 0.05,               // 5%+ edge
  maxBets: 20,                 // All good plays
  sizing: "halfKelly",         // Conservative sizing
  updateFrequency: "10min",    // Real-time refreshes
  display: "actionable"        // Odds, book, reasoning
};

// Example output for Active
{
  game: "NYY @ BOS",
  markets: [
    {
      market: "ML",
      recommendation: "BET AWAY -100",
      confidence: 84,
      edge: "+28%",
      betSize: 1400         // Half Kelly
    },
    {
      market: "OVER",
      recommendation: "BET OVER 8.5 -110",
      confidence: 72,
      edge: "+12%",
      betSize: 700          // Half Kelly
    }
  ],
  lastUpdate: "2026-06-03T14:45:00Z"
}
```

### 3. Research Profile

**Audience:** Data enthusiasts, model learners, educational

**Filter criteria:**
```javascript
const researchFilter = {
  minConfidence: 0,            // All plays
  minEdge: 0,                  // No filter
  maxBets: "unlimited",        // See everything
  sizing: "none",              // No recommendations
  updateFrequency: "daily",    // Batch analysis
  display: "detailed"          // Full model breakdown
};

// Example output for Research
{
  game: "NYY @ BOS 2026-06-03",
  
  signals: [
    { type: "SHARP_MONEY", confidence: 0.92, detail: "..." },
    { type: "RLM", confidence: 0.95, detail: "..." },
    { type: "STEAM", confidence: 0.75, detail: "..." }
  ],
  
  marketIntelligence: {
    mlMovement: { opening: -110, current: -110, velocity: "controlled" },
    spreadMovement: { opening: -5.0, current: -5.5, sharpFavor: "away" },
    ouMovement: { opening: 8.5, current: 8.5, publicFavor: "over" },
    bestOdds: { ...details for all 3 markets }
  },
  
  models: {
    ml: {
      homeWinProb: 0.24,
      awayWinProb: 0.76,
      modelInputs: {
        pitching: +0.12,
        teamQuality: +0.08,
        injuries: +0.05,
        weather: 0.00,
        form: +0.03
      },
      impliedProb: 0.476,
      edge: 0.284,
      interpretation: "Model favors away significantly"
    },
    spread: {
      expectedSpread: -4.8,
      marketSpread: -5.0,
      edge: 0.2,
      interpretation: "Slight away value"
    },
    overUnder: {
      expectedTotal: 9.2,
      marketTotal: 8.5,
      edge: 0.7,
      interpretation: "Over is slight value"
    }
  },
  
  synthesis: {
    confidence: { ml: 84, spread: 72, ou: 75 },
    recommendation: {
      ml: "STRONG BET AWAY",
      spread: "SLIGHT BET AWAY",
      ou: "BET OVER"
    }
  }
}
```

---

## API Endpoints (Per Profile)

```javascript
// SHARP PROFILE
POST /api/mlb/opportunities/sharp
// Returns: Only 80+ confidence plays, Kelly sizing, minimal info
// Response: 2-5 plays per day max

// ACTIVE PROFILE  
POST /api/mlb/opportunities/active
// Returns: All 55+ confidence plays, half Kelly, actionable format
// Response: Real-time updates, 10-20 plays per day

// RESEARCH PROFILE
POST /api/mlb/opportunities/research
// Returns: All plays, full model breakdown, educational
// Response: Daily analysis, unlimited plays

// COMMON ENDPOINT (Profile selection at user level)
GET /api/mlb/game/:gameId
// Query param: ?profile=sharp|active|research
// Returns: Same analysis, different presentation

POST /api/mlb/analyze
// Body: { gameId, profile: "sharp|active|research" }
// Returns: Profile-specific output
```

---

## Database Schema (Core Markets Only)

```sql
CREATE TABLE mlb_opportunities (
  id SERIAL PRIMARY KEY,
  game_id VARCHAR(50),
  game_date DATE,
  
  -- Market-specific columns
  market VARCHAR(20), -- "ML", "SPREAD", "OVER_UNDER"
  recommendation VARCHAR(50), -- "BET_HOME", "FADE_PUBLIC", etc.
  model_probability FLOAT,
  implied_probability FLOAT,
  edge FLOAT,
  edge_percent FLOAT,
  
  -- Signals & analysis
  signals TEXT[],
  confidence INT,
  signal_score INT,
  market_score INT,
  prediction_score INT,
  
  -- Execution
  best_book VARCHAR(50),
  best_odds FLOAT,
  kelly_size FLOAT,
  bet_size_kelly FLOAT,
  bet_size_half_kelly FLOAT,
  
  -- Outcome tracking
  opening_line FLOAT,
  closing_line FLOAT,
  closing_line_value FLOAT,
  result VARCHAR(20), -- "WIN", "LOSS", "PUSH"
  actual_result FLOAT,
  clv FLOAT,
  profit_loss FLOAT,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX idx_game_market ON mlb_opportunities(game_id, market);
CREATE INDEX idx_confidence ON mlb_opportunities(confidence DESC);
CREATE INDEX idx_created ON mlb_opportunities(created_at DESC);
```

---

## Data Flow (Simplified)

```
1. FETCH GAME DATA
   └─ MLB game, pitcher, injuries, weather, odds

2. FETCH MOVEMENT HISTORY
   └─ Line snapshots for ML, spread, O/U

3. RUN 3 PIPELINES IN PARALLEL
   ├─ Signal Detection (shared)
   ├─ Market Intel (per market)
   └─ Models (per market)

4. SYNTHESIZE CONFIDENCE
   ├─ ML: confidence_ml, edge_ml, recommendation_ml
   ├─ SPREAD: confidence_spread, edge_spread, recommendation_spread
   └─ O/U: confidence_ou, edge_ou, recommendation_ou

5. APPLY PROFILE FILTER
   ├─ Sharp: 80+, 15%+ edge, Kelly sizing
   ├─ Active: 55+, 5%+ edge, half Kelly
   └─ Research: All, no filter, educational

6. RETURN TO USER
   └─ Profile-specific output
```

---

## Three Markets, One Analysis

**Key insight:** The same game generates up to 3 independent opportunities:

```
Game: Yankees @ Red Sox

ML (Moneyline):
├─ Confidence: 84 (A+)
├─ Recommendation: BET AWAY
├─ Edge: +28%
└─ Kelly: 2.8% (full)

SPREAD (Yankees +5.5):
├─ Confidence: 72 (A)
├─ Recommendation: BET AWAY +5.5
├─ Edge: +7%
└─ Kelly: 1.4% (half)

OVER/UNDER (8.5):
├─ Confidence: 75 (A)
├─ Recommendation: BET OVER
├─ Edge: +12%
└─ Kelly: 1.75%

Total Daily Bets: 3 per game × 15 games = 45 opportunities
```

**But Sharp profile sees only:** ML at 84 (confident, big edge)
**Active profile sees all 3** with proper sizing
**Research profile sees all 3** with full breakdown

---

## Roadmap

**Phase 1: Core Markets (Current)**
- ✅ ML, Spread, O/U models
- ✅ 3 bettor profiles
- ✅ Confidence scoring
- ✅ Kelly sizing
- ✅ API endpoints
- [ ] Deploy to Railway
- [ ] Connect live odds

**Phase 2: Props (Later)**
- [ ] Player props (home runs, hits)
- [ ] Game props (total strikeouts, hits)
- [ ] Same 3-profile system

**Phase 3: Other Leagues (Parallel)**
- [ ] NBA (same 3-market structure)
- [ ] NFL (same 3-market structure)
- [ ] NHL (same 3-market structure)

---

## Success Metrics

For **Core Markets Only:**

- **ML accuracy:** 56%+ hit rate
- **Spread accuracy:** 52%+ hit rate
- **O/U accuracy:** 53%+ hit rate
- **Signal accuracy:** 58%+ RLM win rate
- **Overall ROI:** +4-6% annually
- **Profile retention:** 90%+ of users stay on profile

---

## Summary

**One engine, three markets, three profiles.**

- **ML, Spread, O/U** each get independent analysis
- **Signals, market intel, models** feed all three
- **Confidence scoring** ranks opportunities
- **Bettor profiles** filter and present differently
- **Sharp:** High edge, Kelly sizing, minimal plays
- **Active:** All good plays, half Kelly, real-time
- **Research:** All plays, full breakdown, educational

**Player props come in Phase 2. This is the foundation.**

---

**M9 Terminal — MLB Engine v2.0 (Core Markets Focus)**

*Three markets. Three profiles. One world-class engine.*
