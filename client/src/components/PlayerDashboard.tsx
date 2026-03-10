import React from 'react';
import { Player, GameState, BOARD_SQUARES } from '../types/game';

interface Props {
  player: Player;
  game: GameState;
  isCurrentTurn: boolean;
  isMe: boolean;
  onTrade?: (toPlayerId: string) => void;
}

export default function PlayerDashboard({ player, game, isCurrentTurn, isMe, onTrade }: Props) {
  const ownedProperties = Object.values(game.propertyStates)
    .filter((s) => s.ownerId === player.id)
    .map((s) => ({ state: s, square: BOARD_SQUARES[s.position] }));

  const netWorth = ownedProperties.reduce((acc, { state, square }) => {
    if (!state.mortgaged) acc += (square.mortgageValue || 0);
    acc += state.houses * Math.floor((square.housePrice || 0) / 2);
    return acc;
  }, player.money);

  return (
    <div
      className={`player-dashboard ${isCurrentTurn ? 'player-dashboard--active' : ''} ${player.isBankrupt ? 'player-dashboard--bankrupt' : ''} ${isMe ? 'player-dashboard--me' : ''}`}
    >
      <div className="player-avatar" style={{ borderColor: player.color, boxShadow: isCurrentTurn ? `0 0 10px ${player.color}` : 'none' }}>
        {player.token}
      </div>
      <div className="player-info">
        <div className="player-name-row">
          <span className="player-name-text">{player.name}</span>
          <div className="player-badges">
            {isMe && <span className="badge badge-you">You</span>}
            {player.isHost && <span className="badge badge-host">Host</span>}
            {isCurrentTurn && <span className="badge badge-turn">▶</span>}
            {player.isBankrupt && <span className="badge badge-bankrupt">💀</span>}
          </div>
        </div>
        <div className="player-money-row">
          <span className="player-money">£{player.money.toLocaleString()}</span>
          <span className="player-networth">net £{netWorth.toLocaleString()}</span>
        </div>
        {player.inJail && (
          <div className="player-jail-tag">🔒 Al-Sijn ({player.jailTurns}/3)</div>
        )}
        {ownedProperties.length > 0 && (
          <div className="player-prop-dots">
            {ownedProperties.slice(0, 12).map(({ state, square }) => (
              <div
                key={state.position}
                className={`prop-dot ${state.mortgaged ? 'prop-dot--mortgaged' : ''}`}
                style={{ background: square.colorGroup ? `var(--c-${square.colorGroup})` : '#888' }}
                title={square.name}
              />
            ))}
            {ownedProperties.length > 12 && <span className="prop-dot-more">+{ownedProperties.length - 12}</span>}
          </div>
        )}
      </div>
      {!isMe && !player.isBankrupt && onTrade && (
        <button className="btn btn-sm btn-ghost player-trade-btn" onClick={() => onTrade(player.id)} title="Trade">
          🤝
        </button>
      )}
    </div>
  );
}
