/* 제작법 */
/**
 * 제작소 관련 객체
 */
MakingManager = {
  repair_paper_recipe: [],
  discountable_min_count: 1,
  recipes: {}
};
/**
 * 복구권 조합법을 정합니다.
 * @param  {...Item} materials 조합에 필요한 아이템들
 */
MakingManager.setRepairPaperRecipe = function(...materials) {
  if(materials.length == 0) throw new Error("Making.setRepairPaperRecipe needs more args.");
  if(!materials.every(value => value instanceof Item)) throw new TypeError(`${materials.filter(value => !(value instanceof Item)).join(", ")} is not item.`);
  this.repair_paper_recipe = materials;
};
/**
 * 검 워프권의 조합법을 저장합니다.
 * @param {string} resultItem 검의 이름
 * @param  {...Item} materials 조합에 필요한 아이템들
 */
MakingManager.setRecipe = function(resultItem, ...materials) {
  if(materials.length == 0) throw new Error("Making.setRecipe needs more args.");
  if(!materials.every(value => value instanceof Item)) throw new TypeError(`${materials.filter(value => !(value instanceof Item)).join(", ")} is not item.`);
  this.recipes[resultItem] = materials;
};
MakingManager.canMake = function(recipe) {
  for(const rec_item of recipe) {
    if(rec_item.type == "money") {
      if(InventoryManager.getMoney() >= rec_item.count) continue;
      return false;
    }
    const inv_item = InventoryManager.findItem(rec_item.type, rec_item.name);
    if(inv_item === undefined ||
      (rec_item.type == "piece" && inv_item.count < StatManager.calculateMagicHat(rec_item.count, this.discountable_min_count)) ||
      (rec_item.type == "sword" && inv_item.count < rec_item.count)) return false;
  }
  return true;
};
MakingManager.salePieceCount = function(count) {
  return StatManager.calculateMagicHat(count, this.discountable_min_count);
}
MakingManager.copyRecipe = function(recipe) {
  const newarray = [];
  for(const element of recipe) {
    if(element instanceof MoneyItem) {
      newarray.push(new MoneyItem(element.count));
    } else if(element instanceof PieceItem) {
      newarray.push(new PieceItem(element.name, element.count));
    } else if(element instanceof SwordItem) {
      newarray.push(new SwordItem(element.name, element.count));      
    }
  }
  return newarray;
}
MakingManager.multiplyRecipe = function(recipe, count) {
  const newrecipe = this.copyRecipe(recipe);
  for(const material of newrecipe) material.count *= count;
  return newrecipe;
}
MakingManager.makeWithRecipe = function(recipe) {
  if(!this.canMake(recipe)) return false;
  for(const rec_item of recipe) {
    switch (rec_item.type) {
      case "money": MoneyDisplay.changeMoney(-rec_item.count); break;
      case "piece": InventoryManager.subtractItem(rec_item.type, rec_item.name, MakingManager.salePieceCount(rec_item.count)); break;
      case "sword": InventoryManager.subtractItem(rec_item.type, rec_item.name, rec_item.count); break;
    }
  }
  return true;
};
MakingManager.makeRepairPaper = function(count=1) {
  if(this.makeWithRecipe(this.multiplyRecipe(this.repair_paper_recipe, count))) {
    InventoryManager.addCountToRepairPaper(count);
    MakingScreen.animateLodding(700, () => MakingScreen.render());
  }
};
MakingManager.makeSword = function(swordName) {
  if(this.makeWithRecipe(this.recipes[swordName])) {
    const index = SwordManager.getIndex(swordName);
    SwordManager.jumpTo(SwordManager.getIndex(index));
    MakingScreen.animateLodding(1200, () => {
      MainScreen.show()
      if(index == SwordManager.max_upgradable_index) {
        MessageWindow.popupMakingLastSwordMessage();
      }
    });
    
  }
};