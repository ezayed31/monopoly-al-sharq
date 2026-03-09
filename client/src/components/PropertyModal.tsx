import React from 'react';
import { BoardSquare, PropertyState, Player, GameState, COLOR_GROUP_STYLES, COLOR_GROUPS } from '../types/game';

interface Props {
  square: BoardSquare;
  propertyState?: PropertyState;
  players: Player[];
  myId: string;
  game: GameState;
  onClose: () => void;
  onAction: (action: string, data?: object) => void;
}

const AIRLINE_RENT = [0, 25, 50, 100, 200];

export default function PropertyModal({ square, propertyState, players, myId, game, onClose, onAction }: Props) {
  const owner = propertyState?.ownerId ? players.find((p) => p.id === propertyState.ownerId) : null;
  const me = players.find((p) => p.id === myId);
  const isMyProperty = propertyState?.ownerId === myId;
  const colorStyle = square.colorGroup ? COLOR_GROUP_STYLES[square.colorGroup] : null;
  const groupPositions = square.colorGroup ? COLOR_GROUPS[square.colorGroup].properties : [];
  const ownsGroup = square.colorGroup && groupPositions.every((pos) => game.propertyStates[pos]?.ownerId === myId);
  const isMyTurn = game.players[game.currentPlayerIndex]?.id === myId;
  const canManage = isMyProperty && game.gamePhase === 'playing';

  const countHouses = (ownerId: string) =>
    Object.values(game.propertyStates).filter((s) => s.ownerId === ownerId && s.houses > 0).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="property-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        {colorStyle ? (
          <div className="property-modal-header" style={{ background: colorStyle.bg, color: colorStyle.text }}>
            <div className="property-modal-group">{square.colorGroup?.toUpperCase()} SET</div>
            <h2>{square.name}</h2>
            <div className="property-modal-arabic">{square.nameAr}</div>
            {square.city && <div className="property-modal-city">{square.city}</div>}
            <button className="modal-close" onClick={onClose} style={{ color: colorStyle.text }}>✕</button>
          </div>
        ) : (
          <div className="property-modal-header property-modal-header--special">
            <h2>{square.name}</h2>
            <div className="property-modal-arabic">{square.nameAr}</div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        )}

        <div className="property-modal-body">
          {/* Ownership status */}
          {owner ? (
            <div className="ownership-info" style={{ borderColor: owner.color }}>
              <div className="ownership-dot" style={{ background: owner.color }} />
              <span>Owned by <strong>{owner.name}</strong></span>
              {propertyState?.mortgaged && <span className="mortgaged-tag">MORTGAGED</span>}
            </div>
          ) : square.type !== 'go' && square.type !== 'jail' && square.type !== 'free_parking' && square.type !== 'go_to_jail' && square.type !== 'tax' && square.type !== 'chance' && square.type !== 'community_chest' ? (
            <div className="ownership-info ownership-info--available">
              <span>Available — £{square.price}</span>
            </div>
          ) : null}

          {/* Property rent table */}
          {square.type === 'property' && square.rent && (
            <table className="rent-table">
              <tbody>
                <tr><td>Price</td><td><strong>£{square.price}</strong></td></tr>
                <tr className={propertyState?.houses === 0 ? 'rent-table-active' : ''}>
                  <td>Rent (undev.)</td><td>£{square.rent[0]}</td>
                </tr>
                <tr className={ownsGroup && !propertyState?.houses ? 'rent-table-highlight' : ''}>
                  <td>With monopoly</td><td>£{square.rent[0] * 2}</td>
                </tr>
                <tr className={propertyState?.houses === 1 ? 'rent-table-active' : ''}>
                  <td>1 House</td><td>£{square.rent[1]}</td>
                </tr>
                <tr className={propertyState?.houses === 2 ? 'rent-table-active' : ''}>
                  <td>2 Houses</td><td>£{square.rent[2]}</td>
                </tr>
                <tr className={propertyState?.houses === 3 ? 'rent-table-active' : ''}>
                  <td>3 Houses</td><td>£{square.rent[3]}</td>
                </tr>
                <tr className={propertyState?.houses === 4 ? 'rent-table-active' : ''}>
                  <td>4 Houses</td><td>£{square.rent[4]}</td>
                </tr>
                <tr className={propertyState?.houses === 5 ? 'rent-table-active' : ''}>
                  <td>Hotel 🏨</td><td>£{square.rent[5]}</td>
                </tr>
                <tr><td>House cost</td><td>£{square.housePrice}</td></tr>
                <tr><td>Mortgage value</td><td>£{square.mortgageValue}</td></tr>
              </tbody>
            </table>
          )}

          {/* Airline rent table */}
          {square.type === 'airline' && (
            <table className="rent-table">
              <tbody>
                <tr><td>Price</td><td><strong>£{square.price}</strong></td></tr>
                {[1, 2, 3, 4].map((n) => (
                  <tr key={n}>
                    <td>{n} Airline{n > 1 ? 's' : ''} owned</td>
                    <td>£{AIRLINE_RENT[n]}</td>
                  </tr>
                ))}
                <tr><td>Mortgage value</td><td>£{square.mortgageValue}</td></tr>
              </tbody>
            </table>
          )}

          {/* Utility info */}
          {square.type === 'utility' && (
            <table className="rent-table">
              <tbody>
                <tr><td>Price</td><td><strong>£{square.price}</strong></td></tr>
                <tr><td>1 Utility owned</td><td>4× dice roll</td></tr>
                <tr><td>2 Utilities owned</td><td>10× dice roll</td></tr>
                <tr><td>Mortgage value</td><td>£{square.mortgageValue}</td></tr>
              </tbody>
            </table>
          )}

          {/* Special squares */}
          {square.description && (
            <p className="square-description">{square.description}</p>
          )}

          {/* Houses display */}
          {propertyState && propertyState.houses > 0 && (
            <div className="houses-display">
              {propertyState.houses === 5 ? (
                <span className="hotel-badge">🏨 Hotel</span>
              ) : (
                <span>{propertyState.houses} House{propertyState.houses > 1 ? 's' : ''} 🏠</span>
              )}
            </div>
          )}

          {/* Action buttons */}
          {canManage && isMyTurn && (
            <div className="property-actions">
              {square.type === 'property' && ownsGroup && !propertyState?.mortgaged && (
                <>
                  {(propertyState?.houses || 0) < 5 && (
                    <button
                      className="btn btn-success"
                      onClick={() => { onAction('build_house', { position: square.position }); onClose(); }}
                    >
                      Build House (£{square.housePrice})
                    </button>
                  )}
                  {(propertyState?.houses || 0) > 0 && (
                    <button
                      className="btn btn-warning"
                      onClick={() => { onAction('sell_house', { position: square.position }); onClose(); }}
                    >
                      Sell House (£{Math.floor((square.housePrice || 0) / 2)})
                    </button>
                  )}
                </>
              )}
              {!propertyState?.mortgaged && (propertyState?.houses || 0) === 0 && (
                <button
                  className="btn btn-danger"
                  onClick={() => { onAction('mortgage', { position: square.position }); onClose(); }}
                >
                  Mortgage (£{square.mortgageValue})
                </button>
              )}
              {propertyState?.mortgaged && (
                <button
                  className="btn btn-primary"
                  onClick={() => { onAction('unmortgage', { position: square.position }); onClose(); }}
                >
                  Unmortgage (£{Math.floor((square.mortgageValue || 0) * 1.1)})
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
