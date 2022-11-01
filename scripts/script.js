function gameStart() {
  /* Game Setting */
  GameManager.setMoney(100000);

  /* Sword Setting */
  GameManager.appendSword(new Sword(0, "단검", 1.0, 300, 0, 3, false));
  GameManager.appendSword(new Sword(1, "롱소드", 0.95, 300, 100, 3, false));
  GameManager.appendSword(new Sword(2, "처형인의 대검", 0.9, 400, 300, 3, false));
  GameManager.appendSword(new Sword(3, "BF 대검", 0.85, 500, 600, 3, false));
  GameManager.appendSword(new Sword(4, "마나무네", 0.8, 600, 1000, 3, false));
  GameManager.appendSword(new Sword(5, "무라마나", 0.75, 700, 1200, 3, true, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)));
  GameManager.appendSword(new Sword(6, "드락사르의 황혼검", 0.7, 1000, 1500, 3, true, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)));
  GameManager.appendSword(new Sword(7, "무한의 대검", 0.65, 1500, 3000, 3, true, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)));
  GameManager.appendSword(new Sword(8, "수호 천사", 0.6, 5000, 12000, 3, true, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)));
  GameManager.appendSword(new Sword(9, "제국의 명령", 0.55, 10000, 30000, 1, true));
  GameManager.appendSword(new Sword(10, "요우무의 유령검", 0.5, 300, 0, 1, true));
  GameManager.appendSword(new Sword(11, "톱날 단검", 0.45, 300, 100, 1, true));
  GameManager.appendSword(new Sword(12, "독사의 송곳니", 0.4, 400, 300, 1, true));
  GameManager.appendSword(new Sword(13, "리치베인", 0.35, 500, 600, 1, true));
  GameManager.appendSword(new Sword(14, "마법사의 최후", 0.3, 600, 1000, 1, true));
  GameManager.appendSword(new Sword(15, "죽음의 무도", 0.25, 700, 1200, 1, true));
  GameManager.appendSword(new Sword(16, "열정의 검", 0.2, 1000, 1500, 1, true));
  GameManager.appendSword(new Sword(17, "몰락한 왕의 검", 0.15, 1500, 3000, 1, true));
  GameManager.appendSword(new Sword(18, "그림자 검", 0.1, 5000, 12000, 1, true));
  GameManager.appendSword(new Sword(19, "구인수의 격노검", 0, 0, 30000, 0, true));

  /* Recipes Setting */
  GameManager.setRepairPaperRecipe(new MoneyItem(300));
  GameManager.setRecipe("BF 대검", new PieceItem("바미의 불씨", 30), new PieceItem("도란의 반지", 30), new MoneyItem(3300));
  GameManager.setRecipe("몰락한 왕의 검", new PieceItem("여신의 눈물", 30), new MoneyItem(300));
  GameManager.setRecipe("요우무의 유령검", new PieceItem("여신의 눈물", 30), new PieceItem("도란의 반지", 30), new SwordItem("무라마나", 1));
  GameManager.setRecipe("독사의 송곳니", new PieceItem("여신의 눈물", 30), new PieceItem("도란의 반지", 30), new SwordItem("구인수의 격노검", 1));

  /* Init Game */
  GameManager.init();
}
/* 강화하기 버튼을 눌렀을 때 */
function onClickUpgradeButton() {
  const current_sword = GameManager.getCurrentSword();

  const result = GameManager.test();
  if(result == GameManager.testResult.SUCCESS) {

    GameManager.addRecord(current_sword, "upgrade");
    GameManager.changeMoney(-current_sword.cost);

    const num = Math.random();
    if(num < current_sword.prob) {
        GameManager.upgradeSword();
        GameManager.renderGameInterFace();
    } else {
        const re = current_sword.pieces.map(value => value.calculate());
        re.forEach(value => GameManager.savePiece(value.name, value.count));
        GameManager.popupFallMessage(...re);
    }
  } else if(result == GameManager.testResult.MONEY_LACK) {
    GameManager.popupMoneyLackMessage();
  } else if(result == GameManager.testResult.MAX_UPGRADE) {
    GameManager.popupMaxMessage();
  }

}
/* 판매하기 버튼을 눌렀을 때 */
function onClickSellButton() {
  GameManager.addRecord(GameManager.getCurrentSword(), "sell");
  GameManager.changeMoney(GameManager.getCurrentSword().price);
  GameManager.init();
}
/* 보관하기 버튼을 눌렀을 때 */
function onClickSaveButton() {
  const item = GameManager.getCurrentSword();
  GameManager.saveSword(item.name, 1);
  GameManager.init();
}
/* 복구하기 버튼을 눌렀을 때 */
function onClickRepairButton() {
  if(GameManager.canUseRepairPaper()) {
    GameManager.useRepairPair(GameManager.getCurrentSword().requiredRepairs);
    GameManager.init(GameManager.sword_index);
  }
}
/* 다시하기 버튼을 눌렀을 때 */
function onClickInitButton() {
  GameManager.init();
}

gameStart();