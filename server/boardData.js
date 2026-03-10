// Monopoly al-Sharq — Board Data

const BOARD_SQUARES = [
  // Position 0
  { position: 0, type: 'go', name: 'Yalla!', nameAr: 'يلا!', description: 'Collect £200 salary as you pass.' },

  // Position 1-3 — Brown: Illinois Suburbs
  { position: 1, type: 'property', name: 'Bridgeview', nameAr: 'بريدجفيو', city: 'Illinois', colorGroup: 'brown',
    price: 60, rent: [2, 10, 30, 90, 160, 250], housePrice: 50, mortgageValue: 30 },

  { position: 2, type: 'property', name: 'Orland Park', nameAr: 'أورلاند بارك', city: 'Illinois', colorGroup: 'brown',
    price: 70, rent: [3, 14, 42, 125, 220, 350], housePrice: 50, mortgageValue: 35 },

  { position: 3, type: 'property', name: 'Mokena', nameAr: 'موكينا', city: 'Illinois', colorGroup: 'brown',
    price: 80, rent: [4, 20, 60, 180, 320, 450], housePrice: 50, mortgageValue: 40 },

  // Position 4
  { position: 4, type: 'tax', name: 'Zakat', nameAr: 'زكاة', amount: 200, description: 'Pay £200 or 10% of net worth.' },

  // Position 5 — Airline
  { position: 5, type: 'airline', name: 'Emirates Airways', nameAr: 'طيران الإمارات', price: 200, mortgageValue: 100 },

  // Position 6-9 — Light Blue: Palestine (4 adjacent properties)
  { position: 6, type: 'property', name: 'Beitunia', nameAr: 'بيتونيا', city: 'Palestine', colorGroup: 'lightblue',
    price: 100, rent: [6, 30, 90, 270, 400, 550], housePrice: 50, mortgageValue: 50 },

  { position: 7, type: 'property', name: 'Ramallah', nameAr: 'رام الله', city: 'Palestine', colorGroup: 'lightblue',
    price: 100, rent: [6, 30, 90, 270, 400, 550], housePrice: 50, mortgageValue: 50 },

  { position: 8, type: 'property', name: 'Beit Hanina', nameAr: 'بيت حنينا', city: 'Palestine', colorGroup: 'lightblue',
    price: 120, rent: [8, 40, 100, 300, 450, 600], housePrice: 50, mortgageValue: 60 },

  { position: 9, type: 'property', name: 'Turmusayya', nameAr: 'ترمسعيا', city: 'Palestine', colorGroup: 'lightblue',
    price: 140, rent: [10, 50, 150, 450, 625, 750], housePrice: 50, mortgageValue: 70 },

  // Position 10 — Jail
  { position: 10, type: 'jail', name: 'Al-Sijn', nameAr: 'السجن', description: 'Just Visiting / In Al-Sijn' },

  // Position 11-14 — Pink: Chicago Streets
  { position: 11, type: 'property', name: 'Harlem Ave', nameAr: 'هارلم', city: 'Chicago', colorGroup: 'pink',
    price: 140, rent: [10, 50, 150, 450, 625, 750], housePrice: 100, mortgageValue: 70 },

  // Position 12 — Utility
  { position: 12, type: 'utility', name: 'Oil Well', nameAr: 'بئر النفط', price: 150, mortgageValue: 75 },

  { position: 13, type: 'property', name: '87th St', nameAr: 'شارع 87', city: 'Chicago', colorGroup: 'pink',
    price: 140, rent: [10, 50, 150, 450, 625, 750], housePrice: 100, mortgageValue: 70 },

  { position: 14, type: 'property', name: 'LaGrange', nameAr: 'لاغرانج', city: 'Illinois', colorGroup: 'pink',
    price: 160, rent: [12, 60, 180, 500, 700, 900], housePrice: 100, mortgageValue: 80 },

  // Position 15 — Airline
  { position: 15, type: 'airline', name: 'Qatar Airways', nameAr: 'الخطوط القطرية', price: 200, mortgageValue: 100 },

  // Position 16-19 — Orange: USA Cities
  { position: 16, type: 'property', name: 'Dearborn', nameAr: 'ديربورن', city: 'Michigan', colorGroup: 'orange',
    price: 180, rent: [14, 70, 200, 550, 750, 950], housePrice: 100, mortgageValue: 90 },

  // Position 17 — Community Chest
  { position: 17, type: 'community_chest', name: 'Sadaqah', nameAr: 'صدقة' },

  { position: 18, type: 'property', name: 'Anaheim', nameAr: 'أنهايم', city: 'California', colorGroup: 'orange',
    price: 180, rent: [14, 70, 200, 550, 750, 950], housePrice: 100, mortgageValue: 90 },

  { position: 19, type: 'property', name: 'Dallas', nameAr: 'دالاس', city: 'Texas', colorGroup: 'orange',
    price: 200, rent: [16, 80, 220, 600, 800, 1000], housePrice: 100, mortgageValue: 100 },

  // Position 20 — Free Parking
  { position: 20, type: 'free_parking', name: 'Al-Waha', nameAr: 'الواحة', description: 'Free Parking - Rest at the Oasis' },

  // Position 21-24 — Red: Gulf
  { position: 21, type: 'property', name: 'Jazwah', nameAr: 'جزوة', city: 'Saudi Arabia', colorGroup: 'red',
    price: 220, rent: [18, 90, 250, 700, 875, 1050], housePrice: 150, mortgageValue: 110 },

  // Position 22 — Chance
  { position: 22, type: 'chance', name: 'Inshallah', nameAr: 'إن شاء الله' },

  { position: 23, type: 'property', name: 'The Kahba', nameAr: 'الكحبة', city: 'Saudi Arabia', colorGroup: 'red',
    price: 220, rent: [18, 90, 250, 700, 875, 1050], housePrice: 150, mortgageValue: 110 },

  { position: 24, type: 'property', name: 'Sada', nameAr: 'صادة', city: 'Saudi Arabia', colorGroup: 'red',
    price: 240, rent: [20, 100, 300, 750, 925, 1100], housePrice: 150, mortgageValue: 120 },

  // Position 25 — Airline
  { position: 25, type: 'airline', name: 'Etihad Airways', nameAr: 'طيران الاتحاد', price: 200, mortgageValue: 100 },

  // Position 26-29 — Yellow: Islamic Centers
  { position: 26, type: 'property', name: 'Mosque Foundation', nameAr: 'مؤسسة المسجد', city: 'Bridgeview', colorGroup: 'yellow',
    price: 260, rent: [22, 110, 330, 800, 975, 1150], housePrice: 150, mortgageValue: 130 },

  { position: 27, type: 'property', name: 'OPPC', nameAr: 'مركز الأبطال', city: 'Bridgeview', colorGroup: 'yellow',
    price: 260, rent: [22, 110, 330, 800, 975, 1150], housePrice: 150, mortgageValue: 130 },

  // Position 28 — Utility
  { position: 28, type: 'utility', name: 'Desalination Plant', nameAr: 'محطة التحلية', price: 150, mortgageValue: 75 },

  { position: 29, type: 'property', name: 'Mecca Center', nameAr: 'مركز مكة', city: 'Bridgeview', colorGroup: 'yellow',
    price: 280, rent: [24, 120, 360, 850, 1025, 1200], housePrice: 150, mortgageValue: 140 },

  // Position 30 — Go To Jail
  { position: 30, type: 'go_to_jail', name: 'To Al-Sijn!', nameAr: 'إلى السجن!' },

  // Position 31-34 — Green: The Homes
  { position: 31, type: 'property', name: "Hamooda's House", nameAr: 'بيت حمودة', city: 'Chicagoland', colorGroup: 'green',
    price: 300, rent: [26, 130, 390, 900, 1100, 1275], housePrice: 200, mortgageValue: 150 },

  { position: 32, type: 'property', name: "Swag's House", nameAr: 'بيت سواج', city: 'Chicagoland', colorGroup: 'green',
    price: 300, rent: [26, 130, 390, 900, 1100, 1275], housePrice: 200, mortgageValue: 150 },

  // Position 33 — Community Chest
  { position: 33, type: 'community_chest', name: 'Sadaqah', nameAr: 'صدقة' },

  { position: 34, type: 'property', name: "The Zayed's House", nameAr: 'بيت الزايد', city: 'Chicagoland', colorGroup: 'green',
    price: 320, rent: [28, 150, 450, 1000, 1200, 1400], housePrice: 200, mortgageValue: 160 },

  // Position 35 — Airline
  { position: 35, type: 'airline', name: 'Air Arabia', nameAr: 'العربية للطيران', price: 200, mortgageValue: 100 },

  // Position 36 — Chance
  { position: 36, type: 'chance', name: 'Inshallah', nameAr: 'إن شاء الله' },

  // Position 37-39 — Dark Blue: Colleges
  { position: 37, type: 'property', name: 'Moraine Valley', nameAr: 'موراين فالي', city: 'Chicago', colorGroup: 'darkblue',
    price: 350, rent: [35, 175, 500, 1100, 1300, 1500], housePrice: 200, mortgageValue: 175 },

  // Position 38 — Tax
  { position: 38, type: 'tax', name: 'Customs Duty', nameAr: 'رسوم جمركية', amount: 100, description: 'Pay £100 luxury tax.' },

  { position: 39, type: 'property', name: 'UIC', nameAr: 'جامعة إلينوي', city: 'Chicago', colorGroup: 'darkblue',
    price: 400, rent: [50, 200, 600, 1400, 1700, 2000], housePrice: 200, mortgageValue: 200 },
];

// Group properties
const COLOR_GROUPS = {
  brown:    { properties: [1, 2, 3],       housePrice: 50,  color: '#8B4513' },
  lightblue:{ properties: [6, 7, 8, 9],    housePrice: 50,  color: '#87CEEB' },
  pink:     { properties: [11, 13, 14],    housePrice: 100, color: '#FF69B4' },
  orange:   { properties: [16, 18, 19],    housePrice: 100, color: '#FFA500' },
  red:      { properties: [21, 23, 24],    housePrice: 150, color: '#FF0000' },
  yellow:   { properties: [26, 27, 29],    housePrice: 150, color: '#FFD700' },
  green:    { properties: [31, 32, 34],    housePrice: 200, color: '#008000' },
  darkblue: { properties: [37, 39],        housePrice: 200, color: '#00008B' },
};

const AIRLINE_POSITIONS = [5, 15, 25, 35];
const UTILITY_POSITIONS = [12, 28];

// Airline rent: 25, 50, 100, 200 (based on number owned)
const AIRLINE_RENT = [0, 25, 50, 100, 200];

// Chance Cards (Inshallah)
const CHANCE_CARDS = [
  { id: 'ch1',  text: 'Advance to Yalla! (GO). Collect £200.', action: 'move_to', target: 0, collectGo: true },
  { id: 'ch2',  text: 'Advance to Moraine Valley. If you pass GO, collect £200.', action: 'move_to', target: 37, collectGo: true },
  { id: 'ch3',  text: 'Advance to UIC. If you pass GO, collect £200.', action: 'move_to', target: 39, collectGo: true },
  { id: 'ch4',  text: 'Advance to Emirates Airways. If you pass GO, collect £200.', action: 'move_to', target: 5, collectGo: true },
  { id: 'ch5',  text: 'Advance to nearest Airline. Pay double rent if unowned.', action: 'move_nearest', target: 'airline' },
  { id: 'ch6',  text: 'Advance to nearest Utility. If unowned, buy it. If owned, pay 10× dice.', action: 'move_nearest', target: 'utility' },
  { id: 'ch7',  text: 'The community rewards your generosity. Bank pays you £50.', action: 'collect', amount: 50 },
  { id: 'ch8',  text: 'Get Out of Al-Sijn Free. Keep this card until needed.', action: 'jail_free' },
  { id: 'ch9',  text: 'Go back 3 spaces.', action: 'move_back', amount: 3 },
  { id: 'ch10', text: 'Go directly to Al-Sijn. Do not pass GO. Do not collect £200.', action: 'go_to_jail' },
  { id: 'ch11', text: 'Make general repairs on your properties: £25 per house, £100 per hotel.', action: 'repairs', houseAmount: 25, hotelAmount: 100 },
  { id: 'ch12', text: 'Pay the toll — £15.', action: 'pay', amount: 15 },
  { id: 'ch13', text: 'Take a journey to Qatar Airways. If you pass GO, collect £200.', action: 'move_to', target: 15, collectGo: true },
  { id: 'ch14', text: 'Advance to Bridgeview. If you pass GO, collect £200.', action: 'move_to', target: 1, collectGo: true },
  { id: 'ch15', text: 'You have been elected community president. Pay each player £50.', action: 'pay_players', amount: 50 },
  { id: 'ch16', text: 'Your investment matures. Collect £150.', action: 'collect', amount: 150 },
];

// Community Chest Cards (Sadaqah)
const COMMUNITY_CHEST_CARDS = [
  { id: 'cc1',  text: 'Advance to Yalla! (GO). Collect £200.', action: 'move_to', target: 0, collectGo: true },
  { id: 'cc2',  text: 'Bank error in your favor. Collect £200.', action: 'collect', amount: 200 },
  { id: 'cc3',  text: 'Doctor\'s fee. Pay £50.', action: 'pay', amount: 50 },
  { id: 'cc4',  text: 'From sale at the community market. Collect £50.', action: 'collect', amount: 50 },
  { id: 'cc5',  text: 'Get Out of Al-Sijn Free. Keep this card until needed.', action: 'jail_free' },
  { id: 'cc6',  text: 'Go directly to Al-Sijn.', action: 'go_to_jail' },
  { id: 'cc7',  text: 'Holiday fund matures. Receive £100.', action: 'collect', amount: 100 },
  { id: 'cc8',  text: 'Income tax refund. Collect £20.', action: 'collect', amount: 20 },
  { id: 'cc9',  text: 'It is your birthday. Collect £10 from every player.', action: 'collect_from_players', amount: 10 },
  { id: 'cc10', text: 'Life insurance policy matures. Collect £100.', action: 'collect', amount: 100 },
  { id: 'cc11', text: 'Pay hospital fees of £100.', action: 'pay', amount: 100 },
  { id: 'cc12', text: 'Pay school fees: £50.', action: 'pay', amount: 50 },
  { id: 'cc13', text: 'Receive £25 consultancy fee.', action: 'collect', amount: 25 },
  { id: 'cc14', text: 'You are assessed for property repairs: £40/house, £115/hotel.', action: 'repairs', houseAmount: 40, hotelAmount: 115 },
  { id: 'cc15', text: 'You have won second prize at the festival. Collect £10.', action: 'collect', amount: 10 },
  { id: 'cc16', text: 'You inherit a family property. Collect £100.', action: 'collect', amount: 100 },
];

const PLAYER_TOKENS = [
  { id: 'camel',   emoji: '🐪', name: 'Camel' },
  { id: 'mosque',  emoji: '🕌', name: 'Mosque' },
  { id: 'star',    emoji: '⭐', name: 'Star' },
  { id: 'lantern', emoji: '🏮', name: 'Lantern' },
  { id: 'diamond', emoji: '💎', name: 'Diamond' },
  { id: 'plane',   emoji: '✈️', name: 'Plane' },
];

module.exports = {
  BOARD_SQUARES,
  COLOR_GROUPS,
  AIRLINE_POSITIONS,
  UTILITY_POSITIONS,
  AIRLINE_RENT,
  CHANCE_CARDS,
  COMMUNITY_CHEST_CARDS,
  PLAYER_TOKENS,
};
