export type ColorGroup = 'brown' | 'lightblue' | 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'darkblue';
export type SquareType = 'go' | 'property' | 'community_chest' | 'chance' | 'tax' | 'airline' | 'utility' | 'jail' | 'free_parking' | 'go_to_jail';
export type TurnPhase = 'pre_roll' | 'post_roll' | 'buying' | 'auction' | 'card' | 'bankrupt';
export type GamePhase = 'lobby' | 'playing' | 'ended';

export interface BoardSquare {
  position: number;
  type: SquareType;
  name: string;
  nameAr: string;
  description?: string;
  city?: string;
  colorGroup?: ColorGroup;
  price?: number;
  rent?: number[];
  housePrice?: number;
  mortgageValue?: number;
  amount?: number; // for tax squares
}

export interface PropertyState {
  position: number;
  ownerId: string | null;
  houses: number; // 0-4 houses, 5 = hotel
  mortgaged: boolean;
}

export interface Player {
  id: string;
  name: string;
  token: string;
  tokenId: string;
  money: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  getOutOfJailCards: number;
  isBankrupt: boolean;
  isHost: boolean;
  color: string;
  disconnected?: boolean;
}

export interface Card {
  id: string;
  text: string;
  action: string;
  target?: number | string;
  amount?: number;
  collectGo?: boolean;
  houseAmount?: number;
  hotelAmount?: number;
}

export interface Auction {
  position: number;
  currentBid: number;
  currentBidderId: string | null;
  passedPlayers: string[];
}

export interface TradeOffer {
  fromMoney: number;
  toMoney: number;
  fromProperties: number[];
  toProperties: number[];
  fromJailCards: number;
  toJailCards: number;
}

export interface PendingTrade {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  offer: TradeOffer;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface HouseRules {
  freeParkingJackpot: boolean;
  doubleOnGo: boolean;
  noRentInJail: boolean;
  auctionUnbought: boolean;
  bankruptToBank: boolean;
}

export interface GameSettings {
  startingMoney: number;
  goSalary: number;
  incomeTax: number;
  luxuryTax: number;
  maxHouses: number;
  maxTurnsIdle: number;
  houseRules: HouseRules;
}

export interface GameState {
  roomId: string;
  gamePhase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  propertyStates: Record<number, PropertyState>;
  dice: [number, number];
  doublesCount: number;
  diceRolled: boolean;
  turnPhase: TurnPhase;
  freeParking: number;
  pendingCard: { card: Card; type: 'chance' | 'community_chest' } | null;
  pendingBuy: number | null;
  auction: Auction | null;
  pendingTrade: PendingTrade | null;
  log: string[];
  settings: GameSettings;
  winner?: Player;
}

export interface PlayerToken {
  id: string;
  emoji: string;
  name: string;
}

export const COLOR_GROUP_STYLES: Record<ColorGroup, { bg: string; text: string; border: string }> = {
  brown: { bg: '#8B4513', text: '#fff', border: '#5D2E0C' },
  lightblue: { bg: '#87CEEB', text: '#333', border: '#4DA6CD' },
  pink: { bg: '#FF69B4', text: '#fff', border: '#D44A8B' },
  orange: { bg: '#FFA500', text: '#fff', border: '#CC8400' },
  red: { bg: '#DC143C', text: '#fff', border: '#A01030' },
  yellow: { bg: '#FFD700', text: '#333', border: '#CCA800' },
  green: { bg: '#228B22', text: '#fff', border: '#155715' },
  darkblue: { bg: '#00008B', text: '#fff', border: '#000060' },
};

export const BOARD_SQUARES: BoardSquare[] = [
  { position: 0,  type: 'go',            name: 'Yalla!',             nameAr: 'يلا!',              description: 'Collect £200 salary as you pass.' },
  // Brown — Illinois Suburbs
  { position: 1,  type: 'property', name: 'Bridgeview',    nameAr: 'بريدجفيو',       city: 'Illinois',    colorGroup: 'brown',    price: 60,  rent: [2,  10,  30,  90,  160,  250],  housePrice: 50,  mortgageValue: 30  },
  { position: 2,  type: 'property', name: 'Orland Park',   nameAr: 'أورلاند بارك',   city: 'Illinois',    colorGroup: 'brown',    price: 70,  rent: [3,  14,  42,  125, 220,  350],  housePrice: 50,  mortgageValue: 35  },
  { position: 3,  type: 'property', name: 'Mokena',        nameAr: 'موكينا',          city: 'Illinois',    colorGroup: 'brown',    price: 80,  rent: [4,  20,  60,  180, 320,  450],  housePrice: 50,  mortgageValue: 40  },
  { position: 4,  type: 'tax',           name: 'Zakat',              nameAr: 'زكاة',              amount: 200, description: 'Pay £200 or 10% of net worth.' },
  { position: 5,  type: 'airline',       name: 'Emirates Airways',   nameAr: 'طيران الإمارات',    price: 200, mortgageValue: 100 },
  // Light Blue — Palestine (4 adjacent)
  { position: 6,  type: 'property', name: 'Beitunia',      nameAr: 'بيتونيا',         city: 'Palestine',   colorGroup: 'lightblue', price: 100, rent: [6,  30,  90,  270, 400,  550],  housePrice: 50,  mortgageValue: 50  },
  { position: 7,  type: 'property', name: 'Ramallah',      nameAr: 'رام الله',        city: 'Palestine',   colorGroup: 'lightblue', price: 100, rent: [6,  30,  90,  270, 400,  550],  housePrice: 50,  mortgageValue: 50  },
  { position: 8,  type: 'property', name: 'Beit Hanina',   nameAr: 'بيت حنينا',       city: 'Palestine',   colorGroup: 'lightblue', price: 120, rent: [8,  40,  100, 300, 450,  600],  housePrice: 50,  mortgageValue: 60  },
  { position: 9,  type: 'property', name: 'Turmusayya',    nameAr: 'ترمسعيا',         city: 'Palestine',   colorGroup: 'lightblue', price: 140, rent: [10, 50,  150, 450, 625,  750],  housePrice: 50,  mortgageValue: 70  },
  { position: 10, type: 'jail',          name: 'Al-Sijn',            nameAr: 'السجن',             description: 'Just Visiting / In Al-Sijn' },
  // Pink — Chicago Streets
  { position: 11, type: 'property', name: 'Harlem Ave',    nameAr: 'هارلم',           city: 'Chicago',     colorGroup: 'pink',     price: 140, rent: [10, 50,  150, 450, 625,  750],  housePrice: 100, mortgageValue: 70  },
  { position: 12, type: 'utility',       name: 'Oil Well',           nameAr: 'بئر النفط',         price: 150, mortgageValue: 75 },
  { position: 13, type: 'property', name: '87th St',       nameAr: 'شارع 87',         city: 'Chicago',     colorGroup: 'pink',     price: 140, rent: [10, 50,  150, 450, 625,  750],  housePrice: 100, mortgageValue: 70  },
  { position: 14, type: 'property', name: 'LaGrange',      nameAr: 'لاغرانج',         city: 'Illinois',    colorGroup: 'pink',     price: 160, rent: [12, 60,  180, 500, 700,  900],  housePrice: 100, mortgageValue: 80  },
  { position: 15, type: 'airline',       name: 'Qatar Airways',      nameAr: 'الخطوط القطرية',    price: 200, mortgageValue: 100 },
  // Orange — USA Cities
  { position: 16, type: 'property', name: 'Dearborn',      nameAr: 'ديربورن',         city: 'Michigan',    colorGroup: 'orange',   price: 180, rent: [14, 70,  200, 550, 750,  950],  housePrice: 100, mortgageValue: 90  },
  { position: 17, type: 'community_chest', name: 'Sadaqah', nameAr: 'صدقة' },
  { position: 18, type: 'property', name: 'Anaheim',       nameAr: 'أنهايم',          city: 'California',  colorGroup: 'orange',   price: 180, rent: [14, 70,  200, 550, 750,  950],  housePrice: 100, mortgageValue: 90  },
  { position: 19, type: 'property', name: 'Dallas',        nameAr: 'دالاس',           city: 'Texas',       colorGroup: 'orange',   price: 200, rent: [16, 80,  220, 600, 800,  1000], housePrice: 100, mortgageValue: 100 },
  { position: 20, type: 'free_parking',  name: 'Al-Waha',            nameAr: 'الواحة',            description: 'Free Parking - Rest at the Oasis' },
  // Red — Coffee Shops
  { position: 21, type: 'property', name: 'Jazwah',        nameAr: 'جزوة',            city: 'Coffee Shops', colorGroup: 'red',     price: 220, rent: [18, 90,  250, 700, 875,  1050], housePrice: 150, mortgageValue: 110 },
  { position: 22, type: 'chance',        name: 'Inshallah',          nameAr: 'إن شاء الله' },
  { position: 23, type: 'property', name: 'The Kahba',     nameAr: 'الكحبة',          city: 'Coffee Shops', colorGroup: 'red',     price: 220, rent: [18, 90,  250, 700, 875,  1050], housePrice: 150, mortgageValue: 110 },
  { position: 24, type: 'property', name: 'Sada',          nameAr: 'صادة',            city: 'Coffee Shops', colorGroup: 'red',     price: 240, rent: [20, 100, 300, 750, 925,  1100], housePrice: 150, mortgageValue: 120 },
  { position: 25, type: 'airline',       name: 'Etihad Airways',     nameAr: 'طيران الاتحاد',     price: 200, mortgageValue: 100 },
  // Yellow — Islamic Centers
  { position: 26, type: 'property', name: 'Mosque Foundation', nameAr: 'مؤسسة المسجد', city: 'Bridgeview', colorGroup: 'yellow',  price: 260, rent: [22, 110, 330, 800, 975,  1150], housePrice: 150, mortgageValue: 130 },
  { position: 27, type: 'property', name: 'OPPC',          nameAr: 'مركز الأبطال',    city: 'Bridgeview',  colorGroup: 'yellow',  price: 260, rent: [22, 110, 330, 800, 975,  1150], housePrice: 150, mortgageValue: 130 },
  { position: 28, type: 'utility',       name: 'Desalination Plant', nameAr: 'محطة التحلية',      price: 150, mortgageValue: 75 },
  { position: 29, type: 'property', name: 'Mecca Center',   nameAr: 'مركز مكة',        city: 'Bridgeview',  colorGroup: 'yellow',  price: 280, rent: [24, 120, 360, 850, 1025, 1200], housePrice: 150, mortgageValue: 140 },
  { position: 30, type: 'go_to_jail',    name: 'To Al-Sijn!',        nameAr: 'إلى السجن!' },
  // Green — The Homes
  { position: 31, type: 'property', name: "Hamooda's House", nameAr: 'بيت حمودة',     city: 'Chicagoland', colorGroup: 'green',   price: 300, rent: [26, 130, 390, 900, 1100, 1275], housePrice: 200, mortgageValue: 150 },
  { position: 32, type: 'property', name: "Swag's House",   nameAr: 'بيت سواج',       city: 'Chicagoland', colorGroup: 'green',   price: 300, rent: [26, 130, 390, 900, 1100, 1275], housePrice: 200, mortgageValue: 150 },
  { position: 33, type: 'property', name: 'DePaul',         nameAr: 'دي بول',          city: 'Chicago',     colorGroup: 'darkblue', price: 300, rent: [26, 130, 390, 900, 1100, 1275], housePrice: 200, mortgageValue: 150 },
  { position: 34, type: 'property', name: "The Zayed's House", nameAr: 'بيت الزايد',  city: 'Chicagoland', colorGroup: 'green',   price: 320, rent: [28, 150, 450, 1000, 1200, 1400], housePrice: 200, mortgageValue: 160 },
  { position: 35, type: 'airline',       name: 'Air Arabia',         nameAr: 'العربية للطيران',   price: 200, mortgageValue: 100 },
  { position: 36, type: 'chance',        name: 'Inshallah',          nameAr: 'إن شاء الله' },
  // Dark Blue — Colleges
  { position: 37, type: 'property', name: 'Moraine Valley', nameAr: 'موراين فالي',    city: 'Chicago',     colorGroup: 'darkblue', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], housePrice: 200, mortgageValue: 175 },
  { position: 38, type: 'tax',           name: 'Customs Duty',       nameAr: 'رسوم جمركية',       amount: 100, description: 'Pay £100 luxury tax.' },
  { position: 39, type: 'property', name: 'UIC',            nameAr: 'جامعة إلينوي',    city: 'Chicago',     colorGroup: 'darkblue', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], housePrice: 200, mortgageValue: 200 },
];

export const PLAYER_TOKENS: PlayerToken[] = [
  { id: 'camel',   emoji: '🐪', name: 'Camel' },
  { id: 'mosque',  emoji: '🕌', name: 'Mosque' },
  { id: 'star',    emoji: '⭐', name: 'Star' },
  { id: 'lantern', emoji: '🏮', name: 'Lantern' },
  { id: 'diamond', emoji: '💎', name: 'Diamond' },
  { id: 'plane',   emoji: '✈️', name: 'Plane' },
];

export const COLOR_GROUPS: Record<ColorGroup, { properties: number[]; housePrice: number }> = {
  brown:     { properties: [1, 2, 3],       housePrice: 50  },
  lightblue: { properties: [6, 7, 8, 9],    housePrice: 50  },
  pink:      { properties: [11, 13, 14],    housePrice: 100 },
  orange:    { properties: [16, 18, 19],    housePrice: 100 },
  red:       { properties: [21, 23, 24],    housePrice: 150 },
  yellow:    { properties: [26, 27, 29],    housePrice: 150 },
  green:     { properties: [31, 32, 34],    housePrice: 200 },
  darkblue:  { properties: [33, 37, 39],    housePrice: 200 },
};
