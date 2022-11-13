/* 검 */
class Sword {
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
class Piece {
  constructor(name, prob, max_drop) {
    this.name = name;
    this.prob = prob;
    this.max_drop = max_drop;
  }
  calculate() {
    return (Math.random() < this.prob) ? new PieceItem(this.name, Math.ceil(Math.round(Math.random()*100)/(100/this.max_drop))) : null;
  }
}
SwordManager = {
  current_sword_index: 0,
  swords: [],
  found_swords: [],
  max_upgradable_index: 0
};
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
SwordManager.upgradeSword = function(index) {
  if(index === undefined) {
    this.jumpTo(this.current_sword_index +1);
    return;
  }
  if(typeof index != "number") throw new TypeError(`${index} is not a number.`);
  this.jumpTo(this.current_sword_index +2)
};
SwordManager.downgradeSword = function() { this.jumpTo(this.current_sword_index -1)};
SwordManager.jumpTo = function(index) {
  if(typeof index != "number") throw new TypeError(`${index} is not a number.`);
  index = Math.min(Math.max(index, 0), this.max_upgradable_index);
  if(this.findSword(index)) StatManager.addStatPoint();
  this.current_sword_index = index;
};
SwordManager.getCurrentSword = function() {
  return this.getSword(this.current_sword_index);
};
SwordManager.getNextSword = function() {
  return this.getSword(Math.min(this.current_sword_index +1, this.max_upgradable_index));
};