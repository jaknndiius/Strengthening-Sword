
const TestResult = {
  /**
   * 자원 부족으로 불가능
   */
  RESOURCES_LACK: "RESOURCES LACK",
  /**
   * 최대 강화 달성으로 불가능
   */
  MAX_UPGRADE: "MAX UPGRADE",
  /**
   * 업그레이드 가능
   */
  SUCCESS: "SUCCESS"
};
/**
 * 게임 관련 객체
 */
const GameManager = {};
/**
 * 검을 초기화하고 메인 게임 화면을 보여줍니다.
 * @param {number?} start 검을 몇강으로 초기화 할 지 정합니다. 생략시 0강으로 초기화합니다.
 */
GameManager.init = function(start=0) {
  SwordManager.jumpTo(start);
  MainScreen.show();
  MoneyDisplay.render();
};
const onClickCloseButton = id => $("#" + id).hide();
(function addEventListener() {
  $("#main-game-button").addEventListener("click", () => MainScreen.show());
  $("#information-button").addEventListener("click", () => InformationScreen.show());
  $("#inventory-button").addEventListener("click", () => InventoryScreen.show());
  $("#making-button").addEventListener("click", () => MakingScreen.show());
  $("#stat-button").addEventListener("click", () => StatScreen.show());
})();