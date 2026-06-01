/**
 * Sharp Action Detection Algorithm
 * Identifies movement and intelligent betting patterns
 */

class SharpActionDetector {
  /**
   * Detect sharp action based on:
   * 1. Line movement (money flowing to one side)
   * 2. Closing line value (CLV - bet timing advantage)
   * 3. Consensus vs market disagreement
   * 4. Sharp profiles (SHARP, ACTIVE, RESEARCH)
   */
  static detectSignals(games, profile = 'SHARP') {
    const signals = [];

    games.forEach(game => {
      if (!game.bookOdds) return;

      // Detect line movement
      const movementSignal = this.detectLineMovement(game);
      if (movementSignal) {
        signals.push(movementSignal);
      }

      // Detect consensus vs market disagreement
      const disagreementSignal = this.detectConsensusDisagreement(game);
      if (disagreementSignal && profile === 'SHARP') {
        signals.push(disagreementSignal);
      }

      // Detect value opportunities
      const valueSignal = this.detectValue(game);
      if (valueSignal) {
        signals.push(valueSignal);
      }

      // Detect steam/steam chasing
      const steamSignal = this.detectSteam(game);
      if (steamSignal && profile !== 'RESEARCH') {
        signals.push(steamSignal);
      }
    });

    // Sort by strength (confidence score)
    return signals.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Detect line movement - when odds shift significantly
   */
  static detectLineMovement(game) {
    if (!game.bookOdds || Object.keys(game.bookOdds).length < 2) {
      return null;
    }

    const spreads = Object.values(game.bookOdds)
      .map(b => b.spread)
      .filter(s => s !== undefined);

    if (spreads.length < 2) return null;

    const minSpread = Math.min(...spreads);
    const maxSpread = Math.max(...spreads);
    const movement = Math.abs(maxSpread - minSpread);

    // Significant movement if > 0.5 points
    if (movement >= 0.5) {
      const direction = spreads[0] > spreads[spreads.length - 1] ? 'DOWN' : 'UP';
      
      return {
        gameId: game.gameId,
        teams: game.teams,
        type: 'LINE_MOVEMENT',
        description: `${game.teams} spread moved ${direction} ${movement.toFixed(1)} points`,
        direction,
        movement,
        confidence: Math.min(0.9, 0.6 + movement * 0.1),
        actionTime: new Date().toLocaleTimeString(),
      };
    }

    return null;
  }

  /**
   * Detect when public consensus disagrees with sharp markets
   */
  static detectConsensusDisagreement(game) {
    if (!game.bookOdds) return null;

    // Mock consensus data (would come from Covers.com or similar)
    const publicConsensus = {
      spread: -2.5,
      percentage: 65, // 65% on one side
    };

    const avgSharpSpread = this.calculateAverageSpread(game);

    // If public consensus differs from sharp average by > 1 point
    if (Math.abs(publicConsensus.spread - avgSharpSpread) > 1) {
      return {
        gameId: game.gameId,
        teams: game.teams,
        type: 'SHARP_VS_PUBLIC',
        description: `Sharp money disagrees with public consensus by ${Math.abs(publicConsensus.spread - avgSharpSpread).toFixed(1)} points`,
        publicSide: publicConsensus.percentage > 50 ? 'FAVORITE' : 'UNDERDOG',
        publicPercentage: publicConsensus.percentage,
        sharpAverage: avgSharpSpread,
        confidence: 0.85,
        actionTime: new Date().toLocaleTimeString(),
      };
    }

    return null;
  }

  /**
   * Detect value opportunities - when odds offer better value than expected
   */
  static detectValue(game) {
    if (!game.bookOdds) return null;

    const moneylines = Object.values(game.bookOdds)
      .map(b => b.moneyline)
      .filter(m => m !== undefined);

    if (moneylines.length < 2) return null;

    const bestOdds = Math.max(...moneylines);
    const worstOdds = Math.min(...moneylines);

    // If there's > 20 cent difference in ML odds, there's value
    const diff = bestOdds - worstOdds;
    
    if (diff > 20) {
      return {
        gameId: game.gameId,
        teams: game.teams,
        type: 'VALUE_OPPORTUNITY',
        description: `${diff} cent value gap detected on moneyline (${bestOdds > 0 ? '+' : ''}${bestOdds} vs ${worstOdds > 0 ? '+' : ''}${worstOdds})`,
        valueGap: diff,
        bestOdds,
        confidence: Math.min(0.88, 0.5 + diff * 0.01),
        actionTime: new Date().toLocaleTimeString(),
      };
    }

    return null;
  }

  /**
   * Detect steam - rapid line movement in one direction
   */
  static detectSteam(game) {
    if (!game.bookOdds) return null;

    // Mock steam detection (would track real-time line changes)
    const recentMovement = Math.random() * 2; // Simulated movement in last 5 min

    if (recentMovement > 1.5) {
      return {
        gameId: game.gameId,
        teams: game.teams,
        type: 'STEAM',
        description: `Rapid ${recentMovement > 2 ? 'HEAVY' : 'MODERATE'} action detected - line moving quickly`,
        severity: recentMovement > 2 ? 'HIGH' : 'MEDIUM',
        confidence: 0.75,
        actionTime: new Date().toLocaleTimeString(),
      };
    }

    return null;
  }

  /**
   * Calculate average spread across sportsbooks
   */
  static calculateAverageSpread(game) {
    if (!game.bookOdds) return 0;

    const spreads = Object.values(game.bookOdds)
      .map(b => b.spread)
      .filter(s => s !== undefined);

    if (spreads.length === 0) return 0;

    return spreads.reduce((a, b) => a + b, 0) / spreads.length;
  }

  /**
   * Get signals by profile (SHARP, ACTIVE, RESEARCH)
   * SHARP = high confidence only
   * ACTIVE = medium-high confidence
   * RESEARCH = all signals including low confidence
   */
  static filterByProfile(signals, profile = 'SHARP') {
    if (profile === 'SHARP') {
      return signals.filter(s => s.confidence >= 0.80);
    } else if (profile === 'ACTIVE') {
      return signals.filter(s => s.confidence >= 0.65);
    } else {
      // RESEARCH - all signals
      return signals;
    }
  }
}

module.exports = SharpActionDetector;
