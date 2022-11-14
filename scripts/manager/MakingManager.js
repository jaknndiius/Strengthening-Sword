/* 제작법 */
/**
 * 제작소 관련 객체
 */
MakingManager = {
  repair_paper_recipe: [],
  recipes: {},
};
/**
 * 복구권 조합법을 정합니다.
 * @param  {...Item} materials 조합에 필요한 아이템들
 */
MakingManager.setRepairPaperRecipe = function(...materials) {
  if(materials.length == 0) throw new Error("Making.setRepairPaperRecipe needs more args.");
  if(!materials.every(value => value instanceof Item)) throw new TypeError(`${materials.filter(value => !(value instanceof Item)).join(", ")} is not item`);
  this.repair_paper_recipe = materials;
};
/**
 * 검 워프권의 조합법을 저장합니다.
 * @param {string} resultItem 검의 이름
 * @param  {...Item} materials 조합에 필요한 아이템들
 */
MakingManager.setRecipe = function(resultItem, ...materials) {
  if(materials.length == 0) throw new Error("Making.setRecipe needs more args.");
  if(!materials.every(value => value instanceof Item)) throw new TypeError(`${materials.filter(value => !(value instanceof Item)).join(", ")} is not item`);
  this.recipes[resultItem] = materials;
};
MakingManager.canMake = function(recipe) {

  const sale = StatManager.getMagicHat();
  
  for(const rec_item of recipe) {
    if(rec_item.type == "money") {
      if(InventoryManager.getMoney() >= rec_item.count) continue;
      return false;
    }
    const inv_item = InventoryManager.findItem(rec_item.type, rec_item.name);

    if(inv_item === undefined ||
      (rec_item.type == "piece" && inv_item.count < rec_item.count-sale) ||
      (rec_item.type == "sword" && inv_item.count < rec_item.count)) return false;
  }
  return true;
};
MakingManager.makeWithRecipe = function(recipe) {
  if(!this.canMake(recipe)) return false;
  
  const sale = StatManager.getMagicHat();
  for(const rec_item of recipe) {
    if(rec_item.type == "money") MoneyDisplay.changeMoney(-rec_item.count);
    else if(rec_item.type == "piece") InventoryManager.subtractItem(rec_item.type, rec_item.name, rec_item.count - sale);
    else InventoryManager.subtractItem(rec_item.type, rec_item.name, rec_item.count);
  }
  return true;
};
MakingManager.makeRepairPaper = function() {
  if(this.makeWithRecipe(this.repair_paper_recipe)) {
    InventoryManager.addCountToRepairPaper(1);
    MakingScreen.animateLodding(450, () => MakingScreen.render());
  }
};
MakingManager.makeSword = function(swordName) {
  if(this.makeWithRecipe(this.recipes[swordName])) {
    SwordManager.jumpTo(SwordManager.getIndex(swordName));
    MakingScreen.animateLodding(800, () => MainScreen.show());
  }
};