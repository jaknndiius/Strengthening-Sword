/* 보관함 */
class Item { constructor(type, name, count) { this.type = type; this.name = name; this.count = count; } }
class PieceItem extends Item { constructor(name, count) { super("piece", name, count); } }
class SwordItem extends Item { constructor(name, count) { super("sword", name, count); } }
class MoneyItem extends Item { constructor(count) { super("money", "돈", count); } }
const InventoryManager = {
  inventory: [],
  money: 0,
  repair_paper: 0
};
InventoryManager.getMoney = function() { return this.money };
InventoryManager.setMoney = function(num) {
  if(typeof num != "number" || isNaN(num)) throw new TypeError(`${num} is not a valid number`);
  this.money = Math.max(num, 0);
};
InventoryManager.changeMoney = function(num) {
  this.setMoney(this.getMoney() + num);
};
InventoryManager.canUseRepairPaper = function(count) {
  return this.repair_paper >= count;
};
InventoryManager.addCountToRepairPaper = function(count) {
  if(typeof count != "number") throw new TypeError(`${count} is not a number`);
  this.repair_paper += Math.max(count, 0);
};
InventoryManager.subtractRepairPaper = function(count) {
  if(typeof count != "number") throw new TypeError(`${count} is not a number`);
  if(!this.canUseRepairPaper(count)) throw new Error("There are no enough repair papers.");
  this.repair_paper -= Math.max(count, 0);
};
InventoryManager.saveItem = function(type, name, count) {
  if(typeof count != "number") throw new TypeError(`${count} is not a number`);
  if(count < 0) throw new RangeError(`${count} is not more than 0.`);

  const item = this.findItem(type, name);
  if(item === undefined) {
    switch (type) {
      case "piece":
        this.inventory.push(new PieceItem(name, count));
        break;
      case "sword":
        this.inventory.push(new SwordItem(name, count));
        break;
      default:
        throw new Error(`${type} is not 'piece' or 'sword'`);
    }
  } else item.count += count;
};
InventoryManager.savePiece = function(name, count) {
  this.saveItem("piece", name, count);
};
InventoryManager.saveSword = function(name, count) {
  this.saveItem("sword", name, count);
};
InventoryManager.findItem = function(type, name) {
  if(name === undefined) return this.inventory.find(value => value.name == type);
  return this.inventory.find(value => value.type == type && value.name == name);
};
InventoryManager.subtractItem = function(type, name, count) {
  const item = this.findItem(type, name);
  if(item === undefined) return new Error("There is no such sword.");
  if(item.count < count) return false;
  item.count -= count
  return true;
};
InventoryManager.sellSword = function(name) {
  if(this.subtractItem("sword", name, 1)) {
    const price = SwordManager.getSword(name).price;
    RecordStorage.addRecord("sell", name, price);
    InventoryScreen.render();
    MoneyDisplay.changeMoney(price);
  }
};
InventoryManager.getItems = function(type) {
  return this.inventory.filter(value => value.type == type && value.count != 0);
};
InventoryManager.getPieces = function() {
  return this.getItems("piece");
};
InventoryManager.getSwords = function() {
  return this.getItems("sword");
};