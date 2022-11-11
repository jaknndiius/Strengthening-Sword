const TestResult = {
  MONEY_LACK: "MONEY LACK",
  MAX_UPGRADE: "MAX UPGRADE",
  SUCCESS: "SUCCESS"
};
const GameManager = {};
GameManager.test = function() {
  if(InventoryManager.getMoney() - SwordManager.getCurrentSword().cost < 0) return TestResult.MONEY_LACK;
  else if(SwordManager.max_upgradable_index < SwordManager.current_sword_index +1) return TestResult.MAX_UPGRADE;
  else return TestResult.SUCCESS;
};
GameManager.init = function(start) {
  if(start !== undefined) SwordManager.jumpTo(start);
  else SwordManager.resetSword();
  MainScreen.show();
  MoneyDisplay.render();
};
$("#main-game-button").addEventListener("click", () => MainScreen.show());
$("#information-button").addEventListener("click", () => InformationScreen.show());
$("#inventory-button").addEventListener("click", () => InventoryScreen.show());
$("#making-button").addEventListener("click", () => MakingScreen.show());
$("#stat-button").addEventListener("click", () => StatScreen.show());
const onClickCloseButton = id => $("#" + id).hide();