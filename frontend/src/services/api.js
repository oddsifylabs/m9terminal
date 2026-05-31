/**
 * M9 Terminal API Integration Service
 * Connects frontend to backend live data pipeline
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export class M9TerminalAPI {
  /**
   * Fetch today's live signals
   * Returns: { success, signals[], timestamp, dataQuality }
   */
  static async getLiveSignals() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mlb/analyze-today`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile: 'ACTIVE',
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (!response.ok) {
        console.error('API error:', response.status);
        return { success: false, signals: [], error: 'Failed to fetch signals' };
      }

      const data = await response.json();
      return {
        success: data.success,
        signals: data.games || [],
        timestamp: new Date(),
        dataQuality: 'LIVE',
        gamesAnalyzed: data.gamesAnalyzed,
        summary: data.summary,
        dataSources: data.dataSources
      };
    } catch (error) {
      console.error('Signal fetch error:', error);
      return { success: false, signals: [], error: error.message };
    }
  }

  /**
   * Run integration test
   * Verifies all APIs are working
   */
  static async runIntegrationTest() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mlb/integration-test`, {
        method: 'GET'
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Integration test error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Analyze specific game with Claude AI
   */
  static async analyzeGame(gameId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mlb/analyze-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Game analysis error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get health check
   */
  static async getHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check error:', error);
      return { status: 'error', error: error.message };
    }
  }
}

export default M9TerminalAPI;
