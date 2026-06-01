# Multi-League Models: Implementation Roadmap

## At a Glance

You currently have:
- ✅ **MLB Engine** (23KB of production logic)
- ❌ **NBA Engine** (not started)
- ❌ **NFL Engine** (not started)
- ❌ **NHL Engine** (not started)

## What We Need to Build (8 Weeks)

```
Week 1: Architecture Foundation
  └─ BaseEngine class (abstract)
  └─ EngineRouter (dispatcher)
  └─ Refactor MLB to use BaseEngine
  
Week 2: NBA Engine
  └─ Basketball-specific logic
  └─ Rest patterns, pace, bench scoring
  
Week 3: NFL Engine
  └─ Football-specific logic
  └─ Red zone, weather, down progression
  
Week 4: NHL Engine
  └─ Hockey-specific logic
  └─ Goaltending, special teams, possession
  
Week 5: Unified API Layer
  └─ Single endpoint routes to correct engine
  └─ Cross-league comparison tools
  
Week 6: Frontend Integration
  └─ Sport-specific signal display
  └─ Cross-league dashboard
  
Week 7: Testing & Optimization
  └─ Accuracy validation
  └─ Performance tuning
  
Week 8: Deployment & Launch
  └─ Production deployment
  └─ Live monitoring
```

## File Structure (Target)

```
backend/services/
├─ engines/
│  ├─ base-engine.js                (shared interface)
│  ├─ engine-router.js              (dispatcher)
│  ├─ mlb-engine.js                 (refactored)
│  ├─ nba-engine.js                 (NEW - Week 2)
│  ├─ nfl-engine.js                 (NEW - Week 3)
│  ├─ nhl-engine.js                 (NEW - Week 4)
│  │
│  ├─ nba-models/
│  │  ├─ pace-model.js
│  │  ├─ rest-model.js
│  │  ├─ bench-model.js
│  │  └─ three-point-model.js
│  │
│  ├─ nfl-models/
│  │  ├─ red-zone-model.js
│  │  ├─ weather-model.js
│  │  ├─ down-progression-model.js
│  │  └─ defensive-model.js
│  │
│  └─ nhl-models/
│     ├─ goaltender-model.js
│     ├─ special-teams-model.js
│     ├─ possession-model.js
│     └─ injury-impact-model.js
│
├─ model-performance.js             (tracking)
└─ engines-data/
   ├─ nba-league-stats.json
   ├─ nfl-league-stats.json
   └─ nhl-league-stats.json
```

## Week 1 Detailed Plan

### Step 1: Create BaseEngine (2 hours)
**Why:** All engines inherit same interface

```javascript
// backend/services/engines/base-engine.js

class BaseEngine {
  constructor(sport, config = {}) {
    this.sport = sport;
    this.config = config;
  }

  // Each child class implements these
  async analyzeGame(gameData) { }
  async detectSignals(gameData) { }
  async predictOutcome(gameData) { }
  async calculateValue(odds) { }
  
  // Shared utility methods
  normalizeConfidence(score) { }
  formatResponse(data) { }
}

module.exports = BaseEngine;
```

### Step 2: Create EngineRouter (1 hour)
**Why:** Single entry point, routes to correct engine

```javascript
// backend/services/engines/engine-router.js

class EngineRouter {
  constructor() {
    this.engines = {
      'baseball_mlb': MLBEngine,
      'basketball_nba': NBAEngine, // Will exist Week 2
      'americanfootball_nfl': NFLEngine, // Week 3
      'ice_hockey_nhl': NHLEngine // Week 4
    };
  }
  
  async analyzeGame(sport, gameData) {
    const engine = this.getEngine(sport);
    return engine.analyzeGame(gameData);
  }
}
```

### Step 3: Refactor MLB Engine (3 hours)
**Why:** Convert existing code to use BaseEngine pattern

```javascript
// Before: standalone class
class MLBSignalDetector { }

// After: extends BaseEngine
class MLBEngine extends BaseEngine {
  constructor() { super('MLB'); }
  async analyzeGame(gameData) { /* existing logic */ }
}
```

### Step 4: Test Week 1 (2 hours)
**Tests needed:**
- ✅ BaseEngine can be extended
- ✅ EngineRouter routes correctly
- ✅ MLB engine still works post-refactor
- ✅ Unified response format

**Status this week: Ready for NBA engine** ✅

---

## Week 2: NBA Engine Plan

### Key Differences from MLB
```
MLB = pitcher-dominant (162 games)
NBA = pace-dominant (82 games)

MLB signals:
- Weather impact
- Pitcher arm angle
- Home run volatility

NBA signals:
- Back-to-back fatigue
- Pace of play
- Bench depth
- 3-point shooting
```

### NBA Engine Structure
```javascript
class NBAEngine extends BaseEngine {
  async analyzeGame(gameData) {
    return {
      restAnalysis: this.analyzeRest(gameData),
      paceAnalysis: this.analyzePace(gameData),
      benchAnalysis: this.analyzeBench(gameData),
      threePointAnalysis: this.analyzeThreePoints(gameData),
      prediction: await this.predictScore(gameData)
    };
  }
}
```

### NBA Data You'll Need
- Team pace (possessions per game)
- Bench scoring (average)
- Three-point percentage
- Days since last game
- Player rotation patterns

---

## Week 3: NFL Engine Plan

### Key Differences from MLB/NBA
```
NFL = strategic planning (17 games, highly rested)

NFL unique factors:
- Red zone efficiency
- Weather (wind, snow, cold)
- Play-calling patterns
- Defensive matchups
- Down-and-distance context
```

### NFL Engine Structure
```javascript
class NFLEngine extends BaseEngine {
  async analyzeGame(gameData) {
    return {
      redZoneAnalysis: this.analyzeRedZone(gameData),
      weatherAnalysis: this.analyzeWeather(gameData),
      downProgressionAnalysis: this.analyzeDownProgression(gameData),
      defensiveMatchupAnalysis: this.analyzeDefense(gameData),
      prediction: await this.predictScore(gameData)
    };
  }
}
```

---

## Week 4: NHL Engine Plan

### Key Differences from Others
```
NHL = goaltender-dominant (82 games, 3-4x/week)

NHL unique factors:
- Goaltender strength (save %)
- Special teams (power play/penalty kill)
- Possession metrics (Corsi, Fenwick)
- Trade deadline impact
- Back-to-back games
```

### NHL Engine Structure
```javascript
class NHLEngine extends BaseEngine {
  async analyzeGame(gameData) {
    return {
      goaltenderAnalysis: this.analyzeGoaltenders(gameData),
      specialTeamsAnalysis: this.analyzeSpecialTeams(gameData),
      possessionAnalysis: this.analyzePossession(gameData),
      tradeDeadlineImpact: this.assessTradeImpact(gameData),
      prediction: await this.predictScore(gameData)
    };
  }
}
```

---

## API Endpoints (Week 5)

### Single Entry Point
```bash
# Route to any sport - engine handles the logic
POST /api/analyze-game
{
  "sport": "basketball_nba",
  "gameData": { /* NBA game data */ }
}
```

### Sport-Specific Signals
```bash
GET /api/signals/basketball_nba/game123
→ Returns NBA-specific signals (pace, rest, bench, etc.)

GET /api/signals/americanfootball_nfl/game456
→ Returns NFL-specific signals (red zone, weather, defense, etc.)
```

### Cross-League Comparison
```bash
GET /api/comparison
→ Compare signals across all 4 sports
→ Identify correlations
→ Show volume patterns
```

---

## Implementation Priority

### High (Start Week 1)
- [ ] BaseEngine abstraction
- [ ] EngineRouter dispatcher
- [ ] MLB refactor

### Medium (Weeks 2-4)
- [ ] NBA engine
- [ ] NFL engine
- [ ] NHL engine

### Lower (Week 5+)
- [ ] Cross-league tools
- [ ] Frontend integration
- [ ] Performance tracking

---

## Success Metrics Per League

### MLB (Already have)
- ✅ Signals generating
- Target: 55%+ hit rate on predictions

### NBA (Week 2 target)
- ✅ Rest impact detection
- ✅ Pace analysis
- Target: 52%+ hit rate

### NFL (Week 3 target)
- ✅ Red zone prediction
- ✅ Weather adjustment
- Target: 55%+ hit rate

### NHL (Week 4 target)
- ✅ Goaltender strength
- ✅ Special teams impact
- Target: 51%+ hit rate

---

## Revenue Impact

```
1 Sport (MLB only):
- Signals to users
- Revenue: $X/month

2 Sports (MLB + NBA):
- Concurrent betting seasons
- Revenue: $2X/month

3 Sports (MLB + NBA + NFL):
- Year-round coverage
- Revenue: $3X/month

4 Sports (All):
- Constant market activity
- Revenue: $4X/month
- Opportunity for "all sports" premium tier
```

---

## Quick Decision Points

**Q1: Do we start with NBA or NFL?**
- NBA is easier (fewer variables, better data)
- NFL is more popular (higher user demand)
- Recommendation: Start with NBA (Week 2)

**Q2: Do we build all at once or sequentially?**
- Sequential is safer (can validate each)
- All at once is faster (parallel teams)
- Recommendation: Sequential (one engine per week)

**Q3: When do we launch to users?**
- After NBA (2 weeks) = 2-sport platform
- After NFL (3 weeks) = 3-sport platform
- After NHL (4 weeks) = 4-sport platform
- Recommendation: Launch MLB+NBA after Week 5 (API ready)

---

## Next Action Items

1. **Approve architecture** (MULTI-LEAGUE-TAYLOR-MODELS.md)
2. **Assign developer(s)** for Week 1
3. **Gather NBA/NFL/NHL data sources** for weeks 2-4
4. **Plan database schema** for multi-league data
5. **Allocate infrastructure** for 4 engines
6. **Set launch timeline** (when do users see this?)

---

**Ready to go multi-league!** The architecture is proven. The MLB engine exists. Now we scale it to dominate all sports.

Questions?
1. Start Week 1 immediately?
2. Adjust timeline?
3. Change engine order?
4. Different architecture approach?
