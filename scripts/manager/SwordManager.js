/* 검 */
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
   * @param {number} max_drop 최대로 생성되는 갯수 
   */
  constructor(name, prob, max_drop) {
    this.name = name;
    this.prob = prob;
    this.max_drop = max_drop;
  }
  /**
   * this.prob 확률에 따라 성공시 1~this.max_drop 사이의 랜덤한 수만큼 PieceItem을, 실패시 null을 반환합니다.
   */
  calculate() {
    return (Math.random() < this.prob) ? new PieceItem(this.name, Math.ceil(Math.round(Math.random()*100)/(100/this.max_drop))) : null;
  }
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
  return this.swords.filter((v, idx) => idx <= index).reduce((pre, cur) => pre += StatManager.calculateSmith(cur.cost), 0);
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