import React from 'react';
import { Player, GameState } from '../types/game';

interface Props {
  winner: Player;
  game: GameState;
  myId: string;
  onRestart: () => void;
}

export default function WinnerScreen({ winner, game, myId, onRestart }: Props) {
  const isWinner = winner.id === myId;
  const me = game.players.find((p) => p.id === myId);
  const isHost = me?.isHost;

  const sortedPlayers = [...game.players].sort((a, b) => b.money - a.money);

  return (
    <div className="winner-screen">
      <div className="winner-content">
        <div className="winner-decoration">
          <span className="winner-star">⭐</span>
          <span className="winner-star winner-star--big">🌟</span>
          <span className="winner-star">⭐</span>
        </div>

        <h1 className="winner-title">
          {isWinner ? 'Mabrook!' : 'Game Over!'}
        </h1>
        <div className="winner-arabic">
          {isWinner ? 'مبروك!' : 'انتهت اللعبة'}
        </div>

        <div className="winner-player" style={{ borderColor: winner.color }}>
          <div className="winner-token">{winner.token}</div>
          <div className="winner-name">{winner.name}</div>
          <div className="winner-label">wins the game!</div>
          <div className="winner-money">£{winner.money.toLocaleString()}</div>
        </div>

        <div className="final-standings">
          <h3>Final Standings</h3>
          {sortedPlayers.map((p, i) => (
            <div key={p.id} className={`standing-row ${p.id === winner.id ? 'standing-row--winner' : ''} ${p.isBankrupt ? 'standing-row--bankrupt' : ''}`}>
              <span className="standing-rank">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </span>
              <span className="standing-token">{p.token}</span>
              <span className="standing-name">{p.name}</span>
              <span className="standing-money">
                {p.isBankrupt ? 'Bankrupt' : `£${p.money.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>

        {isHost && (
          <button className="btn btn-primary btn-large" onClick={onRestart}>
            🔄 Play Again
          </button>
        )}
        {!isHost && (
          <div className="waiting-restart">Waiting for host to start a new game...</div>
        )}
      </div>
    </div>
  );
}
