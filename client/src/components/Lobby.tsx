import React, { useState } from 'react';
import { Player, PLAYER_TOKENS } from '../types/game';

interface Props {
  roomId: string | null;
  players: Player[];
  myId: string;
  isHost: boolean;
  onCreateRoom: (name: string, token: string) => void;
  onJoinRoom: (roomId: string, name: string, token: string) => void;
  onStartGame: () => void;
  onOpenSettings: () => void;
  error: string | null;
}

export default function Lobby({
  roomId, players, myId, isHost,
  onCreateRoom, onJoinRoom, onStartGame, onOpenSettings, error
}: Props) {
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [selectedToken, setSelectedToken] = useState(PLAYER_TOKENS[0].emoji);
  const [mode, setMode] = useState<'home' | 'create' | 'join'>('home');

  const usedTokens = players.map((p) => p.token);

  if (roomId) {
    // Waiting room
    return (
      <div className="lobby">
        <div className="lobby-header">
          <div className="lobby-logo">🕌</div>
          <h1>Monopoly al-Sharq</h1>
          <div className="lobby-arabic">منوبولي الشرق</div>
        </div>

        <div className="room-info">
          <div className="room-code-label">Room Code</div>
          <div className="room-code">{roomId}</div>
          <div className="room-code-hint">Share this code with friends</div>
        </div>

        <div className="players-list">
          <h3>Players ({players.length}/6)</h3>
          {players.map((p) => (
            <div key={p.id} className={`player-list-item ${p.id === myId ? 'player-list-item--me' : ''}`} style={{ borderColor: p.color }}>
              <span className="player-list-token">{p.token}</span>
              <span className="player-list-name">{p.name}</span>
              <div className="player-list-badges">
                {p.id === myId && <span className="badge badge-you">You</span>}
                {p.isHost && <span className="badge badge-host">Host</span>}
                {p.disconnected && <span className="badge badge-disconnected">Away</span>}
              </div>
            </div>
          ))}
          {players.length < 6 && (
            <div className="player-list-waiting">
              <span>Waiting for more players...</span>
              <span className="waiting-dots">...</span>
            </div>
          )}
        </div>

        <div className="lobby-actions">
          <button className="btn btn-secondary" onClick={onOpenSettings}>
            ⚙️ Settings
          </button>
          {isHost && (
            <button
              className="btn btn-primary btn-large"
              onClick={onStartGame}
              disabled={players.length < 2}
              title={players.length < 2 ? 'Need at least 2 players' : ''}
            >
              🎮 Start Game
              {players.length < 2 && <span className="btn-hint">Need 2+ players</span>}
            </button>
          )}
          {!isHost && (
            <div className="waiting-host">Waiting for host to start the game...</div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  // Home / Create / Join screens
  return (
    <div className="lobby lobby--home">
      <div className="lobby-hero">
        <div className="lobby-hero-icon">🕌</div>
        <h1 className="lobby-title">MONOPOLY</h1>
        <div className="lobby-subtitle">al-Sharq</div>
        <div className="lobby-arabic">منوبولي الشرق</div>
        <p className="lobby-tagline">The Middle East Edition</p>
      </div>

      {mode === 'home' && (
        <div className="lobby-home-buttons">
          <button className="btn btn-primary btn-xlarge" onClick={() => setMode('create')}>
            🏗️ Create Game
          </button>
          <button className="btn btn-secondary btn-xlarge" onClick={() => setMode('join')}>
            🚪 Join Game
          </button>
        </div>
      )}

      {mode === 'create' && (
        <div className="lobby-form">
          <h2>Create New Game</h2>

          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>Choose Your Token</label>
            <div className="token-grid">
              {PLAYER_TOKENS.map((t) => (
                <button
                  key={t.id}
                  className={`token-btn ${selectedToken === t.emoji ? 'token-btn--selected' : ''}`}
                  onClick={() => setSelectedToken(t.emoji)}
                  title={t.name}
                >
                  <span className="token-emoji">{t.emoji}</span>
                  <span className="token-name">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setMode('home')}>Back</button>
            <button
              className="btn btn-primary"
              onClick={() => onCreateRoom(playerName || 'Player 1', selectedToken)}
              disabled={!playerName.trim()}
            >
              Create Room
            </button>
          </div>
        </div>
      )}

      {mode === 'join' && (
        <div className="lobby-form">
          <h2>Join Game</h2>

          <div className="form-group">
            <label>Room Code</label>
            <input
              type="text"
              className="form-input form-input--code"
              placeholder="Enter 6-letter code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
          </div>

          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>Choose Your Token</label>
            <div className="token-grid">
              {PLAYER_TOKENS.map((t) => (
                <button
                  key={t.id}
                  className={`token-btn ${selectedToken === t.emoji ? 'token-btn--selected' : ''} ${usedTokens.includes(t.emoji) ? 'token-btn--taken' : ''}`}
                  onClick={() => setSelectedToken(t.emoji)}
                  disabled={usedTokens.includes(t.emoji)}
                  title={usedTokens.includes(t.emoji) ? 'Token taken' : t.name}
                >
                  <span className="token-emoji">{t.emoji}</span>
                  <span className="token-name">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setMode('home')}>Back</button>
            <button
              className="btn btn-primary"
              onClick={() => onJoinRoom(joinCode, playerName || 'Player', selectedToken)}
              disabled={!joinCode.trim() || !playerName.trim()}
            >
              Join Room
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
