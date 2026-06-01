import React, { useState, useEffect } from 'react';

/**
 * Bet Placement Modal
 * Allows users to place bets directly from Markets page
 */

const BetPlacementModal = ({ game, isOpen, onClose, onBetPlaced }) => {
  const [betType, setBetType] = useState('MONEYLINE');
  const [amount, setAmount] = useState('');
  const [selectedSide, setSelectedSide] = useState('away');
  const [selectedOdds, setSelectedOdds] = useState(null);
  const [potentialPayout, setPotentialPayout] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !game) return null;

  // Get available odds for bet type
  const getAvailableOdds = () => {
    if (!game.bookOdds) return [];
    
    const oddsMap = {};
    Object.entries(game.bookOdds).forEach(([book, odds]) => {
      if (betType === 'MONEYLINE') {
        oddsMap[book] = odds.moneyline;
      } else if (betType === 'SPREAD') {
        oddsMap[book] = `${odds.spread} @ ${odds.spreadOdds}`;
      } else if (betType === 'TOTAL') {
        oddsMap[book] = `O/U ${odds.total}`;
      }
    });
    
    return Object.entries(oddsMap);
  };

  // Calculate payout
  useEffect(() => {
    if (amount && selectedOdds) {
      const odds = typeof selectedOdds === 'string' 
        ? parseInt(selectedOdds.split('@')[0])
        : selectedOdds;
      
      const payout = calculatePayout(parseFloat(amount), odds);
      setPotentialPayout(payout);
    } else {
      setPotentialPayout(0);
    }
  }, [amount, selectedOdds]);

  const calculatePayout = (betAmount, odds) => {
    if (odds >= 0) {
      return (betAmount * odds) / 100 + betAmount;
    } else {
      return betAmount * (100 / Math.abs(odds)) + betAmount;
    }
  };

  const handlePlaceBet = async () => {
    setError(null);
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid bet amount');
      return;
    }

    if (!selectedOdds) {
      setError('Please select odds');
      return;
    }

    setLoading(true);

    try {
      const betData = {
        gameId: game.gameId,
        teams: game.teams,
        betType,
        side: selectedSide,
        amount: parseFloat(amount),
        odds: selectedOdds,
        book: getAvailableOdds().find(([_, o]) => o === selectedOdds)?.[0],
        potentialPayout: potentialPayout.toFixed(2),
      };

      // TODO: Send to backend API
      console.log('Placing bet:', betData);

      // Simulate success
      setTimeout(() => {
        if (onBetPlaced) {
          onBetPlaced(betData);
        }
        setLoading(false);
        onClose();
      }, 500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const availableOdds = getAvailableOdds();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#0a0a0a',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Place Bet</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#808080',
              fontSize: '24px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Game Info */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #2a2a2a' }}>
          <p style={{ fontSize: '14px', color: '#8FDC23', margin: '0 0 0.5rem 0', fontWeight: '700' }}>
            {game.teams}
          </p>
          <p style={{ fontSize: '12px', color: '#808080', margin: 0 }}>
            {game.stadium} • {game.weather}
          </p>
        </div>

        {/* Bet Type Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#8FDC23', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem' }}>
            Bet Type
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {['MONEYLINE', 'SPREAD', 'TOTAL'].map(type => (
              <button
                key={type}
                onClick={() => setBetType(type)}
                style={{
                  padding: '0.75rem',
                  background: betType === type ? '#8FDC23' : '#1a1a1a',
                  border: `1px solid ${betType === type ? '#8FDC23' : '#2a2a2a'}`,
                  color: betType === type ? '#000000' : '#ffffff',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Side Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#8FDC23', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem' }}>
            Pick
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={() => setSelectedSide('away')}
              style={{
                padding: '0.75rem',
                background: selectedSide === 'away' ? '#8FDC23' : '#1a1a1a',
                border: `1px solid ${selectedSide === 'away' ? '#8FDC23' : '#2a2a2a'}`,
                color: selectedSide === 'away' ? '#000000' : '#ffffff',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              ↑ {game.awayTeam}
            </button>
            <button
              onClick={() => setSelectedSide('home')}
              style={{
                padding: '0.75rem',
                background: selectedSide === 'home' ? '#8FDC23' : '#1a1a1a',
                border: `1px solid ${selectedSide === 'home' ? '#8FDC23' : '#2a2a2a'}`,
                color: selectedSide === 'home' ? '#000000' : '#ffffff',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              ↓ {game.homeTeam}
            </button>
          </div>
        </div>

        {/* Odds Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#8FDC23', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem' }}>
            Select Odds
          </label>
          <select
            value={selectedOdds || ''}
            onChange={(e) => setSelectedOdds(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            <option value="">Choose a sportsbook...</option>
            {availableOdds.map(([book, odds]) => (
              <option key={book} value={odds}>
                {book}: {typeof odds === 'string' ? odds : `${odds > 0 ? '+' : ''}${odds}`}
              </option>
            ))}
          </select>
        </div>

        {/* Bet Amount */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#8FDC23', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem' }}>
            Amount ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter bet amount"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Potential Payout */}
        {potentialPayout > 0 && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1a1a1a', borderRadius: '6px', border: '1px solid #2a2a2a' }}>
            <p style={{ fontSize: '11px', color: '#808080', margin: '0 0 0.5rem 0' }}>
              Potential Payout
            </p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#8FDC23', margin: 0 }}>
              ${potentialPayout.toFixed(2)}
            </p>
            <p style={{ fontSize: '11px', color: '#606060', margin: '0.5rem 0 0 0' }}>
              Profit: ${(potentialPayout - parseFloat(amount || 0)).toFixed(2)}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#2a1a1a', border: '1px solid #8b4545', borderRadius: '6px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#ff6b6b' }}>
              {error}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              color: '#ffffff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceBet}
            disabled={loading || !amount || !selectedOdds}
            style={{
              padding: '0.75rem',
              background: loading || !amount || !selectedOdds ? '#8FDC23' : '#8FDC23',
              border: 'none',
              color: '#000000',
              borderRadius: '6px',
              cursor: loading || !amount || !selectedOdds ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              opacity: loading || !amount || !selectedOdds ? 0.5 : 1,
            }}
          >
            {loading ? 'Placing...' : 'Place Bet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetPlacementModal;
