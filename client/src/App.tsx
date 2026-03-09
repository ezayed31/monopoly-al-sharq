import React, { useEffect, useState, useCallback } from 'react';
import { GameState } from './types/game';
import { getSocket } from './socket';
import Lobby from './components/Lobby';
import Board from './components/Board';
import PlayerDashboard from './components/PlayerDashboard';
import ActionPanel from './components/ActionPanel';
import GameLog from './components/GameLog';
import CardModal from './components/CardModal';
import AuctionModal from './components/AuctionModal';
import TradeModal from './components/TradeModal';
import Settings from './components/Settings';
import WinnerScreen from './components/WinnerScreen';
import './App.css';

export default function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [myId, setMyId] = useState<string>('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTrade, setShowTrade] = useState(false);
  const [tradeTarget, setTradeTarget] = useState<string | undefined>();

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setMyId(socket.id || '');
    });

    socket.on('room_created', ({ roomId, playerId }: { roomId: string; playerId: string }) => {
      setRoomId(roomId);
      setMyId(playerId);
      setError(null);
    });

    socket.on('room_joined', ({ roomId, playerId }: { roomId: string; playerId: string }) => {
      setRoomId(roomId);
      setMyId(playerId);
      setError(null);
    });

    socket.on('game_state', (state: GameState) => {
      setGame(state);
    });

    socket.on('game_started', () => {
      setShowSettings(false);
    });

    socket.on('error_msg', ({ message }: { message: string }) => {
      setError(message);
      setTimeout(() => setError(null), 4000);
    });

    return () => {
      socket.off('connect');
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('game_state');
      socket.off('game_started');
      socket.off('error_msg');
    };
  }, []);

  const sendAction = useCallback((action: string, data?: object) => {
    const socket = getSocket();
    socket.emit(action, data || {});
  }, []);

  const handleAction = useCallback((action: string, data?: object) => {
    sendAction(action, data);
  }, [sendAction]);

  const handleCreateRoom = (name: string, token: string) => {
    sendAction('create_room', { playerName: name, token });
  };

  const handleJoinRoom = (code: string, name: string, token: string) => {
    sendAction('join_room', { roomId: code, playerName: name, token });
  };

  const handleStartGame = () => {
    sendAction('start_game');
  };

  const handleUpdateSettings = (settings: object) => {
    sendAction('update_settings', { settings });
  };

  const handleOpenTrade = (targetId?: string) => {
    setTradeTarget(targetId);
    setShowTrade(true);
  };

  const handleProposeTrade = (toPlayerId: string, offer: object) => {
    sendAction('propose_trade', { toPlayerId, offer });
    setShowTrade(false);
  };

  const handleRespondTrade = (accept: boolean) => {
    sendAction('respond_trade', { accept });
    setShowTrade(false);
  };

  const handleCancelTrade = () => {
    sendAction('cancel_trade');
    setShowTrade(false);
  };

  const handleRestart = () => {
    sendAction('restart_game', {});
  };

  const me = game?.players.find((p) => p.id === myId);
  const isHost = me?.isHost || false;

  // Determine if trade modal should show (incoming trade notification)
  const hasIncomingTrade = game?.pendingTrade && game.pendingTrade.toPlayerId === myId;

  // Show trade modal if incoming trade
  const shouldShowTrade = showTrade || hasIncomingTrade;

  return (
    <div className="app">
      {/* Error toast */}
      {error && (
        <div className="error-toast">
          ⚠️ {error}
        </div>
      )}

      {/* Lobby screen */}
      {(!game || game.gamePhase === 'lobby') && (
        <Lobby
          roomId={roomId}
          players={game?.players || []}
          myId={myId}
          isHost={isHost}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onStartGame={handleStartGame}
          onOpenSettings={() => setShowSettings(true)}
          error={error}
        />
      )}

      {/* Game screen */}
      {game && game.gamePhase === 'playing' && (
        <div className="game-layout">
          {/* Top bar */}
          <div className="game-topbar">
            <div className="game-topbar-left">
              <span className="game-title-small">🕌 Monopoly al-Sharq</span>
              <span className="room-badge">Room: {game.roomId}</span>
            </div>
            <div className="game-topbar-right">
              <button className="btn btn-sm btn-ghost" onClick={() => setShowSettings(true)}>
                ⚙️ Settings
              </button>
            </div>
          </div>

          <div className="game-main">
            {/* Left sidebar: Players */}
            <div className="game-sidebar game-sidebar--left">
              <div className="players-panel">
                {game.players.map((player, i) => (
                  <PlayerDashboard
                    key={player.id}
                    player={player}
                    game={game}
                    isCurrentTurn={i === game.currentPlayerIndex}
                    isMe={player.id === myId}
                    onTrade={handleOpenTrade}
                  />
                ))}
              </div>
            </div>

            {/* Center: Board */}
            <div className="game-board-area">
              <Board
                game={game}
                myId={myId}
                onAction={handleAction}
              />
            </div>

            {/* Right sidebar: Actions + Log */}
            <div className="game-sidebar game-sidebar--right">
              <ActionPanel
                game={game}
                myId={myId}
                onAction={handleAction}
                onOpenTrade={handleOpenTrade}
              />
              <GameLog log={game.log} />
            </div>
          </div>
        </div>
      )}

      {/* Winner screen */}
      {game && game.gamePhase === 'ended' && game.winner && (
        <WinnerScreen
          winner={game.winner}
          game={game}
          myId={myId}
          onRestart={handleRestart}
        />
      )}

      {/* Overlays */}

      {/* Settings modal */}
      {showSettings && game && (
        <Settings
          settings={game.settings}
          isHost={isHost}
          onUpdate={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Card modal */}
      {game?.pendingCard && game.players[game.currentPlayerIndex]?.id === myId && (
        <CardModal
          card={game.pendingCard.card}
          type={game.pendingCard.type}
          onAcknowledge={() => sendAction('acknowledge_card')}
        />
      )}

      {/* Auction modal */}
      {game?.auction && game.gamePhase === 'playing' && (
        <AuctionModal
          game={game}
          myId={myId}
          onBid={(amount) => sendAction('bid_auction', { amount })}
          onPass={() => sendAction('pass_auction')}
        />
      )}

      {/* Trade modal */}
      {shouldShowTrade && game && (
        <TradeModal
          game={game}
          myId={myId}
          targetPlayerId={tradeTarget}
          onPropose={handleProposeTrade}
          onRespond={handleRespondTrade}
          onCancel={handleCancelTrade}
        />
      )}
    </div>
  );
}
