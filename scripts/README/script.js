function gameStart() {
  /* Game Setting */
  MoneyDisplay.setMoney(100000);
  /* Sword Setting */
  SwordManager.appendSword(new Sword("단검", 1.0, 300, 0, 3, false));
  SwordManager.appendSword(new Sword("롱소드", 0.95, 300, 100, 3, false));
  SwordManager.appendSword(new Sword("처형인의 대검", 0.9, 400, 300, 3, false));
  SwordManager.appendSword(new Sword("BF 대검", 0.85, 500, 600, 3, false));
  SwordManager.appendSword(new Sword("마나무네", 0.8, 600, 1000, 3, false));
  SwordManager.appendSword(new Sword("무라마나", 0.75, 700, 1200, 3, true, new Piece("바미의 불씨", 1.0, 5, 10), new Piece("도란의 반지", 1.0, 20, 100)));
  SwordManager.appendSword(new Sword("드락사르의 황혼검", 0.7, 1000, 1500, 3, true, new Piece("바미의 불씨", 1.0, 5, 10), new Piece("도란의 반지", 1.0, 20, 100)));
  SwordManager.appendSword(new Sword("무한의 대검", 0.65, 1500, 3000, 3, true, new Piece("바미의 불씨", 1.0, 5, 10), new Piece("도란의 반지", 1.0, 20, 100)));
  SwordManager.appendSword(new Sword("수호 천사", 0.6, 5000, 12000, 3, true, new Piece("바미의 불씨", 1.0, 5, 10), new Piece("도란의 반지", 1.0, 20, 100)));
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
  MakingManager.setRecipe("구인수의 격노검", new PieceItem("여신의 눈물", 30), new PieceItem("도란의 반지", 30), new SwordItem("독사의 송곳니", 1));
  MakingManager.setRecipe("그림자 검", new PieceItem("여신의 눈물", 30), new PieceItem("도란의 반지", 30), new SwordItem("그림자 검", 1));
  MakingManager.setRecipe("리치베인", new PieceItem("여신의 눈물", 30), new PieceItem("도란의 반지", 30), new SwordItem("요우무의 유령검", 1));
  MakingManager.setRecipe("톱날 단검", new PieceItem("거인의 허리띠", 30), new PieceItem("도란의 반지", 30), new SwordItem("리치베인", 1));
  /* Init Game */
  GameManager.init();
}
/* 강화하기 버튼을 눌렀을 때 */
function onClickUpgradeButton() {
  const current_sword = SwordManager.getCurrentSword();
  const result = SwordManager.test();
  if(result == TestResult.SUCCESS) { // 강화 가능 상태일 때
    const cost = StatManager.calculateSmith(current_sword.cost);
    RecordStorage.addRecord("upgrade", current_sword.name, cost); // 기록
    MoneyDisplay.changeMoney(-cost); // 돈 변경
    const prob = StatManager.calculateLuckyBraclet(current_sword.prob); // [ 행운 팔찌 ] 스탯 계산
    if(Math.random() < prob) { // 성공하면
        if(Math.random() < StatManager.getGodHand()/100) { // 대성공 계산
          SwordManager.upgradeSword(2); // +2강
          MessageWindow.popupGreatSuccessMessage(); // 대성공 메세지
        } else { // 대성공이 실패하면
          SwordManager.upgradeSword(); // +1강
        }
        MainScreen.render(); // 화면 새로고침
    } else {
        const re = current_sword.pieces.map(value => value.calculate()); // 떨어진 조각 맵핑
        re.forEach(value => InventoryManager.savePiece(value.name, value.count)); // 조각 저장
        const percent = StatManager.getInvalidatedSphere()/100; // [ 무효화 구체 ] 스탯 확률
        if(Math.random() < percent) { // [ 무효화 구체 ] 성공시
          SwordManager.downgradeSword(); // -1강
          MainScreen.render(); // 화면 새로고침
          MessageWindow.popupInvalidationMessage(); // 구체 발도 메세지
        } else {
          MessageWindow.popupFallMessage(...re); // 실패 메세지
        }
    }
  } else if(result == TestResult.RESOURCES_LACK) { //돈 부족
    MessageWindow.popupMoneyLackMessage(); // 돈 부족 메세지
  } else if(result == TestResult.MAX_UPGRADE) { // 최대 강화 달성
    MessageWindow.popupMaxMessage(); // 최대 강화 축하 메세지
  }
}
/* 판매하기 버튼을 눌렀을 때 */
function onClickSellButton() {
  const current_sword = SwordManager.getCurrentSword();
  const price = StatManager.calculateBigMerchant(current_sword.price); // [ 대상인 ] 스탯 계산
  RecordStorage.addRecord("sell", current_sword.name, price); // 기록 저장
  MoneyDisplay.changeMoney(price); // 돈 변경
  GameManager.init(); // 게임 초기화
}
/* 보관하기 버튼을 눌렀을 때 */
function onClickSaveButton() {
  const current_sword = SwordManager.getCurrentSword();
  InventoryManager.saveSword(current_sword.name, 1); // 검 저장
  GameManager.init(); // 게임 초기화
}
/* 복구하기 버튼을 눌렀을 때 */
function onClickRepairButton() {
  const required = SwordManager.getCurrentSword().requiredRepairs;
  if(InventoryManager.canUseRepairPaper(required)) { // 복구권이 충분하면
    InventoryManager.subtractRepairPaper(required); // 복구권 차감
    GameManager.init(SwordManager.current_sword_index); // 복구한 검부터 재시작
  }
}
/* 다시하기 버튼을 눌렀을 때 */
function onClickInitButton() {
  GameManager.init(); // 게임 초기화
}
/* 스탯 레벨 업 버튼을 눌렀을 때 */
function onStatUp(statName) {
  const result = StatManager.test(statName);
  switch (result) {
    case TestResult.SUCCESS: { // 강화 가능 상태일 때
      StatManager.upgradeStat(statName); // 업그레이드
      StatScreen.render(); // 화면 새로고침
      break;
    }
    case TestResult.MAX_UPGRADE: { // 최대 강화 상태
      MessageWindow.popupMaxStatMessage(); // 최대 강화 알림
      break;
    }
    case TestResult.RESOURCES_LACK: { // 스탯 포인트 부족
      MessageWindow.popupStatPointLackMessage(); // 스탯 포인트 부족 알림
      break;
    }
  }
}
gameStart(); // 게임 시작