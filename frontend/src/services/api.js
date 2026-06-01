/**
 * M9 Terminal API Service
 * Handles all API calls to backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3009/api';

class M9TerminalAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Analyze today's games with real data
   * @param {string} profile - SHARP, ACTIVE, or RESEARCH
   * @returns {Promise} Games with real odds, signals, and analysis
   */
  async analyzeTodayGames(profile = 'SHARP') {
    try {
      const response = await fetch(`${this.baseURL}/mlb/today?profile=${profile}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing games:', error);
      return {
        success: false,
        error: error.message,
        games: [],
      };
    }
  }

  /**
   * Get current odds for a specific game
   * @param {string} gameId - SportsData game ID
   * @returns {Promise} Odds from all sportsbooks
   */
  async getGameOdds(gameId) {
    try {
      const response = await fetch(`${this.baseURL}/odds/game/${gameId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching odds:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get sharp action signals
   * @returns {Promise} Recent sharp action signals
   */
  async getSharpAction() {
    try {
      const response = await fetch(`${this.baseURL}/signals/sharp-action`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching sharp action:', error);
      return { success: false, error: error.message, signals: [] };
    }
  }

  /**
   * Get game analysis from Claude
   * @param {string} gameId - Game ID
   * @returns {Promise} AI-powered game analysis
   */
  async analyzeGame(gameId) {
    try {
      const response = await fetch(`${this.baseURL}/analyze-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing game:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get odds movement/line changes
   * @param {string} gameId - Game ID
   * @returns {Promise} Odds movement history
   */
  async getOddsMovement(gameId) {
    try {
      const response = await fetch(`${this.baseURL}/odds/movement/${gameId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching odds movement:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get health status of API
   * @returns {Promise} API health status
   */
  async health() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const api = new M9TerminalAPI();
export default M9TerminalAPI;
