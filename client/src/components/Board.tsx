import React, { useState } from 'react';
import { GameState, BOARD_SQUARES } from '../types/game';
import BoardSquare from './BoardSquare';
import PropertyModal from './PropertyModal';
import Dice from './Dice';

interface Props {
  game: GameState;
  myId: string;
  onAction: (action: string, data?: object) => void;
}

export default function Board({ game, myId, onAction }: Props) {
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);

  const handleSquareClick = (position: number) => {
    const sq = BOARD_SQUARES[position];
    if (sq.type === 'property' || sq.type === 'airline' || sq.type === 'utility') {
      setSelectedSquare(position === selectedSquare ? null : position);
    }
  };

  // Board layout positions for 11x11 grid
  // Bottom row: positions 0-10 (right to left: 0 is bottom-right corner)
  // Standard Monopoly: GO is bottom-right, move counter-clockwise
  // But let's go left-to-right on bottom: 0(GO-bottom-left), 1-9 (bottom), 10(Jail-bottom-right)
  // Left col: 11-19 (top to bottom)... nah let me do standard
  // STANDARD LAYOUT:
  // Bottom: pos 0 (GO, bottom-left) → 1,2,3,...,9 → pos 10 (Jail, bottom-right going left to right)
  // Wait, standard monopoly: GO is bottom-right, jail is bottom-left
  // Let's do: bottom row reads left-to-right as positions 10 down to 0 (jail on left, GO on right)

  // I'll use a simpler display: Position 0 at bottom-right corner
  // Bottom row (left→right): 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
  // Left col (top→bottom): 11, 12, 13, 14, 15, 16, 17, 18, 19
  // Top row (left→right): 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
  // Right col (top→bottom): 39, 38, 37, 36, 35, 34, 33, 32, 31

  // GO (pos 0) at top-left, movement clockwise
  const topRow    = [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10];
  const rightCol  = [11, 12, 13, 14, 15, 16, 17, 18, 19];
  const bottomRow = [30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20];
  const leftCol   = [39, 38, 37, 36, 35, 34, 33, 32, 31];

  const getSquareSide = (pos: number): 'bottom' | 'left' | 'top' | 'right' | 'corner' => {
    if ([0, 10, 20, 30].includes(pos)) return 'corner';
    if (topRow.includes(pos)) return 'top';
    if (rightCol.includes(pos)) return 'right';
    if (bottomRow.includes(pos)) return 'bottom';
    return 'left';
  };

  return (
    <div className="board-container">
      <div className="board">
        {/* Top row */}
        <div className="board-row board-row--top">
          {topRow.map((pos) => (
            <BoardSquare
              key={pos}
              square={BOARD_SQUARES[pos]}
              propertyState={game.propertyStates[pos]}
              players={game.players}
              onClick={() => handleSquareClick(pos)}
              highlighted={selectedSquare === pos}
              side={getSquareSide(pos)}
            />
          ))}
        </div>

        {/* Middle: left col + center + right col */}
        <div className="board-middle">
          <div className="board-col board-col--left">
            {leftCol.map((pos) => (
              <BoardSquare
                key={pos}
                square={BOARD_SQUARES[pos]}
                propertyState={game.propertyStates[pos]}
                players={game.players}
                onClick={() => handleSquareClick(pos)}
                highlighted={selectedSquare === pos}
                side="left"
              />
            ))}
          </div>

          <div className="board-center">
            <div className="board-logo">
              <div className="board-logo-icon">🕌</div>
              <div className="board-logo-title">MONOPOLY</div>
              <div className="board-logo-subtitle">al-Sharq</div>
              <div className="board-logo-arabic">منوبولي الشرق</div>
            </div>

            <div className="board-dice-area">
              <Dice dice={game.dice} />
              <div className="board-turn-label">
                {game.players[game.currentPlayerIndex] && (
                  <span>
                    {game.players[game.currentPlayerIndex].token}{' '}
                    {game.players[game.currentPlayerIndex].name}
                  </span>
                )}
              </div>
            </div>

            {game.settings.houseRules.freeParkingJackpot && game.freeParking > 0 && (
              <div className="board-jackpot">
                <span>🌴 Oasis Jackpot</span>
                <strong>£{game.freeParking.toLocaleString()}</strong>
              </div>
            )}
          </div>

          <div className="board-col board-col--right">
            {rightCol.map((pos) => (
              <BoardSquare
                key={pos}
                square={BOARD_SQUARES[pos]}
                propertyState={game.propertyStates[pos]}
                players={game.players}
                onClick={() => handleSquareClick(pos)}
                highlighted={selectedSquare === pos}
                side="right"
              />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="board-row board-row--bottom">
          {bottomRow.map((pos) => (
            <BoardSquare
              key={pos}
              square={BOARD_SQUARES[pos]}
              propertyState={game.propertyStates[pos]}
              players={game.players}
              onClick={() => handleSquareClick(pos)}
              highlighted={selectedSquare === pos}
              side={getSquareSide(pos)}
            />
          ))}
        </div>
      </div>

      {/* Property Detail Modal */}
      {selectedSquare !== null && (
        <PropertyModal
          square={BOARD_SQUARES[selectedSquare]}
          propertyState={game.propertyStates[selectedSquare]}
          players={game.players}
          myId={myId}
          game={game}
          onClose={() => setSelectedSquare(null)}
          onAction={onAction}
        />
      )}
    </div>
  );
}
