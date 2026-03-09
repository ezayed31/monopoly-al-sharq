const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { BOARD_SQUARES, PLAYER_TOKENS } = require('./boardData');
const engine = require('./gameEngine');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the built React client in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// In-memory game rooms
const rooms = {}; // roomId -> game state
const playerRoom = {}; // socketId -> roomId

function broadcastState(roomId) {
  const game = rooms[roomId];
  if (!game) return;
  io.to(roomId).emit('game_state', game);
}

function handleError(socket, message) {
  socket.emit('error_msg', { message });
}

io.on('connection', (socket) => {
  console.log(`[+] Client connected: ${socket.id}`);

  // Create a new game room
  socket.on('create_room', ({ playerName, token, settings }) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const game = engine.createGame(roomId, settings || {});

    const player = {
      id: socket.id,
      name: playerName || 'Player 1',
      token: token || PLAYER_TOKENS[0].emoji,
      tokenId: token || PLAYER_TOKENS[0].id,
      money: game.settings.startingMoney,
      position: 0,
      inJail: false,
      jailTurns: 0,
      getOutOfJailCards: 0,
      isBankrupt: false,
      isHost: true,
      color: '#E74C3C',
    };

    game.players.push(player);
    rooms[roomId] = game;
    playerRoom[socket.id] = roomId;

    socket.join(roomId);
    socket.emit('room_created', { roomId, playerId: socket.id });
    broadcastState(roomId);
    console.log(`[Room] Created ${roomId} by ${playerName}`);
  });

  // Join an existing room
  socket.on('join_room', ({ roomId, playerName, token }) => {
    const code = roomId.toUpperCase().trim();
    const game = rooms[code];
    if (!game) return handleError(socket, 'Room not found.');
    if (game.gamePhase !== 'lobby') return handleError(socket, 'Game already started.');
    if (game.players.length >= 6) return handleError(socket, 'Room is full (max 6 players).');

    const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];
    const player = {
      id: socket.id,
      name: playerName || `Player ${game.players.length + 1}`,
      token: token || PLAYER_TOKENS[game.players.length % PLAYER_TOKENS.length].emoji,
      tokenId: token || PLAYER_TOKENS[game.players.length % PLAYER_TOKENS.length].id,
      money: game.settings.startingMoney,
      position: 0,
      inJail: false,
      jailTurns: 0,
      getOutOfJailCards: 0,
      isBankrupt: false,
      isHost: false,
      color: colors[game.players.length % colors.length],
    };

    game.players.push(player);
    playerRoom[socket.id] = code;
    socket.join(code);
    socket.emit('room_joined', { roomId: code, playerId: socket.id });
    broadcastState(code);
    console.log(`[Room] ${playerName} joined ${code}`);
  });

  // Update settings (host only)
  socket.on('update_settings', ({ settings }) => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;
    const player = game.players.find((p) => p.id === socket.id);
    if (!player?.isHost) return handleError(socket, 'Only host can change settings.');
    if (game.gamePhase !== 'lobby') return handleError(socket, 'Cannot change settings mid-game.');

    game.settings = { ...game.settings, ...settings, houseRules: { ...game.settings.houseRules, ...(settings.houseRules || {}) } };

    // Update player starting money display
    game.players.forEach((p) => { p.money = game.settings.startingMoney; });

    broadcastState(roomId);
    console.log(`[Settings] Updated in ${roomId}`);
  });

  // Start game (host only)
  socket.on('start_game', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;
    const player = game.players.find((p) => p.id === socket.id);
    if (!player?.isHost) return handleError(socket, 'Only host can start the game.');

    const result = engine.startGame(game);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
    io.to(roomId).emit('game_started');
    console.log(`[Game] Started in ${roomId}`);
  });

  // Roll dice
  socket.on('roll_dice', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performRollDice(game, socket.id);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Buy property
  socket.on('buy_property', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performBuyProperty(game, socket.id);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Pass on buying (may start auction)
  socket.on('pass_property', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performPassProperty(game, socket.id);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Bid in auction
  socket.on('bid_auction', ({ amount }) => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performBidAuction(game, socket.id, amount);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Pass in auction
  socket.on('pass_auction', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performPassAuction(game, socket.id);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Acknowledge card (community chest / chance)
  socket.on('acknowledge_card', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performAcknowledgeCard(game, socket.id);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Pay to get out of jail
  socket.on('pay_jail', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performPayJail(game, socket.id);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Use jail card
  socket.on('use_jail_card', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performUseJailCard(game, socket.id);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Build house/hotel
  socket.on('build_house', ({ position }) => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performBuildHouse(game, socket.id, position);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Sell house/hotel
  socket.on('sell_house', ({ position }) => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performSellHouse(game, socket.id, position);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Mortgage property
  socket.on('mortgage', ({ position }) => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performMortgage(game, socket.id, position);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Unmortgage property
  socket.on('unmortgage', ({ position }) => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performUnmortgage(game, socket.id, position);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Propose trade
  socket.on('propose_trade', ({ toPlayerId, offer }) => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performProposeTrade(game, socket.id, toPlayerId, offer);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Respond to trade
  socket.on('respond_trade', ({ accept }) => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performRespondTrade(game, socket.id, accept);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Cancel pending trade
  socket.on('cancel_trade', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    if (game.pendingTrade && game.pendingTrade.fromPlayerId === socket.id) {
      game.pendingTrade = null;
      broadcastState(roomId);
    }
  });

  // Declare bankruptcy
  socket.on('declare_bankruptcy', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performDeclareBankruptcy(game, socket.id);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // End turn
  socket.on('end_turn', () => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const result = engine.performEndTurn(game, socket.id);
    if (!result.success) return handleError(socket, result.error);

    broadcastState(roomId);
  });

  // Restart game (host only)
  socket.on('restart_game', ({ settings }) => {
    const roomId = playerRoom[socket.id];
    const game = rooms[roomId];
    if (!game) return;

    const player = game.players.find((p) => p.id === socket.id);
    if (!player?.isHost) return handleError(socket, 'Only host can restart.');

    const newGame = engine.createGame(roomId, settings || game.settings);
    // Keep players
    game.players.forEach((p, i) => {
      const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];
      newGame.players.push({
        ...p,
        money: newGame.settings.startingMoney,
        position: 0,
        inJail: false,
        jailTurns: 0,
        getOutOfJailCards: 0,
        isBankrupt: false,
        color: colors[i % colors.length],
      });
    });
    rooms[roomId] = newGame;
    broadcastState(roomId);
    console.log(`[Game] Restarted in ${roomId}`);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    const roomId = playerRoom[socket.id];
    if (roomId) {
      const game = rooms[roomId];
      if (game) {
        const player = game.players.find((p) => p.id === socket.id);
        if (player) {
          player.disconnected = true;
          if (game.gamePhase === 'lobby') {
            game.players = game.players.filter((p) => p.id !== socket.id);
            // Reassign host if needed
            if (player.isHost && game.players.length > 0) {
              game.players[0].isHost = true;
            }
          }
          broadcastState(roomId);
        }
        // Clean up empty rooms
        if (game.players.filter((p) => !p.disconnected).length === 0) {
          delete rooms[roomId];
          console.log(`[Room] ${roomId} deleted (all disconnected)`);
        }
      }
      delete playerRoom[socket.id];
    }
    console.log(`[-] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   Monopoly al-Sharq Server           ║
  ║   منوبولي الشرق                       ║
  ║   Running on port ${PORT}               ║
  ╚══════════════════════════════════════╝
  `);
});
