import React, { useState } from 'react';
import { Player, GameState, BOARD_SQUARES } from '../types/game';

interface Props {
  player: Player;
  game: GameState;
  isCurrentTurn: boolean;
  isMe: boolean;
  onTrade?: (toPlayerId: string) => void;
}

export default function PlayerDashboard({ player, game, isCurrentTurn, isMe, onTrade }: Props) {
  const [showProperties, setShowProperties] = useState(false);

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
      style={{ borderColor: player.color }}
    >
      <div className="player-dashboard-header">
        <div className="player-token-large" style={{ border: `3px solid ${player.color}` }}>
          {player.token}
        </div>
        <div className="player-info">
          <div className="player-name">
            {player.name}
            {isMe && <span className="you-badge">You</span>}
            {player.isHost && <span className="host-badge">Host</span>}
            {isCurrentTurn && <span className="turn-badge">Turn</span>}
          </div>
          <div className="player-money">£{player.money.toLocaleString()}</div>
          <div className="player-networth">Net: £{netWorth.toLocaleString()}</div>
        </div>
        {player.isBankrupt && <div className="bankrupt-badge">BANKRUPT</div>}
      </div>

      {/* Jail status */}
      {player.inJail && (
        <div className="jail-status">
          🔒 In Al-Sijn ({player.jailTurns}/3 turns)
        </div>
      )}

      {/* Jail free cards */}
      {player.getOutOfJailCards > 0 && (
        <div className="jail-card-badge">
          🃏 {player.getOutOfJailCards}× Get Out of Al-Sijn Free
        </div>
      )}

      {/* Properties */}
      {ownedProperties.length > 0 && (
        <div className="player-properties-section">
          <button
            className="properties-toggle"
            onClick={() => setShowProperties(!showProperties)}
          >
            {ownedProperties.length} Properties {showProperties ? '▲' : '▼'}
          </button>
          {showProperties && (
            <div className="player-properties-list">
              {ownedProperties.map(({ state, square }) => (
                <div
                  key={state.position}
                  className={`property-chip ${state.mortgaged ? 'property-chip--mortgaged' : ''}`}
                  title={square.nameAr}
                >
                  {square.colorGroup && (
                    <div
                      className="property-chip-color"
                      style={{
                        background: square.colorGroup ? `var(--color-${square.colorGroup})` : '#888'
                      }}
                    />
                  )}
                  <span className="property-chip-name">{square.name}</span>
                  {state.houses > 0 && (
                    <span className="property-chip-houses">
                      {state.houses === 5 ? '🏨' : `🏠×${state.houses}`}
                    </span>
                  )}
                  {state.mortgaged && <span className="property-chip-mortgaged">M</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trade button */}
      {!isMe && !player.isBankrupt && onTrade && (
        <button
          className="btn btn-sm btn-secondary trade-btn"
          onClick={() => onTrade(player.id)}
        >
          🤝 Trade
        </button>
      )}
    </div>
  );
}
