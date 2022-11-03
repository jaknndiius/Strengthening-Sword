/* 검 제어 */

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
    if(Math.random() < this.prob) {
      const result = Math.ceil(Math.round(Math.random()*100)/(100/this.max_drop));
      return new PieceItem(this.name, result);
    } return null;
  }
}

SwordManager = {
  current_sword_index: 0,
  swords: [],
  found_swords: [],
  max_upgradable_index: 0
}
SwordManager.getSword = function(value) {
  let res = undefined;
  if(typeof value == "number")
    res = this.swords[value];
  else if(typeof value == "string")
    res = this.swords.find(sword => sword.name == value);
  else throw new TypeError(`${value} is not a number or string.`)
  if(res === undefined) throw new Error(`There is no sword named ${value}`);
  return res;
}
SwordManager.getIndex = function(value) {
  if(value instanceof Sword) return this.swords.indexOf(value);
  return this.swords.indexOf(this.getSword(value));
}
SwordManager.calculateLoss = function(index) {
  return this.swords.filter((v, idx) => idx <= index).reduce((pre, cur) => pre += cur.cost, 0);
}
SwordManager.appendSword = function(sword) {
  if(sword instanceof Sword) {
    this.swords.push(sword);
    this.max_upgradable_index = this.swords.length -1;

  } else throw new TypeError(`${sword} is not a sword`);
}
SwordManager.isFound = function(swordValue) {
  switch (typeof swordValue) {
    case "number": return this.found_swords.includes(swordValue);
    case "string": return this.found_swords.includes(this.getIndex(swordValue));
    default: throw new TypeError(`${swordValue} is not sword's name or sword's index`);
  }
}
SwordManager.findSword = function(index) {
  if(this.isFound(index)) return false;
  this.found_swords.push(index);
  return true;
}  

SwordManager.resetSword = function() { this.jumpTo(0); }
SwordManager.upgradeSword = function(index) {
  if(index === undefined) {
    this.jumpTo(this.current_sword_index +1);
    return;
  }
  if(typeof index != "number") throw new TypeError(`${index} is not a number.`);
  this.jumpTo(this.current_sword_index +2)
}
SwordManager.downgradeSword = function() { this.jumpTo(this.current_sword_index -1)}


SwordManager.jumpTo = function(index) {
  if(typeof index != "number") throw new TypeError(`${index} is not a number`);
  if(index < 0) index = 0;
  if(index > this.max_upgradable_index) index = this.max_upgradable_index;
  if(this.findSword(index)) StatManager.addStatPoint();
  this.current_sword_index = index;
}

SwordManager.getCurrentSword = function() {
  return this.getSword(this.current_sword_index);
}
SwordManager.getNextSword = function() {
  if(this.current_sword_index == this.max_upgradable_index) return SwordManager.getSword(this.current_sword_index);
  return this.getSword(this.current_sword_index +1);
}