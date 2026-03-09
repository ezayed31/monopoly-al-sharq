const {
  BOARD_SQUARES,
  COLOR_GROUPS,
  AIRLINE_POSITIONS,
  UTILITY_POSITIONS,
  AIRLINE_RENT,
  CHANCE_CARDS,
  COMMUNITY_CHEST_CARDS,
} = require('./boardData');

// --- Helpers ---

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollDice() {
  const d1 = rollDie();
  const d2 = rollDie();
  return [d1, d2];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createInitialPropertyStates() {
  const states = {};
  BOARD_SQUARES.forEach((sq) => {
    if (sq.type === 'property' || sq.type === 'airline' || sq.type === 'utility') {
      states[sq.position] = {
        position: sq.position,
        ownerId: null,
        houses: 0,   // 0-4 houses or 5 = hotel
        mortgaged: false,
      };
    }
  });
  return states;
}

function createGame(roomId, settings) {
  return {
    roomId,
    gamePhase: 'lobby',
    players: [],
    currentPlayerIndex: 0,
    propertyStates: createInitialPropertyStates(),
    dice: [0, 0],
    doublesCount: 0,
    diceRolled: false,
    turnPhase: 'pre_roll', // pre_roll | post_roll | buying | auction | card | bankrupt
    chanceCards: shuffle(CHANCE_CARDS),
    chanceIndex: 0,
    communityChestCards: shuffle(COMMUNITY_CHEST_CARDS),
    communityChestIndex: 0,
    freeParking: 0,
    pendingCard: null,
    pendingBuy: null,     // position being offered for purchase
    auction: null,        // { position, bids: {playerId: amount}, currentBid, currentBidderId, passedPlayers }
    pendingTrade: null,
    log: [],
    settings: {
      startingMoney: 1500,
      goSalary: 200,
      incomeTax: 200,
      luxuryTax: 100,
      maxHouses: 4,
      maxTurnsIdle: 0,
      houseRules: {
        freeParkingJackpot: false,
        doubleOnGo: false,
        noRentInJail: true,
        auctionUnbought: true,
        bankruptToBank: false,
      },
      ...settings,
    },
  };
}

function addLog(game, message) {
  game.log = [message, ...game.log].slice(0, 100);
}

// --- Player helpers ---

function getPlayer(game, playerId) {
  return game.players.find((p) => p.id === playerId);
}

function getCurrentPlayer(game) {
  return game.players[game.currentPlayerIndex];
}

function getActivePlayers(game) {
  return game.players.filter((p) => !p.isBankrupt);
}

// --- Property helpers ---

function getPropertySquare(position) {
  return BOARD_SQUARES[position];
}

function getPropertyState(game, position) {
  return game.propertyStates[position];
}

function ownerOfProperty(game, position) {
  const state = game.propertyStates[position];
  if (!state || !state.ownerId) return null;
  return getPlayer(game, state.ownerId);
}

function playerOwnsColorGroup(game, playerId, colorGroup) {
  const groupPositions = COLOR_GROUPS[colorGroup]?.properties || [];
  return groupPositions.every((pos) => {
    const state = game.propertyStates[pos];
    return state && state.ownerId === playerId;
  });
}

function countAirlinesOwned(game, playerId) {
  return AIRLINE_POSITIONS.filter((pos) => {
    const state = game.propertyStates[pos];
    return state && state.ownerId === playerId;
  }).length;
}

function countUtilitiesOwned(game, playerId) {
  return UTILITY_POSITIONS.filter((pos) => {
    const state = game.propertyStates[pos];
    return state && state.ownerId === playerId;
  }).length;
}

function calculateRent(game, position, diceTotal) {
  const sq = BOARD_SQUARES[position];
  const state = game.propertyStates[position];
  if (!state || !state.ownerId || state.mortgaged) return 0;

  if (sq.type === 'property') {
    const ownsGroup = playerOwnsColorGroup(game, state.ownerId, sq.colorGroup);
    if (state.houses === 0) {
      // Base rent, doubled if monopoly
      return ownsGroup ? sq.rent[0] * 2 : sq.rent[0];
    }
    return sq.rent[state.houses]; // index 1-5 (1h-4h-hotel)
  }

  if (sq.type === 'airline') {
    const numOwned = countAirlinesOwned(game, state.ownerId);
    return AIRLINE_RENT[numOwned];
  }

  if (sq.type === 'utility') {
    const numOwned = countUtilitiesOwned(game, state.ownerId);
    return numOwned === 1 ? diceTotal * 4 : diceTotal * 10;
  }

  return 0;
}

// --- Money transactions ---

function transferMoney(game, fromPlayerId, toPlayerId, amount, fromBank = false, toBank = false) {
  if (!fromBank) {
    const from = getPlayer(game, fromPlayerId);
    if (from) from.money -= amount;
  }
  if (!toBank) {
    const to = getPlayer(game, toPlayerId);
    if (to) to.money += amount;
  }
  if (toBank && game.settings.houseRules.freeParkingJackpot) {
    game.freeParking += amount;
  }
}

// --- Movement ---

function movePlayerToPosition(game, player, targetPosition, collectGo = true) {
  const passed = targetPosition < player.position;
  player.position = targetPosition;
  if (passed && collectGo) {
    player.money += game.settings.goSalary;
    addLog(game, `${player.name} passed Yalla! and collected £${game.settings.goSalary}.`);
  }
}

function advancePlayer(game, player, spaces) {
  const newPos = (player.position + spaces) % 40;
  const passed = newPos < player.position;
  player.position = newPos;
  if (passed) {
    player.money += game.settings.goSalary;
    addLog(game, `${player.name} passed Yalla! and collected £${game.settings.goSalary}.`);
  }
  return newPos;
}

// Find nearest airline or utility ahead of player
function findNearestPosition(currentPos, type) {
  const positions = type === 'airline' ? AIRLINE_POSITIONS : UTILITY_POSITIONS;
  for (let i = 1; i <= 40; i++) {
    const pos = (currentPos + i) % 40;
    if (positions.includes(pos)) return pos;
  }
  return positions[0];
}

// --- Card processing ---

function drawCard(game, type) {
  if (type === 'chance') {
    const card = game.chanceCards[game.chanceIndex % game.chanceCards.length];
    game.chanceIndex++;
    return card;
  } else {
    const card = game.communityChestCards[game.communityChestIndex % game.communityChestCards.length];
    game.communityChestIndex++;
    return card;
  }
}

function processCard(game, playerId, card) {
  const player = getPlayer(game, playerId);
  const events = [];

  switch (card.action) {
    case 'move_to': {
      const target = card.target;
      const passed = target < player.position && target !== 0;
      const willPass = target <= player.position || (target === 0);
      movePlayerToPosition(game, player, target, card.collectGo);
      addLog(game, `${player.name}: ${card.text}`);
      events.push({ type: 'moved', position: target });
      // After moving, process the new square
      return processSquare(game, playerId, events);
    }
    case 'move_nearest': {
      const targetPos = findNearestPosition(player.position, card.target);
      const oldPos = player.position;
      movePlayerToPosition(game, player, targetPos, true);
      addLog(game, `${player.name} moves to nearest ${card.target} at position ${targetPos}.`);
      events.push({ type: 'moved', position: targetPos });
      if (card.target === 'airline') {
        // Double rent if owned
        const sq = BOARD_SQUARES[targetPos];
        const state = game.propertyStates[targetPos];
        if (state?.ownerId && state.ownerId !== playerId && !state.mortgaged) {
          const numOwned = countAirlinesOwned(game, state.ownerId);
          const rent = AIRLINE_RENT[numOwned] * 2;
          player.money -= rent;
          getPlayer(game, state.ownerId).money += rent;
          addLog(game, `${player.name} pays double airline rent £${rent}.`);
          events.push({ type: 'rent_paid', amount: rent, to: state.ownerId });
        } else if (!state?.ownerId) {
          game.pendingBuy = targetPos;
          game.turnPhase = 'buying';
          events.push({ type: 'offer_buy', position: targetPos });
        }
      } else {
        return processSquare(game, playerId, events);
      }
      return events;
    }
    case 'collect':
      player.money += card.amount;
      addLog(game, `${player.name} collects £${card.amount}. ${card.text}`);
      events.push({ type: 'collect', amount: card.amount });
      break;
    case 'pay':
      player.money -= card.amount;
      if (game.settings.houseRules.freeParkingJackpot) {
        game.freeParking += card.amount;
      }
      addLog(game, `${player.name} pays £${card.amount}. ${card.text}`);
      events.push({ type: 'pay', amount: card.amount });
      break;
    case 'jail_free':
      player.getOutOfJailCards++;
      addLog(game, `${player.name} gets a Get Out of Al-Sijn Free card!`);
      events.push({ type: 'jail_free' });
      break;
    case 'go_to_jail':
      sendToJail(game, player);
      addLog(game, `${player.name} is sent to Al-Sijn!`);
      events.push({ type: 'go_to_jail' });
      break;
    case 'move_back': {
      const newPos = ((player.position - card.amount) + 40) % 40;
      player.position = newPos;
      addLog(game, `${player.name} moves back ${card.amount} spaces.`);
      events.push({ type: 'moved', position: newPos });
      return processSquare(game, playerId, events);
    }
    case 'repairs': {
      let total = 0;
      Object.values(game.propertyStates).forEach((state) => {
        if (state.ownerId === playerId) {
          if (state.houses === 5) total += card.hotelAmount;
          else total += state.houses * card.houseAmount;
        }
      });
      player.money -= total;
      if (game.settings.houseRules.freeParkingJackpot) {
        game.freeParking += total;
      }
      addLog(game, `${player.name} pays £${total} for property repairs.`);
      events.push({ type: 'pay', amount: total });
      break;
    }
    case 'pay_players': {
      const activePlayers = getActivePlayers(game);
      const others = activePlayers.filter((p) => p.id !== playerId);
      const total = others.length * card.amount;
      player.money -= total;
      others.forEach((p) => { p.money += card.amount; });
      addLog(game, `${player.name} pays each player £${card.amount}.`);
      events.push({ type: 'pay', amount: total });
      break;
    }
    case 'collect_from_players': {
      const activePlayers = getActivePlayers(game);
      const others = activePlayers.filter((p) => p.id !== playerId);
      const total = others.length * card.amount;
      player.money += total;
      others.forEach((p) => { p.money -= card.amount; });
      addLog(game, `${player.name} collects £${card.amount} from each player.`);
      events.push({ type: 'collect', amount: total });
      break;
    }
  }

  return events;
}

// --- Jail ---

function sendToJail(game, player) {
  player.position = 10;
  player.inJail = true;
  player.jailTurns = 0;
}

// --- Square processing ---

function processSquare(game, playerId, events = []) {
  const player = getPlayer(game, playerId);
  const square = BOARD_SQUARES[player.position];

  switch (square.type) {
    case 'go':
      if (game.settings.houseRules.doubleOnGo) {
        player.money += game.settings.goSalary; // extra salary for landing
        addLog(game, `${player.name} lands on Yalla! and collects bonus £${game.settings.goSalary}!`);
      }
      break;

    case 'property':
    case 'airline':
    case 'utility': {
      const state = game.propertyStates[player.position];
      if (!state.ownerId) {
        // Offer to buy
        game.pendingBuy = player.position;
        game.turnPhase = 'buying';
        events.push({ type: 'offer_buy', position: player.position });
        return events;
      } else if (state.ownerId === playerId) {
        addLog(game, `${player.name} owns ${square.name}. No rent.`);
      } else if (state.mortgaged) {
        addLog(game, `${square.name} is mortgaged. No rent.`);
      } else {
        const owner = getPlayer(game, state.ownerId);
        if (owner && owner.inJail && game.settings.houseRules.noRentInJail) {
          addLog(game, `${owner.name} is in Al-Sijn and cannot collect rent.`);
          break;
        }
        const diceTotal = game.dice[0] + game.dice[1];
        const rent = calculateRent(game, player.position, diceTotal);
        player.money -= rent;
        if (owner) owner.money += rent;
        addLog(game, `${player.name} pays £${rent} rent to ${owner ? owner.name : 'bank'} for ${square.name}.`);
        events.push({ type: 'rent_paid', amount: rent, to: state.ownerId });
      }
      break;
    }

    case 'tax': {
      const amount = square.amount;
      player.money -= amount;
      if (game.settings.houseRules.freeParkingJackpot) {
        game.freeParking += amount;
      }
      addLog(game, `${player.name} pays ${square.name}: £${amount}.`);
      events.push({ type: 'pay', amount });
      break;
    }

    case 'go_to_jail':
      sendToJail(game, player);
      addLog(game, `${player.name} is sent to Al-Sijn!`);
      events.push({ type: 'go_to_jail' });
      break;

    case 'free_parking':
      if (game.settings.houseRules.freeParkingJackpot && game.freeParking > 0) {
        player.money += game.freeParking;
        addLog(game, `${player.name} collects the Oasis jackpot of £${game.freeParking}!`);
        events.push({ type: 'free_parking_jackpot', amount: game.freeParking });
        game.freeParking = 0;
      } else {
        addLog(game, `${player.name} rests at the Oasis.`);
      }
      break;

    case 'chance': {
      const card = drawCard(game, 'chance');
      game.pendingCard = { card, type: 'chance' };
      game.turnPhase = 'card';
      events.push({ type: 'draw_card', cardType: 'chance', card });
      return events;
    }

    case 'community_chest': {
      const card = drawCard(game, 'community_chest');
      game.pendingCard = { card, type: 'community_chest' };
      game.turnPhase = 'card';
      events.push({ type: 'draw_card', cardType: 'community_chest', card });
      return events;
    }

    case 'jail':
      addLog(game, `${player.name} is just visiting Al-Sijn.`);
      break;
  }

  return events;
}

// --- Main game actions ---

function startGame(game) {
  if (game.players.length < 2) return { success: false, error: 'Need at least 2 players.' };
  game.gamePhase = 'playing';
  game.currentPlayerIndex = 0;
  game.turnPhase = 'pre_roll';
  // Give starting money
  game.players.forEach((p) => {
    p.money = game.settings.startingMoney;
    p.position = 0;
    p.inJail = false;
    p.jailTurns = 0;
    p.getOutOfJailCards = 0;
    p.isBankrupt = false;
  });
  addLog(game, 'The game has started! Yalla!');
  return { success: true };
}

function performRollDice(game, playerId) {
  if (game.gamePhase !== 'playing') return { success: false, error: 'Game not in progress.' };
  const player = getCurrentPlayer(game);
  if (!player || player.id !== playerId) return { success: false, error: 'Not your turn.' };
  if (game.diceRolled) return { success: false, error: 'Already rolled.' };

  const [d1, d2] = rollDice();
  game.dice = [d1, d2];
  const total = d1 + d2;
  const isDoubles = d1 === d2;

  addLog(game, `${player.name} rolls ${d1} + ${d2} = ${total}${isDoubles ? ' (Doubles!)' : ''}.`);

  if (player.inJail) {
    if (isDoubles) {
      player.inJail = false;
      player.jailTurns = 0;
      addLog(game, `${player.name} rolls doubles and escapes Al-Sijn!`);
    } else {
      player.jailTurns++;
      if (player.jailTurns >= 3) {
        player.money -= 50;
        player.inJail = false;
        player.jailTurns = 0;
        addLog(game, `${player.name} pays £50 fine and is released from Al-Sijn.`);
      } else {
        addLog(game, `${player.name} stays in Al-Sijn (${player.jailTurns}/3 turns).`);
        game.diceRolled = true;
        game.doublesCount = 0;
        return { success: true, dice: [d1, d2], events: [] };
      }
    }
  }

  if (isDoubles) {
    game.doublesCount++;
    if (game.doublesCount >= 3) {
      sendToJail(game, player);
      game.diceRolled = true;
      game.doublesCount = 0;
      addLog(game, `${player.name} rolls 3 doubles and goes to Al-Sijn!`);
      return { success: true, dice: [d1, d2], events: [{ type: 'go_to_jail' }] };
    }
  } else {
    game.doublesCount = 0;
  }

  game.diceRolled = true;

  // Move player
  const newPos = advancePlayer(game, player, total);
  addLog(game, `${player.name} moves to ${BOARD_SQUARES[newPos].name}.`);

  const events = processSquare(game, playerId);

  return { success: true, dice: [d1, d2], events };
}

function performBuyProperty(game, playerId) {
  const player = getPlayer(game, playerId);
  if (!player || getCurrentPlayer(game).id !== playerId) return { success: false, error: 'Not your turn.' };
  if (game.turnPhase !== 'buying' || game.pendingBuy === null) return { success: false, error: 'No property to buy.' };

  const position = game.pendingBuy;
  const sq = BOARD_SQUARES[position];
  const state = game.propertyStates[position];

  if (state.ownerId) return { success: false, error: 'Already owned.' };
  if (player.money < sq.price) return { success: false, error: 'Not enough money.' };

  player.money -= sq.price;
  state.ownerId = playerId;
  game.pendingBuy = null;
  game.turnPhase = 'post_roll';
  addLog(game, `${player.name} buys ${sq.name} for £${sq.price}.`);

  return { success: true };
}

function performPassProperty(game, playerId) {
  const player = getPlayer(game, playerId);
  if (!player || getCurrentPlayer(game).id !== playerId) return { success: false, error: 'Not your turn.' };
  if (game.turnPhase !== 'buying' || game.pendingBuy === null) return { success: false, error: 'No property to buy.' };

  const position = game.pendingBuy;
  game.pendingBuy = null;

  if (game.settings.houseRules.auctionUnbought) {
    startAuction(game, position);
    return { success: true, auctionStarted: true };
  } else {
    game.turnPhase = 'post_roll';
    return { success: true };
  }
}

function startAuction(game, position) {
  const sq = BOARD_SQUARES[position];
  game.auction = {
    position,
    currentBid: 0,
    currentBidderId: null,
    passedPlayers: [],
  };
  game.turnPhase = 'auction';
  addLog(game, `Auction started for ${sq.name}! Minimum bid: £1.`);
}

function performBidAuction(game, playerId, amount) {
  if (!game.auction) return { success: false, error: 'No auction in progress.' };
  if (amount <= game.auction.currentBid) return { success: false, error: 'Bid must be higher than current bid.' };
  const player = getPlayer(game, playerId);
  if (!player || player.isBankrupt) return { success: false, error: 'Invalid player.' };
  if (player.money < amount) return { success: false, error: 'Not enough money.' };

  game.auction.currentBid = amount;
  game.auction.currentBidderId = playerId;
  addLog(game, `${player.name} bids £${amount} for ${BOARD_SQUARES[game.auction.position].name}.`);
  return { success: true };
}

function performPassAuction(game, playerId) {
  if (!game.auction) return { success: false, error: 'No auction.' };
  const player = getPlayer(game, playerId);
  if (!player) return { success: false, error: 'Invalid player.' };

  if (!game.auction.passedPlayers.includes(playerId)) {
    game.auction.passedPlayers.push(playerId);
  }

  const activePlayers = getActivePlayers(game);
  const remainingBidders = activePlayers.filter((p) => !game.auction.passedPlayers.includes(p.id));

  if (remainingBidders.length === 0 || (remainingBidders.length === 1 && game.auction.currentBidderId)) {
    // Auction ends
    if (game.auction.currentBidderId) {
      const winner = getPlayer(game, game.auction.currentBidderId);
      const state = game.propertyStates[game.auction.position];
      winner.money -= game.auction.currentBid;
      state.ownerId = game.auction.currentBidderId;
      addLog(game, `${winner.name} wins the auction for ${BOARD_SQUARES[game.auction.position].name} at £${game.auction.currentBid}!`);
    } else {
      addLog(game, `No bids placed. ${BOARD_SQUARES[game.auction.position].name} remains unsold.`);
    }
    game.auction = null;
    game.turnPhase = 'post_roll';
    return { success: true, auctionEnded: true };
  }

  addLog(game, `${player.name} passes on the auction.`);
  return { success: true };
}

function performAcknowledgeCard(game, playerId) {
  if (!game.pendingCard || getCurrentPlayer(game).id !== playerId) {
    return { success: false, error: 'No pending card.' };
  }
  const { card } = game.pendingCard;
  game.pendingCard = null;
  game.turnPhase = 'post_roll';

  const events = processCard(game, playerId, card);
  return { success: true, events };
}

function performPayJail(game, playerId) {
  const player = getPlayer(game, playerId);
  if (!player || !player.inJail) return { success: false, error: 'Not in jail.' };
  if (player.money < 50) return { success: false, error: 'Not enough money.' };

  player.money -= 50;
  player.inJail = false;
  player.jailTurns = 0;
  game.turnPhase = 'pre_roll';
  game.diceRolled = false;
  addLog(game, `${player.name} pays £50 to leave Al-Sijn.`);
  return { success: true };
}

function performUseJailCard(game, playerId) {
  const player = getPlayer(game, playerId);
  if (!player || !player.inJail) return { success: false, error: 'Not in jail.' };
  if (player.getOutOfJailCards < 1) return { success: false, error: 'No Get Out of Jail Free card.' };

  player.getOutOfJailCards--;
  player.inJail = false;
  player.jailTurns = 0;
  game.turnPhase = 'pre_roll';
  game.diceRolled = false;
  addLog(game, `${player.name} uses a Get Out of Al-Sijn Free card!`);
  return { success: true };
}

function performBuildHouse(game, playerId, position) {
  const player = getPlayer(game, playerId);
  if (!player || player.id !== playerId) return { success: false, error: 'Invalid player.' };

  const sq = BOARD_SQUARES[position];
  if (sq.type !== 'property') return { success: false, error: 'Not a property.' };

  const state = game.propertyStates[position];
  if (state.ownerId !== playerId) return { success: false, error: 'You do not own this property.' };
  if (!playerOwnsColorGroup(game, playerId, sq.colorGroup)) return { success: false, error: 'You must own the full color group.' };
  if (state.mortgaged) return { success: false, error: 'Property is mortgaged.' };
  if (state.houses >= 5) return { success: false, error: 'Already has a hotel.' };

  // Even build rule: can't have more houses than any other property in the group
  const groupPositions = COLOR_GROUPS[sq.colorGroup].properties;
  const minHouses = Math.min(...groupPositions.map((p) => game.propertyStates[p].houses));
  if (state.houses > minHouses) return { success: false, error: 'Must build evenly across group.' };

  const cost = sq.housePrice;
  if (player.money < cost) return { success: false, error: 'Not enough money.' };

  player.money -= cost;
  state.houses++;
  const label = state.houses === 5 ? 'hotel' : `${state.houses} house(s)`;
  addLog(game, `${player.name} builds a ${label} on ${sq.name} for £${cost}.`);
  return { success: true };
}

function performSellHouse(game, playerId, position) {
  const player = getPlayer(game, playerId);
  const sq = BOARD_SQUARES[position];
  const state = game.propertyStates[position];

  if (!player || state.ownerId !== playerId) return { success: false, error: 'Not your property.' };
  if (state.houses === 0) return { success: false, error: 'No houses to sell.' };

  // Even sell rule: can't have fewer houses than any other in group
  const groupPositions = COLOR_GROUPS[sq.colorGroup].properties;
  const maxHouses = Math.max(...groupPositions.map((p) => game.propertyStates[p].houses));
  if (state.houses < maxHouses) return { success: false, error: 'Must sell evenly across group.' };

  const refund = Math.floor(sq.housePrice / 2);
  player.money += refund;
  state.houses--;
  const label = state.houses === 0 ? 'all houses' : `down to ${state.houses}`;
  addLog(game, `${player.name} sells a house on ${sq.name} for £${refund}.`);
  return { success: true };
}

function performMortgage(game, playerId, position) {
  const player = getPlayer(game, playerId);
  const sq = BOARD_SQUARES[position];
  const state = game.propertyStates[position];

  if (!player || state.ownerId !== playerId) return { success: false, error: 'Not your property.' };
  if (state.mortgaged) return { success: false, error: 'Already mortgaged.' };
  if (state.houses > 0) return { success: false, error: 'Sell houses first.' };

  player.money += sq.mortgageValue;
  state.mortgaged = true;
  addLog(game, `${player.name} mortgages ${sq.name} for £${sq.mortgageValue}.`);
  return { success: true };
}

function performUnmortgage(game, playerId, position) {
  const player = getPlayer(game, playerId);
  const sq = BOARD_SQUARES[position];
  const state = game.propertyStates[position];

  if (!player || state.ownerId !== playerId) return { success: false, error: 'Not your property.' };
  if (!state.mortgaged) return { success: false, error: 'Not mortgaged.' };

  const cost = Math.floor(sq.mortgageValue * 1.1);
  if (player.money < cost) return { success: false, error: 'Not enough money.' };

  player.money -= cost;
  state.mortgaged = false;
  addLog(game, `${player.name} unmortgages ${sq.name} for £${cost}.`);
  return { success: true };
}

function performProposeTrade(game, fromPlayerId, toPlayerId, offer) {
  // offer: { fromMoney, toMoney, fromProperties, toProperties, fromJailCards, toJailCards }
  const from = getPlayer(game, fromPlayerId);
  const to = getPlayer(game, toPlayerId);
  if (!from || !to) return { success: false, error: 'Invalid players.' };

  game.pendingTrade = {
    id: Date.now().toString(),
    fromPlayerId,
    toPlayerId,
    offer,
    status: 'pending',
  };
  addLog(game, `${from.name} proposes a trade to ${to.name}.`);
  return { success: true };
}

function performRespondTrade(game, playerId, accept) {
  if (!game.pendingTrade) return { success: false, error: 'No pending trade.' };
  if (game.pendingTrade.toPlayerId !== playerId) return { success: false, error: 'Not your trade to respond to.' };

  if (!accept) {
    addLog(game, `Trade declined.`);
    game.pendingTrade = null;
    return { success: true };
  }

  const { fromPlayerId, toPlayerId, offer } = game.pendingTrade;
  const from = getPlayer(game, fromPlayerId);
  const to = getPlayer(game, toPlayerId);

  // Validate balances
  if (from.money < offer.fromMoney) return { success: false, error: 'Proposer lacks funds.' };
  if (to.money < offer.toMoney) return { success: false, error: 'Receiver lacks funds.' };

  // Money exchange
  from.money -= offer.fromMoney;
  from.money += offer.toMoney;
  to.money -= offer.toMoney;
  to.money += offer.fromMoney;

  // Property exchange
  (offer.fromProperties || []).forEach((pos) => {
    const state = game.propertyStates[pos];
    if (state) state.ownerId = toPlayerId;
  });
  (offer.toProperties || []).forEach((pos) => {
    const state = game.propertyStates[pos];
    if (state) state.ownerId = fromPlayerId;
  });

  // Jail cards
  const fromJail = offer.fromJailCards || 0;
  const toJail = offer.toJailCards || 0;
  from.getOutOfJailCards -= fromJail;
  from.getOutOfJailCards += toJail;
  to.getOutOfJailCards -= toJail;
  to.getOutOfJailCards += fromJail;

  addLog(game, `Trade completed between ${from.name} and ${to.name}.`);
  game.pendingTrade = null;
  return { success: true };
}

function performDeclareBankruptcy(game, playerId) {
  const player = getPlayer(game, playerId);
  if (!player) return { success: false, error: 'Invalid player.' };

  player.isBankrupt = true;

  // Return properties to bank (or to creditor if setting)
  Object.values(game.propertyStates).forEach((state) => {
    if (state.ownerId === playerId) {
      state.ownerId = null;
      state.houses = 0;
      state.mortgaged = false;
    }
  });

  // Return jail free cards
  player.getOutOfJailCards = 0;
  player.money = 0;

  addLog(game, `${player.name} has declared bankruptcy! All their properties return to the bank.`);

  // Check for winner
  const activePlayers = getActivePlayers(game);
  if (activePlayers.length === 1) {
    game.gamePhase = 'ended';
    game.winner = activePlayers[0];
    addLog(game, `${activePlayers[0].name} wins the game! Mabrook!`);
    return { success: true, gameOver: true, winner: activePlayers[0] };
  }

  // Advance turn if it was the bankrupt player's turn
  if (getCurrentPlayer(game).id === playerId) {
    advanceTurn(game);
  }

  return { success: true };
}

function performEndTurn(game, playerId) {
  if (getCurrentPlayer(game)?.id !== playerId) return { success: false, error: 'Not your turn.' };
  if (!game.diceRolled) return { success: false, error: 'Must roll dice first.' };
  if (game.turnPhase === 'buying') return { success: false, error: 'Must decide on property first.' };
  if (game.turnPhase === 'auction') return { success: false, error: 'Auction in progress.' };
  if (game.turnPhase === 'card') return { success: false, error: 'Must acknowledge card first.' };

  const player = getCurrentPlayer(game);
  const isDoubles = game.dice[0] === game.dice[1];

  if (isDoubles && !player.inJail && game.doublesCount > 0) {
    // Player gets another turn for doubles
    game.diceRolled = false;
    game.turnPhase = 'pre_roll';
    addLog(game, `${player.name} rolled doubles and gets another turn!`);
    return { success: true };
  }

  advanceTurn(game);
  return { success: true };
}

function advanceTurn(game) {
  game.doublesCount = 0;
  game.diceRolled = false;
  game.dice = [0, 0];
  game.turnPhase = 'pre_roll';
  game.pendingBuy = null;
  game.pendingCard = null;

  // Find next non-bankrupt player
  let nextIndex = (game.currentPlayerIndex + 1) % game.players.length;
  let iterations = 0;
  while (game.players[nextIndex].isBankrupt && iterations < game.players.length) {
    nextIndex = (nextIndex + 1) % game.players.length;
    iterations++;
  }
  game.currentPlayerIndex = nextIndex;
  addLog(game, `It is now ${game.players[nextIndex].name}'s turn.`);
}

function getNetWorth(game, playerId) {
  const player = getPlayer(game, playerId);
  let worth = player.money;
  Object.values(game.propertyStates).forEach((state) => {
    if (state.ownerId === playerId) {
      const sq = BOARD_SQUARES[state.position];
      worth += state.mortgaged ? 0 : sq.mortgageValue;
      worth += state.houses * Math.floor(sq.housePrice / 2);
    }
  });
  return worth;
}

module.exports = {
  createGame,
  startGame,
  performRollDice,
  performBuyProperty,
  performPassProperty,
  performBidAuction,
  performPassAuction,
  performAcknowledgeCard,
  performPayJail,
  performUseJailCard,
  performBuildHouse,
  performSellHouse,
  performMortgage,
  performUnmortgage,
  performProposeTrade,
  performRespondTrade,
  performDeclareBankruptcy,
  performEndTurn,
  getNetWorth,
};
