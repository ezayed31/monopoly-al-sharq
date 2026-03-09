// Middle East Themed Monopoly Board Data

const BOARD_SQUARES = [
  // Position 0
  { position: 0, type: 'go', name: 'Yalla!', nameAr: 'يلا!', description: 'Collect £200 salary as you pass.' },

  // Position 1 - Brown group
  { position: 1, type: 'property', name: 'Old Medina', nameAr: 'المدينة القديمة', city: 'Fez', colorGroup: 'brown',
    price: 60, rent: [2, 10, 30, 90, 160, 250], housePrice: 50, mortgageValue: 30 },

  // Position 2
  { position: 2, type: 'community_chest', name: 'Sadaqah', nameAr: 'صدقة' },

  // Position 3 - Brown group
  { position: 3, type: 'property', name: 'Camel Souk', nameAr: 'سوق الجمال', city: 'Marrakech', colorGroup: 'brown',
    price: 60, rent: [4, 20, 60, 180, 320, 450], housePrice: 50, mortgageValue: 30 },

  // Position 4
  { position: 4, type: 'tax', name: 'Zakat', nameAr: 'زكاة', amount: 200, description: 'Pay £200 or 10% of net worth.' },

  // Position 5 - Airline
  { position: 5, type: 'airline', name: 'Emirates Airways', nameAr: 'طيران الإمارات', price: 200, mortgageValue: 100 },

  // Position 6 - Light Blue group
  { position: 6, type: 'property', name: 'Petra', nameAr: 'البتراء', city: 'Jordan', colorGroup: 'lightblue',
    price: 100, rent: [6, 30, 90, 270, 400, 550], housePrice: 50, mortgageValue: 50 },

  // Position 7
  { position: 7, type: 'chance', name: 'Inshallah', nameAr: 'إن شاء الله' },

  // Position 8 - Light Blue group
  { position: 8, type: 'property', name: 'Wadi Rum', nameAr: 'وادي رم', city: 'Jordan', colorGroup: 'lightblue',
    price: 100, rent: [6, 30, 90, 270, 400, 550], housePrice: 50, mortgageValue: 50 },

  // Position 9 - Light Blue group
  { position: 9, type: 'property', name: 'Dead Sea', nameAr: 'البحر الميت', city: 'Jordan', colorGroup: 'lightblue',
    price: 120, rent: [8, 40, 100, 300, 450, 600], housePrice: 50, mortgageValue: 60 },

  // Position 10
  { position: 10, type: 'jail', name: 'Al-Sijn', nameAr: 'السجن', description: 'Just Visiting / In Al-Sijn' },

  // Position 11 - Pink group
  { position: 11, type: 'property', name: 'Alexandria', nameAr: 'الإسكندرية', city: 'Egypt', colorGroup: 'pink',
    price: 140, rent: [10, 50, 150, 450, 625, 750], housePrice: 100, mortgageValue: 70 },

  // Position 12 - Utility
  { position: 12, type: 'utility', name: 'Oil Well', nameAr: 'بئر النفط', price: 150, mortgageValue: 75 },

  // Position 13 - Pink group
  { position: 13, type: 'property', name: 'Luxor', nameAr: 'الأقصر', city: 'Egypt', colorGroup: 'pink',
    price: 140, rent: [10, 50, 150, 450, 625, 750], housePrice: 100, mortgageValue: 70 },

  // Position 14 - Pink group
  { position: 14, type: 'property', name: 'Aswan', nameAr: 'أسوان', city: 'Egypt', colorGroup: 'pink',
    price: 160, rent: [12, 60, 180, 500, 700, 900], housePrice: 100, mortgageValue: 80 },

  // Position 15 - Airline
  { position: 15, type: 'airline', name: 'Qatar Airways', nameAr: 'الخطوط القطرية', price: 200, mortgageValue: 100 },

  // Position 16 - Orange group
  { position: 16, type: 'property', name: 'Casablanca', nameAr: 'الدار البيضاء', city: 'Morocco', colorGroup: 'orange',
    price: 180, rent: [14, 70, 200, 550, 750, 950], housePrice: 100, mortgageValue: 90 },

  // Position 17
  { position: 17, type: 'community_chest', name: 'Sadaqah', nameAr: 'صدقة' },

  // Position 18 - Orange group
  { position: 18, type: 'property', name: 'Marrakech', nameAr: 'مراكش', city: 'Morocco', colorGroup: 'orange',
    price: 180, rent: [14, 70, 200, 550, 750, 950], housePrice: 100, mortgageValue: 90 },

  // Position 19 - Orange group
  { position: 19, type: 'property', name: 'Tangier', nameAr: 'طنجة', city: 'Morocco', colorGroup: 'orange',
    price: 200, rent: [16, 80, 220, 600, 800, 1000], housePrice: 100, mortgageValue: 100 },

  // Position 20
  { position: 20, type: 'free_parking', name: 'Al-Waha', nameAr: 'الواحة', description: 'Free Parking - Rest at the Oasis' },

  // Position 21 - Red group
  { position: 21, type: 'property', name: 'Amman', nameAr: 'عمّان', city: 'Jordan', colorGroup: 'red',
    price: 220, rent: [18, 90, 250, 700, 875, 1050], housePrice: 150, mortgageValue: 110 },

  // Position 22
  { position: 22, type: 'chance', name: 'Inshallah', nameAr: 'إن شاء الله' },

  // Position 23 - Red group
  { position: 23, type: 'property', name: 'Aqaba', nameAr: 'العقبة', city: 'Jordan', colorGroup: 'red',
    price: 220, rent: [18, 90, 250, 700, 875, 1050], housePrice: 150, mortgageValue: 110 },

  // Position 24 - Red group
  { position: 24, type: 'property', name: 'Jerash', nameAr: 'جرش', city: 'Jordan', colorGroup: 'red',
    price: 240, rent: [20, 100, 300, 750, 925, 1100], housePrice: 150, mortgageValue: 120 },

  // Position 25 - Airline
  { position: 25, type: 'airline', name: 'Etihad Airways', nameAr: 'طيران الاتحاد', price: 200, mortgageValue: 100 },

  // Position 26 - Yellow group
  { position: 26, type: 'property', name: 'Riyadh', nameAr: 'الرياض', city: 'Saudi Arabia', colorGroup: 'yellow',
    price: 260, rent: [22, 110, 330, 800, 975, 1150], housePrice: 150, mortgageValue: 130 },

  // Position 27 - Yellow group
  { position: 27, type: 'property', name: 'Jeddah', nameAr: 'جدة', city: 'Saudi Arabia', colorGroup: 'yellow',
    price: 260, rent: [22, 110, 330, 800, 975, 1150], housePrice: 150, mortgageValue: 130 },

  // Position 28 - Utility
  { position: 28, type: 'utility', name: 'Desalination Plant', nameAr: 'محطة التحلية', price: 150, mortgageValue: 75 },

  // Position 29 - Yellow group
  { position: 29, type: 'property', name: 'Medina', nameAr: 'المدينة المنورة', city: 'Saudi Arabia', colorGroup: 'yellow',
    price: 280, rent: [24, 120, 360, 850, 1025, 1200], housePrice: 150, mortgageValue: 140 },

  // Position 30
  { position: 30, type: 'go_to_jail', name: 'To Al-Sijn!', nameAr: 'إلى السجن!' },

  // Position 31 - Green group
  { position: 31, type: 'property', name: 'Abu Dhabi', nameAr: 'أبوظبي', city: 'UAE', colorGroup: 'green',
    price: 300, rent: [26, 130, 390, 900, 1100, 1275], housePrice: 200, mortgageValue: 150 },

  // Position 32 - Green group
  { position: 32, type: 'property', name: 'Muscat', nameAr: 'مسقط', city: 'Oman', colorGroup: 'green',
    price: 300, rent: [26, 130, 390, 900, 1100, 1275], housePrice: 200, mortgageValue: 150 },

  // Position 33
  { position: 33, type: 'community_chest', name: 'Sadaqah', nameAr: 'صدقة' },

  // Position 34 - Green group
  { position: 34, type: 'property', name: 'Kuwait City', nameAr: 'مدينة الكويت', city: 'Kuwait', colorGroup: 'green',
    price: 320, rent: [28, 150, 450, 1000, 1200, 1400], housePrice: 200, mortgageValue: 160 },

  // Position 35 - Airline
  { position: 35, type: 'airline', name: 'Air Arabia', nameAr: 'العربية للطيران', price: 200, mortgageValue: 100 },

  // Position 36
  { position: 36, type: 'chance', name: 'Inshallah', nameAr: 'إن شاء الله' },

  // Position 37 - Dark Blue group
  { position: 37, type: 'property', name: 'Burj Khalifa', nameAr: 'برج خليفة', city: 'Dubai', colorGroup: 'darkblue',
    price: 350, rent: [35, 175, 500, 1100, 1300, 1500], housePrice: 200, mortgageValue: 175 },

  // Position 38
  { position: 38, type: 'tax', name: 'Customs Duty', nameAr: 'رسوم جمركية', amount: 100, description: 'Pay £100 luxury tax.' },

  // Position 39 - Dark Blue group
  { position: 39, type: 'property', name: 'Palm Jumeirah', nameAr: 'نخلة جميرا', city: 'Dubai', colorGroup: 'darkblue',
    price: 400, rent: [50, 200, 600, 1400, 1700, 2000], housePrice: 200, mortgageValue: 200 },
];

// Group properties
const COLOR_GROUPS = {
  brown: { properties: [1, 3], housePrice: 50, color: '#8B4513' },
  lightblue: { properties: [6, 8, 9], housePrice: 50, color: '#87CEEB' },
  pink: { properties: [11, 13, 14], housePrice: 100, color: '#FF69B4' },
  orange: { properties: [16, 18, 19], housePrice: 100, color: '#FFA500' },
  red: { properties: [21, 23, 24], housePrice: 150, color: '#FF0000' },
  yellow: { properties: [26, 27, 29], housePrice: 150, color: '#FFD700' },
  green: { properties: [31, 32, 34], housePrice: 200, color: '#008000' },
  darkblue: { properties: [37, 39], housePrice: 200, color: '#00008B' },
};

const AIRLINE_POSITIONS = [5, 15, 25, 35];
const UTILITY_POSITIONS = [12, 28];

// Airline rent: 25, 50, 100, 200 (based on number owned)
const AIRLINE_RENT = [0, 25, 50, 100, 200];

// Chance Cards (Inshallah)
const CHANCE_CARDS = [
  { id: 'ch1', text: 'Advance to Yalla! (GO). Collect £200.', action: 'move_to', target: 0, collectGo: true },
  { id: 'ch2', text: 'Advance to Burj Khalifa. If you pass GO, collect £200.', action: 'move_to', target: 37, collectGo: true },
  { id: 'ch3', text: 'Advance to Palm Jumeirah. If you pass GO, collect £200.', action: 'move_to', target: 39, collectGo: true },
  { id: 'ch4', text: 'Advance to Emirates Airways. If you pass GO, collect £200.', action: 'move_to', target: 5, collectGo: true },
  { id: 'ch5', text: 'Advance to nearest Airline. Pay double rent if unowned.', action: 'move_nearest', target: 'airline' },
  { id: 'ch6', text: 'Advance to nearest Utility. If unowned, buy it. If owned, pay 10x dice.', action: 'move_nearest', target: 'utility' },
  { id: 'ch7', text: 'The Sultan rewards your loyalty. Bank pays you £50.', action: 'collect', amount: 50 },
  { id: 'ch8', text: 'Get Out of Al-Sijn Free. Keep this card until needed.', action: 'jail_free' },
  { id: 'ch9', text: 'Go back 3 spaces.', action: 'move_back', amount: 3 },
  { id: 'ch10', text: 'Go directly to Al-Sijn. Do not pass GO. Do not collect £200.', action: 'go_to_jail' },
  { id: 'ch11', text: 'Make general repairs on your properties: £25 per house, £100 per hotel.', action: 'repairs', houseAmount: 25, hotelAmount: 100 },
  { id: 'ch12', text: 'Pay the desert toll — £15.', action: 'pay', amount: 15 },
  { id: 'ch13', text: 'Take a journey to Qatar Airways. If you pass GO, collect £200.', action: 'move_to', target: 15, collectGo: true },
  { id: 'ch14', text: 'Walk to the Old Medina. Advance to Old Medina.', action: 'move_to', target: 1, collectGo: true },
  { id: 'ch15', text: 'You have been elected Tribal Sheikh. Pay each player £50.', action: 'pay_players', amount: 50 },
  { id: 'ch16', text: 'Your oil investment matures. Collect £150.', action: 'collect', amount: 150 },
];

// Community Chest Cards (Sadaqah)
const COMMUNITY_CHEST_CARDS = [
  { id: 'cc1', text: 'Advance to Yalla! (GO). Collect £200.', action: 'move_to', target: 0, collectGo: true },
  { id: 'cc2', text: 'Bank error in your favor. Collect £200.', action: 'collect', amount: 200 },
  { id: 'cc3', text: 'Doctor\'s fee. Pay £50.', action: 'pay', amount: 50 },
  { id: 'cc4', text: 'From sale of dates at the souk. Collect £50.', action: 'collect', amount: 50 },
  { id: 'cc5', text: 'Get Out of Al-Sijn Free. Keep this card until needed.', action: 'jail_free' },
  { id: 'cc6', text: 'Go directly to Al-Sijn.', action: 'go_to_jail' },
  { id: 'cc7', text: 'Holiday fund in Oman matures. Receive £100.', action: 'collect', amount: 100 },
  { id: 'cc8', text: 'Income tax refund. Collect £20.', action: 'collect', amount: 20 },
  { id: 'cc9', text: 'It is your birthday. Collect £10 from every player.', action: 'collect_from_players', amount: 10 },
  { id: 'cc10', text: 'Life insurance policy matures. Collect £100.', action: 'collect', amount: 100 },
  { id: 'cc11', text: 'Pay hospital fees of £100.', action: 'pay', amount: 100 },
  { id: 'cc12', text: 'Pay your desert academy school fees: £50.', action: 'pay', amount: 50 },
  { id: 'cc13', text: 'Receive £25 consultancy fee.', action: 'collect', amount: 25 },
  { id: 'cc14', text: 'You are assessed for property repairs: £40/house, £115/hotel.', action: 'repairs', houseAmount: 40, hotelAmount: 115 },
  { id: 'cc15', text: 'You have won second prize at the Heritage Festival. Collect £10.', action: 'collect', amount: 10 },
  { id: 'cc16', text: 'You inherit your uncle\'s camel farm. Collect £100.', action: 'collect', amount: 100 },
];

const PLAYER_TOKENS = [
  { id: 'camel', emoji: '🐪', name: 'Camel' },
  { id: 'mosque', emoji: '🕌', name: 'Mosque' },
  { id: 'star', emoji: '⭐', name: 'Star' },
  { id: 'lantern', emoji: '🏮', name: 'Lantern' },
  { id: 'diamond', emoji: '💎', name: 'Diamond' },
  { id: 'plane', emoji: '✈️', name: 'Plane' },
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
