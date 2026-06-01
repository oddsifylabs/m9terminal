import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';

const DailyDebrief = ({ setActiveMenu }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Hey! I\'m Claude, your AI betting analyst. I\'ve reviewed today\'s matchups and I\'m ready to break down the key signals, betting trends, and sharp money movements. What would you like to focus on?'
    },
    {
      id: 2,
      role: 'assistant',
      text: `**Today's Sharp Analysis Summary:**

🏈 **Kansas City vs LA Chargers (NFL)**
- Sharp money heavily backing KC at -3
- Smart bets shifted line from -2.5 → -3, indicating confidence
- Weather favorable for passing game
- Prediction: KC likely to cover

⚾ **New York vs Boston (MLB)**
- Boston winds blowing out strong (12+ mph) 
- Typically suppresses fly balls, favors under plays
- Yankees offense performing well in last 5 games
- Injury: Juan Soto questionable (left hamstring)
- Action: Strong under interest detected

🏀 **LA Lakers vs Golden State (NBA)**
- Lakers missing Anthony Davis (lower back strain) - VERY HIGH impact
- Warriors have favorable matchup without AD defense
- Sharp action on Warriors -5.5
- Prediction: GSW likely to push past 5.5 spread`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      role: 'user',
      text: userMessage
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsLoading(true);

    // Simulate Claude response with betting insights
    setTimeout(() => {
      const responses = [
        `Great question! Based on the data I'm seeing:

**Key Factors to Consider:**
- Sharp money movement is up 34% compared to last week
- Injury reports have major impact on 3 of today's matchups
- Weather conditions favor specific betting trends
- Line movement shows smart money is heavily backing specific sides

**Recommendation:** Focus on the underdogs where sharp money is flowing. The market hasn't fully adjusted yet.`,
        
        `Let me break down the signal flow for you:

**STEAM Signal (Sharp Money Sync):**
- When public and sharp money move in same direction, odds of cover ↑ 67%
- Currently seeing STEAM on KC -3, BOS under 8.5, GSW -5.5

**Line Value Signal:**
- Games where opening line vs closing line differ by 0.5+ are 58% winners for the favored side
- Lakers spread shifted 1.5 points due to AD injury update

**Recommendation:** Track these STEAM signals closely. They're the most reliable predictors of game outcomes.`,

        `Excellent observation! Here's what the data shows:

**Weather Impact Analysis:**
- Fenway Park winds at 12 mph typically reduce game totals by 1-2 runs
- Yankee Stadium humidity at 62% is neutral (optimal range 50-65%)
- NFL games in Kansas City: wind at 5 mph favors passing over rushing

**Player-Specific Weather Impact:**
- Juan Soto (hamstring) may have reduced range in outfield
- Cold weather increases injury risk for questionable players
- Anthony Davis' absence magnifies defensive pressure

**Sharp Action:**
- Professional bettors heavily under-playing Boston game due to wind conditions
- This is a key signal - follow the sharp money on weather-sensitive games`,

        `That's the critical insight right there! Let me explain:

**Confidence Score Methodology:**
- Combines: Sharp money %, Line movement %, Historical trend %, Injury impact %
- Games scoring 80%+ confidence typically hit 63% of the time

**Today's 80%+ Confidence Picks:**
1. **KC -3** (82% confidence) - Sharp money, line movement, favorable weather
2. **BOS Under 8.5** (85% confidence) - Wind factor, line movement, public contrarian
3. **GSW -5.5** (79% confidence) - AD injury, sharp action, matchup advantage

**The Data Never Lies:** When confidence hits 85%+, we're looking at 71% historical win rate. That's significantly above the 52.4% break-even point for -110 odds.

Would you like me to dig deeper into any of these?`
      ];

      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        text: responses[Math.floor(Math.random() * responses.length)]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div style={{ flex: 1, background: '#0a0a0a', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <Header setActiveMenu={setActiveMenu} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {/* Chat Header */}
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #2a2a2a', background: '#0a0a0a' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
            📊 Daily Debrief with Claude
          </h1>
          <p style={{ fontSize: '14px', color: '#888', margin: '0' }}>
            AI-powered betting analysis & market insights
          </p>
        </div>

        {/* Messages Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          {messages.map((message) => (
            <div key={message.id} style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              gap: '0.75rem'
            }}>
              {message.role === 'assistant' && (
                <div style={{ fontSize: '24px', minWidth: '32px', display: 'flex', alignItems: 'flex-start' }}>
                  🤖
                </div>
              )}
              
              <div style={{
                maxWidth: '70%',
                background: message.role === 'user' ? '#8FDC23' : '#1a1a1a',
                color: message.role === 'user' ? '#000000' : '#ffffff',
                padding: '1rem',
                borderRadius: '10px',
                border: message.role === 'assistant' ? '1px solid #2a2a2a' : 'none',
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {/* Parse markdown-like formatting */}
                {message.text.split('\n').map((line, idx) => {
                  if (line.includes('**')) {
                    return (
                      <p key={idx} style={{ margin: '0.5rem 0', fontWeight: '600' }}>
                        {line.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  if (line.startsWith('-') || line.startsWith('•')) {
                    return (
                      <p key={idx} style={{ margin: '0.25rem 0 0.25rem 1rem' }}>
                        {line.substring(1)}
                      </p>
                    );
                  }
                  if (line.match(/^\d+\./)) {
                    return (
                      <p key={idx} style={{ margin: '0.5rem 0 0.25rem 1rem', fontWeight: '500' }}>
                        {line}
                      </p>
                    );
                  }
                  return (
                    <p key={idx} style={{ margin: '0.25rem 0' }}>
                      {line}
                    </p>
                  );
                })}
              </div>

              {message.role === 'user' && (
                <div style={{ fontSize: '24px', minWidth: '32px', display: 'flex', alignItems: 'flex-start' }}>
                  👤
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '24px', minWidth: '32px' }}>🤖</div>
              <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '10px', border: '1px solid #2a2a2a' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8FDC23', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8FDC23', animation: 'pulse 1.5s infinite 0.2s' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8FDC23', animation: 'pulse 1.5s infinite 0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid #2a2a2a', background: '#0a0a0a' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask Claude about today's games, signals, or betting strategy..."
              style={{
                flex: 1,
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8FDC23';
                e.target.style.background = '#252525';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2a2a2a';
                e.target.style.background = '#1a1a1a';
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userMessage.trim()}
              style={{
                background: userMessage.trim() ? '#8FDC23' : '#333',
                color: userMessage.trim() ? '#000000' : '#666',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                cursor: userMessage.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (userMessage.trim()) {
                  e.target.style.background = '#a3e035';
                }
              }}
              onMouseLeave={(e) => {
                if (userMessage.trim()) {
                  e.target.style.background = '#8FDC23';
                }
              }}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
      </main>
    </div>
  );
};

export default DailyDebrief;
