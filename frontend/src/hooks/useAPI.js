import { useState, useEffect } from 'react';
import M9TerminalAPI from '../services/api';

/**
 * Hook: useLiveSignals
 * Fetches live signals from the backend
 */
export const useLiveSignals = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataQuality, setDataQuality] = useState('LOADING');

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await M9TerminalAPI.getLiveSignals();
      
      if (result.success) {
        setSignals(result.signals);
        setDataQuality(result.dataQuality);
      } else {
        setError(result.error);
        setDataQuality('ERROR');
      }
    } catch (err) {
      setError(err.message);
      setDataQuality('ERROR');
    } finally {
      setLoading(false);
    }
  };

  return {
    signals,
    loading,
    error,
    dataQuality,
    refetch: fetchSignals
  };
};

/**
 * Hook: useIntegrationTest
 * Runs backend integration test to verify all APIs are working
 */
export const useIntegrationTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await M9TerminalAPI.runIntegrationTest();
      setTestResults(result);
      return result;
    } catch (err) {
      console.error('Test error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    testResults,
    loading,
    runTest
  };
};

/**
 * Hook: useGameAnalysis
 * Analyzes a specific game with Claude AI
 */
export const useGameAnalysis = (gameId) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!gameId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await M9TerminalAPI.analyzeGame(gameId);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    analysis,
    loading,
    error,
    analyze
  };
};

export default {
  useLiveSignals,
  useIntegrationTest,
  useGameAnalysis
};
