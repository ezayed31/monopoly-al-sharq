import React from 'react';
import { BoardSquare as BoardSquareType, PropertyState, Player, COLOR_GROUP_STYLES } from '../types/game';

interface Props {
  square: BoardSquareType;
  propertyState?: PropertyState;
  players: Player[];
  onClick: () => void;
  highlighted?: boolean;
  side: 'bottom' | 'left' | 'top' | 'right' | 'corner';
}

const squareTypeEmoji: Record<string, string> = {
  go: '🌟',
  community_chest: '🤲',
  chance: '🔮',
  tax: '💰',
  airline: '✈️',
  utility: '⚙️',
  jail: '🔒',
  free_parking: '🌴',
  go_to_jail: '⛓️',
};

const playerColors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];

function HouseIndicator({ houses }: { houses: number }) {
  if (houses === 0) return null;
  if (houses === 5) return <div className="hotel-indicator" title="Hotel">🏨</div>;
  return (
    <div className="houses-indicator">
      {Array.from({ length: houses }).map((_, i) => (
        <div key={i} className="house-dot" title={`${houses} house(s)`} />
      ))}
    </div>
  );
}

export default function BoardSquare({ square, propertyState, players, onClick, highlighted, side }: Props) {
  const playersHere = players.filter((p) => p.position === square.position && !p.isBankrupt);
  const owner = propertyState?.ownerId ? players.find((p) => p.id === propertyState.ownerId) : null;
  const colorStyle = square.colorGroup ? COLOR_GROUP_STYLES[square.colorGroup] : null;

  const isCorner = side === 'corner';
  const isVertical = side === 'left' || side === 'right';

  return (
    <div
      className={`board-square board-square--${square.type} board-square--${side} ${highlighted ? 'board-square--highlighted' : ''} ${propertyState?.mortgaged ? 'board-square--mortgaged' : ''}`}
      onClick={onClick}
      title={`${square.name} (${square.nameAr})`}
    >
      {/* Color band for properties */}
      {colorStyle && (
        <div
          className="color-band"
          style={{ background: colorStyle.bg }}
        >
          {square.flag && <span className="square-flag">{square.flag}</span>}
          {propertyState && <HouseIndicator houses={propertyState.houses} />}
        </div>
      )}

      {/* Special type indicator */}
      {!colorStyle && (
        <div className="square-icon">{squareTypeEmoji[square.type] || '?'}</div>
      )}

      {/* Property name */}
      <div className={`square-name ${isVertical ? 'square-name--vertical' : ''}`}>
        <span className="square-name-en">{square.name}</span>
        {!isCorner && <span className="square-name-ar">{square.nameAr}</span>}
      </div>

      {/* Price for buyable squares */}
      {square.price && !isCorner && (
        <div className="square-price">£{square.price}</div>
      )}

      {/* Mortgage overlay */}
      {propertyState?.mortgaged && (
        <div className="mortgaged-overlay">MORTGAGED</div>
      )}

      {/* Owner indicator */}
      {owner && !propertyState?.mortgaged && (
        <div
          className="owner-dot"
          style={{ background: owner.color }}
          title={`Owned by ${owner.name}`}
        />
      )}

      {/* Players on this square */}
      {playersHere.length > 0 && (
        <div className="players-on-square">
          {playersHere.map((p) => (
            <div key={p.id} className="player-token" title={p.name} style={{ border: `2px solid ${p.color}` }}>
              {p.token}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
