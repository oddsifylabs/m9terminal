/**
 * Bet Placement Service
 * Manages bet creation, tracking, and state
 */

const fs = require('fs');
const path = require('path');

// In-memory bet storage (would use database in production)
const bets = [];
let betIdCounter = 1000;

class BetPlacementService {
  /**
   * Place a new bet
   */
  static placeBet(betData) {
    const bet = {
      betId: `BET_${betIdCounter++}`,
      ...betData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      result: null,
      payout: null,
    };

    bets.push(bet);
    this.saveBets();
    
    return {
      success: true,
      bet,
      message: `Bet placed for ${betData.teams} - ${betData.betType}`,
    };
  }

  /**
   * Get all bets
   */
  static getAllBets() {
    return bets;
  }

  /**
   * Get bets by status
   */
  static getBetsByStatus(status) {
    return bets.filter(b => b.status === status);
  }

  /**
   * Update bet status (PENDING, WON, LOST, PUSH, CANCELLED)
   */
  static updateBetStatus(betId, status, result = null, payout = 0) {
    const bet = bets.find(b => b.betId === betId);
    
    if (!bet) {
      return { success: false, message: `Bet ${betId} not found` };
    }

    bet.status = status;
    bet.result = result;
    bet.payout = payout;
    bet.updatedAt = new Date().toISOString();
    
    this.saveBets();

    return {
      success: true,
      bet,
      message: `Bet ${betId} updated to ${status}`,
    };
  }

  /**
   * Calculate bet statistics
   */
  static getStats() {
    const won = bets.filter(b => b.status === 'WON');
    const lost = bets.filter(b => b.status === 'LOST');
    const pending = bets.filter(b => b.status === 'PENDING');

    const totalWagered = bets.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalWon = won.reduce((sum, b) => sum + (b.payout || 0), 0);
    const totalLost = lost.reduce((sum, b) => sum + (b.amount || 0), 0);
    const netProfit = totalWon - totalLost;
    const roi = totalWagered > 0 ? ((netProfit / totalWagered) * 100).toFixed(2) : 0;
    const winRate = bets.length > 0 ? ((won.length / (won.length + lost.length)) * 100).toFixed(1) : 0;

    return {
      totalBets: bets.length,
      pendingBets: pending.length,
      wonBets: won.length,
      lostBets: lost.length,
      totalWagered,
      totalWon,
      totalLost,
      netProfit,
      roi: parseFloat(roi),
      winRate: parseFloat(winRate),
      averageBetSize: bets.length > 0 ? (totalWagered / bets.length).toFixed(2) : 0,
    };
  }

  /**
   * Get bet history (paginated)
   */
  static getBetHistory(page = 1, limit = 10) {
    const sortedBets = bets.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      bets: sortedBets.slice(start, end),
      pagination: {
        page,
        limit,
        total: bets.length,
        pages: Math.ceil(bets.length / limit),
      },
    };
  }

  /**
   * Validate bet before placement
   */
  static validateBet(betData) {
    const errors = [];

    if (!betData.gameId) errors.push('Game ID required');
    if (!betData.betType) errors.push('Bet type required (MONEYLINE, SPREAD, TOTAL)');
    if (!betData.amount || betData.amount <= 0) errors.push('Bet amount must be > 0');
    if (!betData.odds) errors.push('Odds required');
    if (!betData.teams) errors.push('Teams required');

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate potential payout
   */
  static calculatePayout(amount, odds) {
    if (odds >= 0) {
      // Positive odds: (bet * odds) / 100 + bet
      return (amount * odds) / 100 + amount;
    } else {
      // Negative odds: bet * (100 / Math.abs(odds)) + bet
      return amount * (100 / Math.abs(odds)) + amount;
    }
  }

  /**
   * Export bets to JSON file
   */
  static exportBets() {
    return {
      exportDate: new Date().toISOString(),
      bets,
      stats: this.getStats(),
    };
  }

  /**
   * Save bets to temporary storage
   */
  static saveBets() {
    // In production, this would save to database
    // For now, just keep in memory during session
  }

  /**
   * Clear all bets (testing only)
   */
  static clearBets() {
    bets.length = 0;
    betIdCounter = 1000;
    this.saveBets();
  }
}

module.exports = BetPlacementService;
