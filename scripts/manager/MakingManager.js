/* 제작법 제어 */

MakingManager = {
  repair_paper_recipe: [],
  recipes: {},
}

MakingManager.setRepairPaperRecipe = function(...materials) {
  if(materials.length == 0) throw new Error("Making.setRepairPaperRecipe needs more args.");
  if(!materials.every(value => value instanceof Item)) throw new TypeError(`${materials.filter(value => !(value instanceof Item)).join(", ")} is not item`);
  this.repair_paper_recipe = materials;
}
MakingManager.setRecipe = function(resultItem, ...materials) {
  if(materials.length == 0) throw new Error("Making.setRecipe needs more args.");
  if(!materials.every(value => value instanceof Item)) throw new TypeError(`${materials.filter(value => !(value instanceof Item)).join(", ")} is not item`);
  this.recipes[resultItem] = materials;
}
MakingManager.canMake = function(recipe) {

  const sale = StatManager.getMagicHat();
  
  for(const rec of recipe) {
    if(rec.type == "money") {
      if(InventoryManager.getMoney() >= rec.count) continue;
      return false;
    }
    const item = InventoryManager.findItem(rec.name, rec.type);

    if(item !== undefined) {
      if(rec.type == "piece" && item.count < rec.count-sale) return false;
      if(rec.type == "sword" && item.count < rec.count) return false;      
    } else return false;
  }
  return true;
}
MakingManager.makeWithRecipe = function(recipe) {
  if(!this.canMake(recipe)) return false;
  
  const sale = StatManager.getMagicHat();
  for(const item of recipe) {
    if(item.type == "money") MoneyDisplay.changeMoney(-item.count);
    else if(item.type == "piece") InventoryManager.subtractItem(item.type, item.name, item.count - sale);
    else InventoryManager.subtractItem(item.type. item.name, item.count);
  }
  return true;
}
MakingManager.makeRepairPaper = function() {
  if(this.makeWithRecipe(this.repair_paper_recipe)) {
    InventoryManager.addCountToRepairPaper(1);
    MakingScreen.animateLodding(450, () => MakingScreen.render());
  }
}
MakingManager.makeSword = function(swordName) {
  const sale = StatManager.getMagicHat();
  if(this.makeWithRecipe(this.recipes[swordName], sale)) {
    SwordManager.jumpTo(SwordManager.getIndex(swordName));
    MakingScreen.animateLodding(800, () => MainScreen.show());
  }
}