function gameStart() {
  /* Game Setting */
  MoneyDisplay.setMoney(100000);
  /* Sword Setting */
  SwordManager.appendSword(new Sword("단검", 1.0, 300, 0, 3, false));
  SwordManager.appendSword(new Sword("롱소드", 0.95, 300, 100, 3, false));
  SwordManager.appendSword(new Sword("처형인의 대검", 0.9, 400, 300, 3, false));
  SwordManager.appendSword(new Sword("BF 대검", 0.85, 500, 600, 3, false));
  SwordManager.appendSword(new Sword("마나무네", 0.8, 600, 1000, 3, false));
  SwordManager.appendSword(new Sword("무라마나", 0.75, 700, 1200, 3, true, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)));
  SwordManager.appendSword(new Sword("드락사르의 황혼검", 0.7, 1000, 1500, 3, true, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)));
  SwordManager.appendSword(new Sword("무한의 대검", 0.65, 1500, 3000, 3, true, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)));
  SwordManager.appendSword(new Sword("수호 천사", 0.6, 5000, 12000, 3, true, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)));
  SwordManager.appendSword(new Sword("제국의 명령", 0.55, 10000, 30000, 1, true));
  SwordManager.appendSword(new Sword("요우무의 유령검", 0.5, 300, 0, 1, true));
  SwordManager.appendSword(new Sword("톱날 단검", 0.45, 300, 100, 1, true));
  SwordManager.appendSword(new Sword("독사의 송곳니", 0.4, 400, 300, 1, true));
  SwordManager.appendSword(new Sword("리치베인", 0.35, 500, 600, 1, true));
  SwordManager.appendSword(new Sword("마법사의 최후", 0.3, 600, 1000, 1, true));
  SwordManager.appendSword(new Sword("죽음의 무도", 0.25, 700, 1200, 1, true));
  SwordManager.appendSword(new Sword("열정의 검", 0.2, 1000, 1500, 1, true));
  SwordManager.appendSword(new Sword("몰락한 왕의 검", 0.15, 1500, 3000, 1, true));
  SwordManager.appendSword(new Sword("그림자 검", 0.1, 5000, 12000, 1, true));
  SwordManager.appendSword(new Sword("구인수의 격노검", 0, 0, 30000, 0, true));
  /* Recipes Setting */
  MakingManager.setRepairPaperRecipe(new MoneyItem(300));
  MakingManager.setRecipe("BF 대검", new PieceItem("바미의 불씨", 30), new PieceItem("도란의 반지", 30), new MoneyItem(3300));
  MakingManager.setRecipe("몰락한 왕의 검", new PieceItem("여신의 눈물", 30), new MoneyItem(300));
  MakingManager.setRecipe("요우무의 유령검", new PieceItem("여신의 눈물", 30), new PieceItem("도란의 반지", 30), new SwordItem("무라마나", 1));
  MakingManager.setRecipe("독사의 송곳니", new PieceItem("여신의 눈물", 30), new PieceItem("도란의 반지", 30), new SwordItem("구인수의 격노검", 1));
  /* Init Game */
  GameManager.init();
}
/* 강화하기 버튼을 눌렀을 때 */
function onClickUpgradeButton() {
  const current_sword = SwordManager.getCurrentSword();
  const result = GameManager.test();
  if(result == TestResult.SUCCESS) {
    RecordStorage.addRecord(current_sword, "upgrade");
    MoneyDisplay.changeMoney(-1 * StatManager.calculateSmith(current_sword.cost));
    const prob = StatManager.calculateLuckyBraclet(current_sword.prob);
    if(Math.random() < prob) {
        if(Math.random() < StatManager.getGodHand()/100) {
          SwordManager.upgradeSword(2);
          MessageWindow.popupGreatSuccessMessage();
        } else {
          SwordManager.upgradeSword();
        }
        MainScreen.render();
    } else {
        const re = current_sword.pieces.map(value => value.calculate());
        re.forEach(value => InventoryManager.savePiece(value.name, value.count));
        const percent = StatManager.getInvalidatedSphere()/100;
        if(Math.random() < percent) { //-1강 복구
          SwordManager.downgradeSword();
          MainScreen.render();
          MessageWindow.popupInvalidationMessage();
        } else {
          MessageWindow.popupFallMessage(...re);
        }
    }
  } else if(result == TestResult.MONEY_LACK) {
    MessageWindow.popupMoneyLackMessage();
  } else if(result == TestResult.MAX_UPGRADE) {
    MessageWindow.popupMaxMessage();
  }
}
/* 판매하기 버튼을 눌렀을 때 */
function onClickSellButton() {
  const current_sword = SwordManager.getCurrentSword();
  RecordStorage.addRecord(current_sword, "sell");
  MoneyDisplay.changeMoney(StatManager.calculateBigMerchant(current_sword.price));
  GameManager.init();
}
/* 보관하기 버튼을 눌렀을 때 */
function onClickSaveButton() {
  const item = SwordManager.getCurrentSword();
  InventoryManager.saveSword(item.name, 1);
  GameManager.init();
}
/* 복구하기 버튼을 눌렀을 때 */
function onClickRepairButton() {
  if(InventoryManager.canUseRepairPaper(SwordManager.getCurrentSword().requiredRepairs)) {
    InventoryManager.subtractRepairPaper(SwordManager.getCurrentSword().requiredRepairs);
    GameManager.init(SwordManager.current_sword_index);
  }
}
/* 다시하기 버튼을 눌렀을 때 */
function onClickInitButton() {
  GameManager.init();
}
/* 스탯 레벨 업 버튼을 눌렀을 때 */
function onStatUp(stat) {
  if(StatManager.stat_point > 0) {
    if(stat.current != 5) {
      StatManager.upgradeStat(stat);
      StatScreen.render();
    }
  }
}
gameStart();