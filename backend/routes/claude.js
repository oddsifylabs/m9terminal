/**
 * M9 Terminal - Claude Chat API Route
 * Backend proxy for Claude API calls
 * Handles game analysis and strategy questions via Claude
 */

const express = require('express');
const router = express.Router();

/**
 * POST /api/claude-chat
 * Proxy request to Claude API with game/betting context
 */
router.post('/claude-chat', async (req, res) => {
  const { message, context } = req.body;
  
  // Get API key from environment
  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.json({
      error: 'Claude API not configured on server',
      response: 'I\'m not available right now. Please try again later.'
    });
  }

  // Build context string from current games/bets
  let contextString = '';
  if (context && context.currentBets && context.currentBets.length > 0) {
    contextString += '\nCurrent bets: ' + 
      context.currentBets.map(b => 
        `${b.sport} ${b.matchup} - ${b.bet} (${b.confidence}% confidence, ${b.signal})`
      ).join('; ');
  }
  if (context && context.games && context.games.length > 0) {
    contextString += '\nToday\'s top games: ' +
      context.games.map(g =>
        `${g.sport}: ${g.away} @ ${g.home} (${g.confidence}% confidence, ${g.signals} signals)`
      ).join('; ');
  }

  // System prompt for Claude
  const systemPrompt = `You are a sports betting analyst assistant for M9 Terminal. You help users:
1. Understand betting signals (Sharp Money, Steam, Line Value, Volume Anomaly)
2. Analyze game matchups and odds
3. Discuss betting strategy and risk management
4. Interpret market movements and line changes

Be concise (2-3 sentences), use specific data from the context provided, and always cite the signals or games you reference.
Never recommend specific bet amounts or guarantee outcomes. Focus on explaining the data and patterns you see.`;

  // Build Claude message
  const userPrompt = `${message}${contextString ? '\n\nContext: ' + contextString : ''}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1',
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    const data = await response.json();

    // Handle API errors
    if (!response.ok || data.error) {
      console.error('Claude API error:', data.error);
      return res.json({
        error: data.error?.message || 'API error',
        response: 'Sorry, I had trouble analyzing that. Try asking about specific games or signals.'
      });
    }

    // Extract text from response
    const claudeResponse = data.content[0]?.text || '';

    res.json({
      response: claudeResponse,
      error: null
    });

  } catch (error) {
    console.error('Claude API request error:', error.message);
    res.json({
      error: error.message,
      response: 'Connection error. Please check your internet and try again.'
    });
  }
});

/**
 * POST /api/analyze-game
 * Get Claude's analysis of a specific game
 */
router.post('/analyze-game', async (req, res) => {
  const { sport, game } = req.body;
  
  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.json({
      error: 'Claude API not configured',
      analysis: ''
    });
  }

  // Build game analysis prompt
  const gamePrompt = `Analyze this ${sport} matchup in 2-3 sentences focusing on market signals:

${game.away} vs ${game.home}
Time: ${game.time}
Current line: ${game.homeOdds}/${game.awayOdds}
Signals detected: ${game.signals}
Confidence: ${game.confidence}%

Focus on: What do the market odds and volume patterns tell us about this matchup? Any sharp action or steam?`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1',
        max_tokens: 250,
        messages: [{ role: 'user', content: gamePrompt }]
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.json({
        error: data.error?.message || 'Analysis failed',
        analysis: ''
      });
    }

    res.json({
      analysis: data.content[0]?.text || '',
      error: null
    });

  } catch (error) {
    res.json({
      error: error.message,
      analysis: ''
    });
  }
});

/**
 * GET /api/claude-config
 * Check if Claude is configured (for UI visibility)
 */
router.get('/claude-config', (req, res) => {
  const configured = !!(process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY);
  res.json({
    configured,
    message: configured 
      ? 'Claude is ready to chat!'
      : 'Claude API not configured'
  });
});

module.exports = router;
