/**
 * M9 Terminal - Engine Test Suite
 * Comprehensive tests for BaseEngine, EngineRouter, and MLBEngine
 */

const EngineRouter = require('./engine-router');
const MLBEngine = require('./mlb-engine');

// ============================================================================
// SAMPLE GAME DATA
// ============================================================================

const sampleMLBGame = {
  gameId: 'mlb-20260601-001',
  sport: 'MLB',
  date: '2026-06-01T19:05:00Z',
  season: 2026,
  home: {
    name: 'New York Yankees',
    teamId: 'NYY',
    wins: 35,
    losses: 25,
    gamesPlayed: 60,
    runsFor: 285,
    runsAgainst: 245,
    recentGames: [
      { result: 'W', runs: 5, opponentRuns: 3 },
      { result: 'W', runs: 4, opponentRuns: 2 },
      { result: 'L', runs: 2, opponentRuns: 3 },
      { result: 'W', runs: 6, opponentRuns: 4 },
      { result: 'W', runs: 3, opponentRuns: 1 },
      { result: 'W', runs: 7, opponentRuns: 5 },
      { result: 'L', runs: 1, opponentRuns: 2 },
      { result: 'W', runs: 4, opponentRuns: 3 },
      { result: 'W', runs: 5, opponentRuns: 4 },
      { result: 'W', runs: 6, opponentRuns: 2 }
    ]
  },
  away: {
    name: 'Boston Red Sox',
    teamId: 'BOS',
    wins: 32,
    losses: 28,
    gamesPlayed: 60,
    runsFor: 270,
    runsAgainst: 260,
    recentGames: [
      { result: 'L', runs: 3, opponentRuns: 5 },
      { result: 'L', runs: 2, opponentRuns: 4 },
      { result: 'W', runs: 3, opponentRuns: 2 },
      { result: 'L', runs: 1, opponentRuns: 3 },
      { result: 'W', runs: 5, opponentRuns: 4 },
      { result: 'W', runs: 4, opponentRuns: 3 },
      { result: 'L', runs: 2, opponentRuns: 4 },
      { result: 'W', runs: 3, opponentRuns: 1 },
      { result: 'W', runs: 6, opponentRuns: 5 },
      { result: 'L', runs: 2, opponentRuns: 3 }
    ]
  },
  odds: {
    currentLine: -1.5,
    openingLine: -1.0,
    moneyline: -110,
    totalVolume: 1200000,
    averageVolume: 500000,
    homeVolume: 750000,
    awayVolume: 450000,
    publicPercent: 72,
    movements: [
      { timestamp: Date.now() - 3600000, book: 'Pinny', line: -1.0, volume: 100000 },
      { timestamp: Date.now() - 3500000, book: 'Apex', line: -1.1, volume: 95000 },
      { timestamp: Date.now() - 3400000, book: '5Dimes', line: -1.2, volume: 88000 },
      { timestamp: Date.now() - 3000000, book: 'DraftKings', line: -1.3, volume: 300000 },
      { timestamp: Date.now() - 2500000, book: 'FanDuel', line: -1.4, volume: 350000 }
    ],
    bookList: ['Pinny', 'Apex', '5Dimes', 'DraftKings', 'FanDuel']
  }
};

const sampleMLBGameNoSignals = {
  gameId: 'mlb-20260601-002',
  sport: 'MLB',
  date: '2026-06-01T19:10:00Z',
  season: 2026,
  home: {
    name: 'Tampa Bay Rays',
    teamId: 'TB',
    wins: 30,
    losses: 30,
    gamesPlayed: 60,
    runsFor: 260,
    runsAgainst: 260,
    recentGames: Array(10).fill({ result: 'W' })
  },
  away: {
    name: 'Toronto Blue Jays',
    teamId: 'TOR',
    wins: 30,
    losses: 30,
    gamesPlayed: 60,
    runsFor: 260,
    runsAgainst: 260,
    recentGames: Array(10).fill({ result: 'W' })
  },
  odds: {
    currentLine: 0,
    openingLine: 0,
    moneyline: -110,
    totalVolume: 200000,
    averageVolume: 300000,
    homeVolume: 100000,
    awayVolume: 100000,
    publicPercent: 50,
    movements: [],
    bookList: []
  }
};

// ============================================================================
// TEST SUITE
// ============================================================================

class EngineTestSuite {
  constructor() {
    this.router = new EngineRouter();
    this.mlbEngine = new MLBEngine({ confidenceThreshold: 0.65 });
    this.router.registerEngine('MLB', this.mlbEngine);
    this.results = [];
  }

  async runAllTests() {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║         M9 TERMINAL - ENGINE TEST SUITE                   ║
╚═══════════════════════════════════════════════════════════╝
    `);

    await this.testBaseEngineInitialization();
    await this.testEngineRouterRegistration();
    await this.testMLBAnalysis();
    await this.testSignalDetection();
    await this.testPredictions();
    await this.testValueCalculation();
    await this.testCaching();
    await this.testEngineStatus();

    this.printSummary();
  }

  async testBaseEngineInitialization() {
    console.log('📋 Test: BaseEngine Initialization');
    try {
      const engine = new MLBEngine({ confidenceThreshold: 0.70 });
      console.assert(engine.sport === 'MLB', 'Sport should be MLB');
      console.assert(engine.confidenceThreshold === 0.70, 'Confidence threshold should be 0.70');
      console.log('  ✅ Passed\n');
      this.results.push({ test: 'BaseEngine Init', status: 'PASS' });
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      this.results.push({ test: 'BaseEngine Init', status: 'FAIL', error: error.message });
    }
  }

  async testEngineRouterRegistration() {
    console.log('📋 Test: EngineRouter Registration');
    try {
      const router = new EngineRouter();
      const engine = new MLBEngine();
      router.registerEngine('MLB', engine);
      console.assert(router.getSports().includes('MLB'), 'MLB should be registered');
      console.assert(router.getEngine('MLB') === engine, 'Retrieved engine should match');
      console.log('  ✅ Passed\n');
      this.results.push({ test: 'Router Registration', status: 'PASS' });
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      this.results.push({ test: 'Router Registration', status: 'FAIL', error: error.message });
    }
  }

  async testMLBAnalysis() {
    console.log('📋 Test: MLB Game Analysis');
    try {
      const result = await this.router.analyzeGame('MLB', sampleMLBGame);
      console.assert(result.gameId === sampleMLBGame.gameId, 'Game ID should match');
      console.assert(result.homeTeam === 'New York Yankees', 'Home team should be Yankees');
      console.assert(result.awayTeam === 'Boston Red Sox', 'Away team should be Red Sox');
      console.assert(typeof result.confidence === 'number', 'Confidence should be a number');
      console.log(`  ✅ Passed (Confidence: ${result.confidence}%)\n`);
      this.results.push({ test: 'MLB Analysis', status: 'PASS' });
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      this.results.push({ test: 'MLB Analysis', status: 'FAIL', error: error.message });
    }
  }

  async testSignalDetection() {
    console.log('📋 Test: Signal Detection (All 4 Types)');
    try {
      const signals = await this.router.getSignals('MLB', sampleMLBGame);
      console.log(`  Detected ${signals.length} signals:`);
      
      signals.forEach(signal => {
        console.log(`    • ${signal.type} (${signal.confidence}% confidence)`);
      });

      // At least 2 signals should be detected in sample game
      console.assert(signals.length >= 2, `Expected ≥2 signals, got ${signals.length}`);
      
      // Check for signal types
      const types = signals.map(s => s.type);
      console.assert(types.includes('SHARP_MONEY') || types.includes('STEAM'), 
        'Should detect Sharp Money or Steam');

      console.log('  ✅ Passed\n');
      this.results.push({ test: 'Signal Detection', status: 'PASS' });
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      this.results.push({ test: 'Signal Detection', status: 'FAIL', error: error.message });
    }
  }

  async testPredictions() {
    console.log('📋 Test: Game Predictions');
    try {
      const prediction = await this.router.getPrediction('MLB', sampleMLBGame);
      console.assert(prediction.gameId, 'Should have game ID');
      console.assert(['HOME', 'AWAY', 'FLAT'].includes(prediction.predictedSide), 
        'Predicted side should be valid');
      console.assert(typeof prediction.confidence === 'number', 'Confidence should be number');
      console.log(`  Prediction: ${prediction.predictedSide} (${prediction.confidence}% confidence)`);
      console.log(`  Recommendation: ${prediction.recommendation}`);
      console.log('  ✅ Passed\n');
      this.results.push({ test: 'Predictions', status: 'PASS' });
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      this.results.push({ test: 'Predictions', status: 'FAIL', error: error.message });
    }
  }

  async testValueCalculation() {
    console.log('📋 Test: Value Calculation');
    try {
      const prediction = await this.router.getPrediction('MLB', sampleMLBGame);
      const value = await this.mlbEngine.calculateValue(sampleMLBGame.odds, prediction);
      console.assert(typeof value.expectedValue === 'string', 'Should have value type');
      console.assert(value.impliedProbability > 0 && value.impliedProbability <= 100, 
        'Implied probability should be valid');
      console.log(`  Implied Prob: ${value.impliedProbability}%`);
      console.log(`  True Prob: ${value.trueProbability}%`);
      console.log(`  Edge: ${value.valueEdge}%`);
      console.log(`  Recommendation: ${value.recommendation}`);
      console.log('  ✅ Passed\n');
      this.results.push({ test: 'Value Calculation', status: 'PASS' });
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      this.results.push({ test: 'Value Calculation', status: 'FAIL', error: error.message });
    }
  }

  async testCaching() {
    console.log('📋 Test: Result Caching');
    try {
      const startTime = Date.now();
      await this.router.analyzeGame('MLB', sampleMLBGame);
      const firstTime = Date.now() - startTime;

      const startTime2 = Date.now();
      const cached = await this.router.analyzeGame('MLB', sampleMLBGame);
      const secondTime = Date.now() - startTime2;

      console.assert(cached.fromCache === true, 'Second call should use cache');
      console.assert(secondTime < firstTime, 'Cached call should be faster');
      console.log(`  First call: ${firstTime}ms`);
      console.log(`  Cached call: ${secondTime}ms`);
      console.log('  ✅ Passed\n');
      this.results.push({ test: 'Caching', status: 'PASS' });
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      this.results.push({ test: 'Caching', status: 'FAIL', error: error.message });
    }
  }

  async testEngineStatus() {
    console.log('📋 Test: Engine Status Reporting');
    try {
      const status = this.router.getEngineStatus('MLB');
      console.assert(status.sport === 'MLB', 'Sport should be MLB');
      console.assert(status.engineStatus, 'Should have engine status');
      console.assert(status.performance, 'Should have performance metrics');
      console.log(`  Status: ${status.engineStatus.sport}`);
      console.log(`  Signals: ${status.engineStatus.signaturesGenerated}`);
      console.log(`  Average Confidence: ${status.engineStatus.averageConfidence}%`);
      console.log('  ✅ Passed\n');
      this.results.push({ test: 'Engine Status', status: 'PASS' });
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      this.results.push({ test: 'Engine Status', status: 'FAIL', error: error.message });
    }
  }

  printSummary() {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    TEST SUMMARY                           ║
╚═══════════════════════════════════════════════════════════╝
  Total: ${total}
  ✅ Passed: ${passed}
  ❌ Failed: ${failed}
  Success Rate: ${Math.round((passed / total) * 100)}%

Status: ${failed === 0 ? '🎉 ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED'}
    `);

    if (failed > 0) {
      console.log('Failed tests:');
      this.results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`  • ${r.test}: ${r.error}`);
      });
    }
  }
}

// ============================================================================
// RUN TESTS
// ============================================================================

if (require.main === module) {
  const suite = new EngineTestSuite();
  suite.runAllTests().catch(console.error);
}

module.exports = EngineTestSuite;
