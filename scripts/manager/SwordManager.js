/* 검 */

SwordName = {
  BF_SWORD: "BF 대검",
  SHEEN: "광휘의 검",
  GUINSOOS_RAGEBLADE: "구인수의 격노검",
  UMBRAL_GLAIVE: "그림자 검",
  DAGGER: "단검",
  DORANS_BLADE: "도란의 검",
  SERPENTS_FANG: "독사의 송곳니",
  DUSKBLADE_OF_DRAKTHARR: "드락사르의 황혼검",
  LONG_SWORD: "롱소드",
  LICH_BANE: "리치베인",
  MANAMUNE: "마나무네",
  WITS_END: "마법사의 최후",
  MAW_OF_MALMORTIUS: "맬모셔스의 아귀",
  BLADE_OF_THE_RUINED: "몰락한 왕의 검",
  MURAMANA: "무라마나",
  INFINITY_EDGE: "무한의 대검",
  RAGEKNIFE: "분노의 칼",
  GUARDIAN_ANGEL: "수호 천사",
  GUARDIANS_BLADE: "수호자의 검",
  ZEAL: "열정의 검",
  YOUMMUUS_GHOSTBLADE: "요우무의 유령검",
  ECLIPSE: "월식",
  IMPERIAL_MANDATE: "제국의 명령",
  HEXDRINKER: "주문포식자",
  DEATHS_DANCE: "죽음의 무도",
  EXECUTIONERS_CALLING: "처형인의 대검",
  SERRATED_DIRK: "톱날 단검",
  STORMRAZOR: "폭풍 갈퀴",
  BLOODTHIRSTER: "피바라기",
  SANGUINE_BLADE: "핏빛 칼날",
  MERCURIAL_SCIMITAR: "헤르메스의 시미터"
}

PieceName = {
  WATCHFUL_WARDSTONE: "감시하는 와드석",
  GIANTS_BELF: "거인의 허리띠",
  FORBIDDEN_IDOL: "금지된 우상",
  NAVORI_QUICKBLADES: "나보리 신속검",
  DORANS_RING: "도란의 반지",
  RUBY_CRYSTAL: "루비 수정",
  ELIXIR_OF_SORCERY: "마법의 영약",
  BROKEN_STOPWATCH: "망가진 초시계",
  OBLIVION_ORB: "망각의 구",
  MINION_DEMATERIALIZER: "미니언 해체 분석기",
  BAMIS_CINDER: "바미의 불씨",
  BLASTING_WAND: "방출의 마법봉",
  SAPPHIRE_CRYSTAL: "사파이어 수정",
  TRINITY_FORCE: "삼위일체",
  QUICKSILVER_SASH: "수은장식띠",
  GUARDIANS_ORB: "수호자의 보주",
  VERDANT_BARRIER: "신록의 장벽",
  ABYSSAL_MASK: "심연의 가면",
  DARK_SEAL: "암흑의 인장",
  GLACIAL_BUCKLER: "얼음방패",
  AETHER_WISP: "에테르 환영",
  TEAR_OF_THE_GODDESS: "여신의 눈물",
  BLIGHTING_JEWEL: "역병의 보석",
  FAERIE_CHARM: "요정의 부적",
  REJUVENATION_BEAD: "원기 회복의 구슬",
  AXIOM_ARC: "원칙의 원형낫",
  EVENSHROUD: "저녁 갑주",
  KINDLEGEM: "점화석",
  SPELLTHIEFS_EDGE: "주문 도둑의 검",
  ANATHEMAS_CHAINS: "증오의 사슬",
  COMMENCING_STOPWATCH: "초시계",
  REFILLABLE_POTION: "충전형 물약"
}
/**
 * 검의 정보를 담은 클래스입니다.
 */
class Sword {
  /**
   * @param {string} name 검의 이름
   * @param {number} prob 다음 단계 강화 성공 확률
   * @param {number} cost 다음 단계 강화 비용
   * @param {number} price 판매 가격 
   * @param {number} requiredRepairs 복구 시 필요한 복구권 갯수
   * @param {boolean} canSave 보관함에 저장 가능 여부
   * @param  {...Piece?} pieces 파괴시 떨어지는 조각들
   */
  constructor(name, prob, cost, price, requiredRepairs, canSave, ...pieces) {
    this.name = name;
    this.image = "images/swords/" + name + ".png";
    this.prob = prob;
    this.cost = cost;
    this.price = price;
    this.requiredRepairs = requiredRepairs;
    this.canSave = canSave;
    this.pieces = pieces;
  }
}
/**
 * 조각의 정보를 담은 클래스입니다.
 */
class Piece {
  /**
   * @param {string} name 조각 이름
   * @param {number} prob 조각 생성 확률
   * @param {number} min_drop 최소로 생성되는 갯수
   * @param {number} max_drop 최대로 생성되는 갯수 
   */
  constructor(name, prob, min_drop, max_drop) {
    this.name = name;
    this.prob = prob;
    this.min_drop = min_drop;
    this.max_drop = max_drop;
  }
  getCount = () => Math.floor(Math.random() * (this.max_drop - this.min_drop + 1)) + this.min_drop;
  /**
   * this.prob 확률에 따라 성공시 1~this.max_drop 사이의 랜덤한 수만큼 PieceItem을, 실패시 null을 반환합니다.
   */
  calculate = () => (Math.random() < this.prob) ? new PieceItem(this.name, this.getCount()) : null;
}
/**
 * 검 관련 객체
 */
SwordManager = {
  current_sword_index: 0,
  swords: [],
  found_swords: [],
  max_upgradable_index: 0
};
/**
 * 현재 검이 몇강인지 반환합니다.
 */
SwordManager.getCurrentSwordIndex = function() { return this.current_sword_index(); };
SwordManager.getSword = function(value) {
  let res;
  if(typeof value == "number") res = this.swords[value];
  else if(typeof value == "string") res = this.swords.find(sword => sword.name == value);
  else throw new TypeError(`${value} is not a number or string.`);
  if(res === undefined) throw new Error(`There is no sword named ${value}.`);
  return res;
};
SwordManager.getIndex = function(value) {
  if(value instanceof Sword) return this.swords.indexOf(value);
  return this.swords.indexOf(this.getSword(value));
};
SwordManager.calculateLoss = function(index) {
  return this.swords.slice(0, index+1).reduce((pre, cur) => pre += StatManager.calculateSmith(cur.cost), 0);
};
/**
 * 검을 검 배열에 추가합니다.
 * @param {Sword} sword 추가될 검
 */
SwordManager.appendSword = function(sword) {
  if(!(sword instanceof Sword)) throw new TypeError(`${sword} is not a sword.`);
  this.swords.push(sword);
  this.max_upgradable_index = this.swords.length -1;
};
SwordManager.isFound = function(swordValue) {
  switch (typeof swordValue) {
    case "number": return this.found_swords.includes(swordValue);
    case "string": return this.found_swords.includes(this.getIndex(swordValue));
    default: throw new TypeError(`${swordValue} is not a number(sword's index) or a string(sword's name).`);
  }
};
SwordManager.findSword = function(index) {
  if(this.isFound(index)) return false;
  this.found_swords.push(index);
  return true;
};
SwordManager.resetSword = function() { this.jumpTo(0); };
/**
 * 검을 강화합니다.
 * @param {number?} index 검을 몇강 강화할지 정합니다. 생략시 +1강으로 설정됩니다.
 */
SwordManager.upgradeSword = function(index) {
  if(index === undefined) {
    this.jumpTo(this.current_sword_index +1);
    return;
  }
  if(typeof index != "number") throw new TypeError(`${index} is not a number.`);
  this.jumpTo(this.current_sword_index +2)
};
/**
 * 검을 -1강 합니다.
 */
SwordManager.downgradeSword = function() { this.jumpTo(this.current_sword_index -1)};
SwordManager.jumpTo = function(index) {
  if(typeof index != "number") throw new TypeError(`${index} is not a number.`);
  index = Math.min(Math.max(index, 0), this.max_upgradable_index);
  if(this.findSword(index)) StatManager.addStatPoint();
  this.current_sword_index = index;
};
/**
 * 현재 가지고 있는 검을 반환합니다.
 */
SwordManager.getCurrentSword = function() {
  return this.getSword(this.current_sword_index);
};
SwordManager.getNextSword = function() {
  return this.getSword(Math.min(this.current_sword_index +1, this.max_upgradable_index));
};