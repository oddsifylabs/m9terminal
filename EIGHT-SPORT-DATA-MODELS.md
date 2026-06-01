# M9 Terminal: 8-Sport Data Models & Specifications

---

## Sport-Specific Data Requirements

### PHASE 1: MLB (Week 1-2) ⚾

**Game Data Structure:**
```javascript
{
  sport: 'baseball_mlb',
  gameId: 'mlb_2024_0512',
  startTime: '2024-05-12T19:05:00Z',
  
  home: {
    teamId: 'nyx',
    name: 'New York Mets',
    pitcher: {
      id: 'deGrom',
      name: 'Jacob deGrom',
      era: 2.43,
      whip: 0.95,
      fastballVelo: 98.2,
      lastGame: '2024-05-08',
      restDays: 4
    },
    stats: {
      runsPerGame: 4.2,
      homeRunRate: 0.15,
      strikeoutRate: 0.18,
      bullpenEra: 3.45,
      parkFactor: 1.08
    }
  },
  
  away: { /* same structure */ },
  
  weather: {
    temperature: 72,
    wind: 8,  // mph
    precipitation: 'none',
    humidity: 65,
    condition: 'clear'
  },
  
  odds: {
    moneyline: { home: -120, away: +110 },
    spread: { line: 1.5, home: -110, away: -110 },
    total: { line: 8.5, over: -110, under: -110 }
  }
}
```

**Key Metrics:** Pitcher ERA, WHIP, fastball velo, park factor, weather, rest days
**Critical Signals:** Weather >10mph wind, pitcher dominance, bullpen strength

---

### PHASE 2: SOCCER/MLS (Week 3-4) ⚽

**Game Data Structure:**
```javascript
{
  sport: 'soccer_mls',  // or 'soccer_epl', 'soccer_laliga'
  gameId: 'mls_2024_0615',
  startTime: '2024-06-15T19:30:00Z',
  
  home: {
    teamId: 'lar',
    name: 'LA Galaxy',
    formation: '4-3-3',
    recentForm: ['W', 'W', 'D', 'W', 'L'],  // Last 5
    stats: {
      xg: 1.85,  // Expected goals
      possession: 58,
      shotOnTarget: 5,
      passAccuracy: 82,
      defensivePressure: 75,
      set_pieceGoals: 3
    }
  },
  
  away: { /* same */ },
  
  environmental: {
    altitude: 0,
    temperature: 72,
    humidity: 65,
    turf: 'natural'
  },
  
  context: {
    daysSinceLastGame: {home: 7, away: 7},
    internationalBreak: false,
    travelDistance: {away: 450},  // miles for away team
    isRivalry: false
  },
  
  odds: {
    moneyline: { home: -130, draw: +230, away: +350 },
    spread: { line: 0.5, home: -110, away: -110 },
    total: { line: 2.5, over: -110, under: -110 }
  }
}
```

**Key Metrics:** xG (expected goals), possession, shot on target, press success, formation
**Critical Signals:** Domination pattern (60%+ possession + 1.5+ xG), defensive vulnerability

---

### PHASE 3: NFL (Week 5-6) 🏈

**Game Data Structure:**
```javascript
{
  sport: 'americanfootball_nfl',
  gameId: 'nfl_2024_0912',
  startTime: '2024-09-12T20:20:00Z',
  week: 1,
  
  home: {
    teamId: 'kc',
    name: 'Kansas City Chiefs',
    qb: {
      name: 'Patrick Mahomes',
      isStarter: true,
      experience: 'elite'
    },
    stats: {
      offensiveRating: 115,  // Points per game
      redZoneTouchdownRate: 0.68,
      redZoneFieldGoalRate: 0.22,
      redZoneTurnoverRate: 0.10,
      defensiveRating: 92,
      sackRate: 0.045,
      interceptionRate: 0.025,
      rushingEpa: 0.12  // Expected points added
    }
  },
  
  away: { /* same */ },
  
  weather: {
    temperature: 68,
    wind: 8,
    precipitation: 'none',
    windCritical: false
  },
  
  oddsContext: {
    opening: -3.5,
    current: -4.0,
    movement: -0.5
  },
  
  odds: {
    spread: { line: -4.0, home: -110, away: -110 },
    total: { line: 46.5, over: -110, under: -110 },
    moneyline: { home: -185, away: +155 }
  }
}
```

**Key Metrics:** Red zone efficiency, defensive rating, EPA (expected points), wind impact
**Critical Signals:** Red zone mismatch (efficient O vs weak D), weather advantage

---

### PHASE 4: COLLEGE FOOTBALL (Week 7-8) 🏈

**Game Data Structure:**
```javascript
{
  sport: 'americanfootball_ncaafb',
  gameId: 'ncaafb_2024_0902',
  startTime: '2024-09-02T12:00:00Z',
  week: 1,
  
  home: {
    teamId: 'alabama',
    name: 'Alabama',
    conference: 'SEC',
    coach: {
      name: 'Kalen DeBoer',
      tenureYears: 1,
      tournamentWins: 12
    },
    strength: {
      fpi: 28.5,  // Football Power Index
      conferenceRank: 1,
      recruitingRank: 2
    },
    stats: {
      offensiveRating: 34.2,
      defensiveRating: 14.5,
      turnoverMargin: 1.2,
      thirdDownConversion: 0.45,
      redZoneEfficiency: 0.92
    }
  },
  
  away: { /* same */ },
  
  context: {
    isRivalry: false,
    playoffImplications: 'early_season',
    bowlEligibilityStatus: { home: 'safe', away: 'safe' },
    homeFieldAdvantage: {
      crowdNoise: 95,  // decibels
      capacity: 100250,
      filledPercent: 100
    }
  },
  
  odds: {
    spread: { line: -17.5, home: -110, away: -110 },
    total: { line: 57.5, over: -110, under: -110 },
    moneyline: { home: -1200, away: +800 }
  }
}
```

**Key Metrics:** FPI, turnover margin, third down conversion, recruiting rank, coach history
**Critical Signals:** FPI gap >8 points, turnover margin swing, home field dominance

---

### PHASE 5: NBA (Week 9-10) 🏀

**Game Data Structure:**
```javascript
{
  sport: 'basketball_nba',
  gameId: 'nba_2024_1025',
  startTime: '2024-10-25T19:30:00Z',
  
  home: {
    teamId: 'lakers',
    name: 'Los Angeles Lakers',
    stats: {
      offensiveRating: 115.3,
      defensiveRating: 108.2,
      paceOffensive: 101.2,
      benchScoring: 32.4,
      threePointPercentage: 0.354,
      freeThrowRate: 0.235
    },
    restContext: {
      daysSinceLastGame: 2,
      backToBackStatus: false,
      restAdvantage: 'home'
    }
  },
  
  away: { /* same */ },
  
  odds: {
    spread: { line: -5.5, home: -110, away: -110 },
    total: { line: 223.5, over: -110, under: -110 },
    moneyline: { home: -230, away: +190 }
  }
}
```

**Key Metrics:** Pace, offensive/defensive rating, bench scoring, rest days, 3-point %
**Critical Signals:** Rest advantage (B2B penalty), pace mismatch, bench depth

---

### PHASE 6: COLLEGE BASKETBALL (Week 11-12) 🏀

**Game Data Structure:**
```javascript
{
  sport: 'basketball_ncaa',
  gameId: 'ncaa_2024_1115',
  startTime: '2024-11-15T19:00:00Z',
  
  home: {
    teamId: 'duke',
    name: 'Duke Blue Devils',
    conference: 'ACC',
    strength: {
      rpi: 8,  // Rating Percentage Index
      netRating: 18.5,
      conferenceRank: 2
    },
    stats: {
      offensiveRating: 118.2,
      defensiveRating: 99.7,
      benchScoringPercent: 0.42,
      threePointVolumeRate: 0.38,
      freeThrowRate: 0.30,
      assistTurnoverRatio: 1.8
    },
    context: {
      tournamentSeedEstimate: 3,
      playoffQualityWins: 2,
      losses: 0,
      coachTournamentWins: 42
    }
  },
  
  away: { /* same */ },
  
  odds: {
    spread: { line: -11.0, home: -110, away: -110 },
    total: { line: 157.5, over: -110, under: -110 },
    moneyline: { home: -550, away: +420 }
  }
}
```

**Key Metrics:** RPI, net rating, bench % of scoring, 3-point volume, tournament implications
**Critical Signals:** Bench depth advantage, tournament stress (locked in, play tighter), power 5 vs mid-major gap

---

### PHASE 7: NHL (Week 13-14) 🎯

**Game Data Structure:**
```javascript
{
  sport: 'ice_hockey_nhl',
  gameId: 'nhl_2024_1110',
  startTime: '2024-11-10T19:00:00Z',
  
  home: {
    teamId: 'tor',
    name: 'Toronto Maple Leafs',
    goaltender: {
      name: 'Joseph Woll',
      savePercentage: 0.924,
      gaa: 2.15,
      gamesPlayed: 12,
      lastGame: '2024-11-09'
    },
    stats: {
      offensiveRating: 3.15,  // Goals per game
      defensiveRating: 2.85,
      powerPlayPercentage: 0.224,
      penaltyKillPercentage: 0.825,
      corsiPercent: 0.523,  // Shot attempt differential
      fenwiekPercent: 0.531,  // Unblocked shots
      shotsPerGame: 32.5
    }
  },
  
  away: { /* same */ },
  
  context: {
    backToBack: { home: false, away: true },
    restDays: { home: 2, away: 1 },
    tradeDeadlineImpact: 0,  // playoff contender bonus
    playoffSeeding: 2
  },
  
  odds: {
    spread: { line: -1.5, home: -110, away: -110 },
    total: { line: 6.0, over: -110, under: -110 },
    moneyline: { home: -155, away: +135 }
  }
}
```

**Key Metrics:** Goaltender save %, special teams (PP/PK %), Corsi/Fenwick, back-to-back status
**Critical Signals:** Goaltender mismatch (elite vs average), special teams dominance, back-to-back fatigue

---

## Shared Signal Framework (All 8 Sports)

### Signal Type 1: SHARP MONEY
**Definition:** Professional wiseguys betting early
**Detection:**
- Line opens at consensus
- Sharp books move line before public
- Professional action vs casual action ratio
- Confidence: 70-85%

**Logic (Universal):**
```javascript
const sharpMoneySignal = {
  type: 'SHARP_MONEY',
  confidence: 75,
  direction: 'HOME_FAVORED', // or AWAY_FAVORED
  magnitude: 2.5,  // points/goals
  source: 'opening_line_movement',
  strength: 'MODERATE'
}
```

### Signal Type 2: STEAM
**Definition:** Public money causing line movement same direction
**Detection:**
- Public heavily on one side (65%+ of bets)
- Line moves with public (not against)
- Volume spike
- Confidence: 60-75%

**Logic (Universal):**
```javascript
const steamSignal = {
  type: 'STEAM',
  confidence: 68,
  direction: 'PUBLIC_CONSENSUS',
  publicPercent: 72,
  volumeSpike: true,
  strength: 'STRONG'
}
```

### Signal Type 3: LINE VALUE
**Definition:** Consensus vs sharp disagreement = inefficiency
**Detection:**
- Vegas consensus differs from sharp consensus
- Line adjustment breaks historical pattern
- Open-to-close movement >1 point
- Confidence: 55-70%

**Logic (Universal):**
```javascript
const lineValueSignal = {
  type: 'LINE_VALUE',
  confidence: 62,
  inefficiency: 'HOME_UNDERVALUED',
  openingLine: -3.5,
  currentLine: -4.0,
  projectedLine: -2.5,
  valuePercent: 1.5  // points of value
}
```

### Signal Type 4: VOLUME ANOMALY
**Definition:** Unusual betting action (contrarian play)
**Detection:**
- Betting volume 2-3x normal
- Sudden direction reversal
- Sharp books pulling limits
- Confidence: 65-80%

**Logic (Universal):**
```javascript
const volumeSignal = {
  type: 'VOLUME_ANOMALY',
  confidence: 72,
  volumeMultiple: 2.5,  // 2.5x normal
  direction: 'CONTRARIAN_AWAY',
  impactOnLine: -1.0,
  bookLimitsPulled: true
}
```

---

## API Integration Points

### Data Sources per Sport

**MLB:**
- SportsData.io: Game data, pitcher stats, weather
- Odds API: Line movement, bookmaker odds

**Soccer:**
- SportsData.io: Team stats, xG, formation
- Understat.com: Advanced possession metrics
- Odds API: All leagues

**NFL:**
- SportsData.io: Game data, EPA, red zone %
- Pro-Football-Reference: Historical context
- Odds API: All books

**College Football:**
- SportsData.io: Game data, FPI (ESPN calc)
- 247Sports: Recruiting ranks
- Odds API: Lines

**NBA:**
- SportsData.io: Game data, pace, ratings
- NBA.com: Advanced stats
- Odds API: Lines

**College Basketball:**
- SportsData.io: Game data, RPI, net rating
- Tournament.org: Seeding projections
- Odds API: Lines

**NHL:**
- SportsData.io: Game data, special teams
- Corsica.hockey: Corsi/Fenwick advanced
- Odds API: Lines

---

## Confidence Calibration per Sport

### Sport Difficulty (Ascending)
```
Easiest:  NFL (54%+ hit rate possible)
          ↓
          MLB (52%+ hit rate possible)
          ↓
          Soccer (50%+ hit rate possible)
          ↓
          NBA (52%+ hit rate possible)
          ↓
          College Football (49%+ realistic)
          ↓
          College Basketball (48%+ realistic)
          ↓
Hardest:  NHL (50%+ hit rate realistic, low scoring)
```

### Confidence Thresholds
```
Sport              Min Confidence   Max Confidence   Realistic Hit Rate
MLB                45               65               52%
Soccer             40               60               50%
NFL                50               70               54%
College FB         40               60               49%
NBA                45               65               52%
College BB         35               55               48%
NHL                45               60               50%
```

---

## Testing & Validation Checklist

### Per Sport (Weeks 1-14)
- [ ] 10+ games analyzed
- [ ] All 4 signals generating
- [ ] Confidence calibrated
- [ ] Real-time data flowing
- [ ] API integration tested
- [ ] Accuracy tracked
- [ ] User dashboard updated
- [ ] Documentation complete

---

## Next Steps

1. Approve data models per sport
2. Assign developers to each 2-week phase
3. Configure API integrations (SportsData.io, Odds API)
4. Build sport-specific models starting Week 1
5. Launch MLB → Soccer → NFL → ... → NHL sequentially

**Ready to build 8 engines!** 🚀
