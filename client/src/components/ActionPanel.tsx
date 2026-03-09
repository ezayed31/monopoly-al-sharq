import React from 'react';
import { GameState, Player, BOARD_SQUARES } from '../types/game';
import Dice from './Dice';

interface Props {
  game: GameState;
  myId: string;
  onAction: (action: string, data?: object) => void;
  onOpenTrade: (targetId?: string) => void;
}

export default function ActionPanel({ game, myId, onAction, onOpenTrade }: Props) {
  const me = game.players.find((p) => p.id === myId);
  const currentPlayer = game.players[game.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myId;
  const currentSquare = me ? BOARD_SQUARES[me.position] : null;

  if (!me || game.gamePhase !== 'playing') return null;

  const isRolling = false; // could add animation state here
  const canEndTurn = isMyTurn && game.diceRolled &&
    game.turnPhase !== 'buying' &&
    game.turnPhase !== 'auction' &&
    game.turnPhase !== 'card';

  const isDoubles = game.dice[0] === game.dice[1] && game.dice[0] > 0 && game.doublesCount > 0;

  return (
    <div className="action-panel">
      {/* Current turn header */}
      <div className="turn-header">
        {isMyTurn ? (
          <div className="turn-header-you">Your Turn</div>
        ) : (
          <div className="turn-header-other">
            {currentPlayer?.token} {currentPlayer?.name}'s Turn
          </div>
        )}
        {currentSquare && me && (
          <div className="current-position">
            at <strong>{currentSquare.name}</strong>
          </div>
        )}
      </div>

      {/* Dice display */}
      <Dice dice={game.dice} />

      {/* Jail actions */}
      {isMyTurn && me.inJail && !game.diceRolled && (
        <div className="jail-actions">
          <div className="jail-notice">🔒 You are in Al-Sijn!</div>
          <div className="jail-options">
            <button
              className="btn btn-primary"
              onClick={() => onAction('roll_dice')}
            >
              Roll for Doubles (free)
            </button>
            {me.money >= 50 && (
              <button
                className="btn btn-warning"
                onClick={() => onAction('pay_jail')}
              >
                Pay £50 Fine
              </button>
            )}
            {me.getOutOfJailCards > 0 && (
              <button
                className="btn btn-success"
                onClick={() => onAction('use_jail_card')}
              >
                Use Get Out Free Card
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main roll button */}
      {isMyTurn && !game.diceRolled && !me.inJail && (
        <button
          className="btn btn-primary btn-large btn-roll"
          onClick={() => onAction('roll_dice')}
        >
          🎲 Roll Dice
        </button>
      )}

      {/* Buying decision */}
      {isMyTurn && game.turnPhase === 'buying' && game.pendingBuy !== null && (
        <div className="buying-decision">
          <div className="buying-property">
            <strong>{BOARD_SQUARES[game.pendingBuy].name}</strong>
            <span className="buying-price">£{BOARD_SQUARES[game.pendingBuy].price}</span>
          </div>
          <div className="buying-buttons">
            <button
              className="btn btn-success"
              onClick={() => onAction('buy_property')}
              disabled={me.money < (BOARD_SQUARES[game.pendingBuy!]?.price || 0)}
            >
              Buy (£{BOARD_SQUARES[game.pendingBuy].price})
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onAction('pass_property')}
            >
              {game.settings.houseRules.auctionUnbought ? 'Auction' : 'Pass'}
            </button>
          </div>
        </div>
      )}

      {/* Doubles info */}
      {isMyTurn && isDoubles && game.diceRolled && canEndTurn && (
        <div className="doubles-notice">
          You rolled doubles! Roll again after ending turn.
        </div>
      )}

      {/* End turn */}
      {canEndTurn && isMyTurn && (
        <button
          className="btn btn-secondary"
          onClick={() => onAction('end_turn')}
        >
          End Turn
        </button>
      )}

      {/* Trade button - available anytime */}
      {game.gamePhase === 'playing' && !me.isBankrupt && (
        <button
          className="btn btn-info btn-sm"
          onClick={() => onOpenTrade()}
        >
          🤝 Propose Trade
        </button>
      )}

      {/* Bankruptcy option */}
      {isMyTurn && me.money < 0 && (
        <button
          className="btn btn-danger"
          onClick={() => onAction('declare_bankruptcy')}
        >
          Declare Bankruptcy
        </button>
      )}

      {/* Waiting message */}
      {!isMyTurn && (
        <div className="waiting-message">
          Waiting for {currentPlayer?.name}...
        </div>
      )}
    </div>
  );
}
