import React, { useState } from 'react';
import { GameState, Player, BOARD_SQUARES, TradeOffer } from '../types/game';

interface Props {
  game: GameState;
  myId: string;
  targetPlayerId?: string;
  onPropose: (toPlayerId: string, offer: TradeOffer) => void;
  onRespond?: (accept: boolean) => void;
  onCancel: () => void;
}

export default function TradeModal({ game, myId, targetPlayerId, onPropose, onRespond, onCancel }: Props) {
  const me = game.players.find((p) => p.id === myId)!;
  const [selectedTarget, setSelectedTarget] = useState(targetPlayerId || '');
  const [fromMoney, setFromMoney] = useState(0);
  const [toMoney, setToMoney] = useState(0);
  const [fromProps, setFromProps] = useState<number[]>([]);
  const [toProps, setToProps] = useState<number[]>([]);
  const [fromJailCards, setFromJailCards] = useState(0);
  const [toJailCards, setToJailCards] = useState(0);

  const isIncoming = game.pendingTrade && game.pendingTrade.toPlayerId === myId;
  const isPending = !!game.pendingTrade;

  const targetPlayer = game.players.find((p) => p.id === (selectedTarget || game.pendingTrade?.fromPlayerId));

  const getPlayerProperties = (playerId: string) =>
    Object.values(game.propertyStates)
      .filter((s) => s.ownerId === playerId)
      .map((s) => ({ state: s, square: BOARD_SQUARES[s.position] }));

  const myProps = getPlayerProperties(myId);
  const targetProps = targetPlayer ? getPlayerProperties(targetPlayer.id) : [];

  const toggleProp = (pos: number, side: 'from' | 'to') => {
    if (side === 'from') {
      setFromProps((prev) => prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]);
    } else {
      setToProps((prev) => prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]);
    }
  };

  const handlePropose = () => {
    if (!selectedTarget) return;
    onPropose(selectedTarget, {
      fromMoney,
      toMoney,
      fromProperties: fromProps,
      toProperties: toProps,
      fromJailCards,
      toJailCards,
    });
  };

  if (isIncoming && game.pendingTrade) {
    const from = game.players.find((p) => p.id === game.pendingTrade!.fromPlayerId);
    const offer = game.pendingTrade.offer;
    return (
      <div className="modal-overlay">
        <div className="trade-modal">
          <h2>🤝 Trade Offer from {from?.name}</h2>
          <div className="trade-offer-display">
            <div className="trade-side">
              <h3>They offer:</h3>
              {offer.fromMoney > 0 && <p className="trade-money">£{offer.fromMoney}</p>}
              {offer.fromJailCards > 0 && <p>🃏 {offer.fromJailCards}× Jail Free Card</p>}
              {offer.fromProperties.map((pos) => (
                <div key={pos} className="trade-property-chip">
                  {BOARD_SQUARES[pos].name}
                </div>
              ))}
              {offer.fromMoney === 0 && !offer.fromJailCards && offer.fromProperties.length === 0 && <p className="muted">Nothing</p>}
            </div>
            <div className="trade-arrow">⇄</div>
            <div className="trade-side">
              <h3>They want:</h3>
              {offer.toMoney > 0 && <p className="trade-money">£{offer.toMoney}</p>}
              {offer.toJailCards > 0 && <p>🃏 {offer.toJailCards}× Jail Free Card</p>}
              {offer.toProperties.map((pos) => (
                <div key={pos} className="trade-property-chip">
                  {BOARD_SQUARES[pos].name}
                </div>
              ))}
              {offer.toMoney === 0 && !offer.toJailCards && offer.toProperties.length === 0 && <p className="muted">Nothing</p>}
            </div>
          </div>
          <div className="trade-actions">
            <button className="btn btn-success" onClick={() => onRespond?.(true)}>Accept</button>
            <button className="btn btn-danger" onClick={() => onRespond?.(false)}>Decline</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="trade-modal trade-modal--propose">
        <div className="trade-modal-header">
          <h2>🤝 Propose Trade</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        {/* Target selection */}
        <div className="trade-section">
          <label>Trade with:</label>
          <div className="player-select">
            {game.players.filter((p) => p.id !== myId && !p.isBankrupt).map((p) => (
              <button
                key={p.id}
                className={`player-select-btn ${selectedTarget === p.id ? 'player-select-btn--active' : ''}`}
                style={{ borderColor: p.color }}
                onClick={() => setSelectedTarget(p.id)}
              >
                {p.token} {p.name}
              </button>
            ))}
          </div>
        </div>

        {selectedTarget && (
          <>
            <div className="trade-columns">
              {/* My offer */}
              <div className="trade-col">
                <h3 style={{ color: me.color }}>You offer:</h3>
                <div className="trade-money-row">
                  <label>Money: £</label>
                  <input
                    type="number"
                    min={0}
                    max={me.money}
                    value={fromMoney}
                    onChange={(e) => setFromMoney(Math.min(parseInt(e.target.value) || 0, me.money))}
                    className="trade-input"
                  />
                </div>
                {me.getOutOfJailCards > 0 && (
                  <div className="trade-money-row">
                    <label>Jail Free Cards:</label>
                    <input
                      type="number"
                      min={0}
                      max={me.getOutOfJailCards}
                      value={fromJailCards}
                      onChange={(e) => setFromJailCards(Math.min(parseInt(e.target.value) || 0, me.getOutOfJailCards))}
                      className="trade-input"
                    />
                  </div>
                )}
                <div className="trade-props-label">Properties:</div>
                <div className="trade-properties">
                  {myProps.length === 0 && <p className="muted">No properties</p>}
                  {myProps.map(({ state, square }) => (
                    <div
                      key={state.position}
                      className={`trade-property-chip ${fromProps.includes(state.position) ? 'trade-property-chip--selected' : ''}`}
                      onClick={() => toggleProp(state.position, 'from')}
                    >
                      {square.name}
                      {state.houses > 0 && ` (${state.houses === 5 ? '🏨' : `🏠×${state.houses}`})`}
                    </div>
                  ))}
                </div>
              </div>

              <div className="trade-arrow">⇄</div>

              {/* Their offer */}
              <div className="trade-col">
                <h3 style={{ color: targetPlayer?.color }}>You want:</h3>
                <div className="trade-money-row">
                  <label>Money: £</label>
                  <input
                    type="number"
                    min={0}
                    max={targetPlayer?.money || 0}
                    value={toMoney}
                    onChange={(e) => setToMoney(Math.min(parseInt(e.target.value) || 0, targetPlayer?.money || 0))}
                    className="trade-input"
                  />
                </div>
                {(targetPlayer?.getOutOfJailCards || 0) > 0 && (
                  <div className="trade-money-row">
                    <label>Jail Free Cards:</label>
                    <input
                      type="number"
                      min={0}
                      max={targetPlayer?.getOutOfJailCards || 0}
                      value={toJailCards}
                      onChange={(e) => setToJailCards(Math.min(parseInt(e.target.value) || 0, targetPlayer?.getOutOfJailCards || 0))}
                      className="trade-input"
                    />
                  </div>
                )}
                <div className="trade-props-label">Properties:</div>
                <div className="trade-properties">
                  {targetProps.length === 0 && <p className="muted">No properties</p>}
                  {targetProps.map(({ state, square }) => (
                    <div
                      key={state.position}
                      className={`trade-property-chip ${toProps.includes(state.position) ? 'trade-property-chip--selected' : ''}`}
                      onClick={() => toggleProp(state.position, 'to')}
                    >
                      {square.name}
                      {state.houses > 0 && ` (${state.houses === 5 ? '🏨' : `🏠×${state.houses}`})`}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="trade-actions">
              <button className="btn btn-primary" onClick={handlePropose}>
                Propose Trade
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
