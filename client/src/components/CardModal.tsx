import React from 'react';
import { Card } from '../types/game';

interface Props {
  card: Card;
  type: 'chance' | 'community_chest';
  onAcknowledge: () => void;
}

export default function CardModal({ card, type, onAcknowledge }: Props) {
  const isChance = type === 'chance';

  return (
    <div className="modal-overlay">
      <div className={`card-modal card-modal--${isChance ? 'chance' : 'chest'}`}>
        <div className="card-modal-type">
          {isChance ? '🔮 Inshallah Card' : '🤲 Sadaqah Card'}
          <div className="card-modal-type-ar">
            {isChance ? 'إن شاء الله' : 'صدقة'}
          </div>
        </div>

        <div className="card-modal-content">
          <div className="card-modal-icon">
            {isChance ? '🌙' : '⭐'}
          </div>
          <p className="card-modal-text">{card.text}</p>
        </div>

        <button className="btn btn-primary btn-large" onClick={onAcknowledge}>
          OK, Inshallah!
        </button>
      </div>
    </div>
  );
}
