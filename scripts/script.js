function gameStart() {
  /* Game Setting */
  MoneyDisplay.setMoney(500000);
  /* Sword Setting */
  SwordManager.appendSword(new Sword("단검",1.0,300,0,1,false));
  SwordManager.appendSword(new Sword("롱소드",1.0,500,100,1,false));
  SwordManager.appendSword(new Sword("분노의 칼",1.0,700,300,1,false));
  SwordManager.appendSword(new Sword("도란의 검",0.96,1000,500,1,false));
  SwordManager.appendSword(new Sword("주문포식자",0.90,1500,800,1,true,new Piece("나보리 신속검",0.5)));
  SwordManager.appendSword(new Sword("BF 대검",0.9,2000,1000,3,true,new Piece("나보리 신속검",0.5),new Piece("요정의 부적",0.5)));
  SwordManager.appendSword(new Sword("광휘의 검",0.85,3000,1500,3,true,new Piece("나보리 신속검",0.5),new Piece("점화석",0.5)));
  SwordManager.appendSword(new Sword("처형인의 대검",0.8,5000,3000,3,true,new Piece("나보리 신속검",0.5),new Piece("요정의 부적",0.5),new Piece("망가진 초시계",0.5),new Piece("초시계",0.5)));
  SwordManager.appendSword(new Sword("수호자의 검",0.8,6000,5000,3,true,new Piece("방출의 마법봉",1),new Piece("요정의 부적",0.5),new Piece("점화석",1, 2)));
  SwordManager.appendSword(new Sword("그림자 검",0.75,8000,10000,3,true,new Piece("여신의 눈물",0.5),new Piece("망각의 구",0.5)));
  SwordManager.appendSword(new Sword("열정의 검",0.7,10000,15000,3,true,new Piece("나보리 신속검",1),new Piece("미니언 해체 분석기",0.5),new Piece("바미의 불씨",0.5)));
  SwordManager.appendSword(new Sword("톱날 단검",0.7,12000,25000,3,true,new Piece("나보리 신속검",1, 2),new Piece("점화석",1, 2)));
  SwordManager.appendSword(new Sword("독사의 송곳니",0.65,15000,37000,5,true,new Piece("여신의 눈물",1),new Piece("충전형 물약", 0.5, 2),new Piece("마법의 영약", 0.5)));
  SwordManager.appendSword(new Sword("구인수의 격노검",0.65,20000,60000,5,true,new Piece("수은 장식띠",0.5)));
  SwordManager.appendSword(new Sword("폭풍갈퀴",0.6,25000,100000,5,true,new Piece("망각의 구",0.75),new Piece("수은 장식띠",0.5),new Piece("삼위일체",0.5)));
  SwordManager.appendSword(new Sword("핏빛 칼날",0.6,30000,150000,5,true,new Piece("삼위일체",0.75, 2),new Piece("바미의 불씨",1, 2)));
  SwordManager.appendSword(new Sword("헤르메스의 시미터",0.55,40000,250000,7,true,new Piece("미니언 해체 분석기",0.75),new Piece("수은 장식띠",1),new Piece("충전형 물약", 1)));
  SwordManager.appendSword(new Sword("수호천사",0.5,50000,325000,7,true,new Piece("점화석",0.75)));
  SwordManager.appendSword(new Sword("마법사의 최후",0.45,70000,430000,7,true,new Piece("에테르 환영",0.75)));
  SwordManager.appendSword(new Sword("마나무네",0.4,100000,650000,7,true,new Piece("여신의 눈물",1),new Piece("마법의 영약", 1)));
  SwordManager.appendSword(new Sword("무라마나",0.4,150000,850000,7,true,new Piece("방출의 마법봉",1),new Piece("여신의 눈물",1)));
  SwordManager.appendSword(new Sword("피바라기",0.35,200000,1230000,10,true,new Piece("삼위일체",0.75),new Piece("역병의 보석",0.5)));
  SwordManager.appendSword(new Sword("월식",0.3,300000,2070000,10,true,new Piece("신록의 장막",0.75),new Piece("심연의 가면",0.5)));
  SwordManager.appendSword(new Sword("드락사르의 황혼검",0.3,500000,3000000,10,true,new Piece("역병의 보석",1,3),new Piece("망각의 구",1, 2)));
  SwordManager.appendSword(new Sword("리치베인",0.25,700000,6000000,10,true,new Piece("심연의 가면",0.8,3)));
  SwordManager.appendSword(new Sword("요우무의 유령검",0.25,1000000,9000000,13,true,new Piece("요정의 부적",1,2)));
  SwordManager.appendSword(new Sword("맬모셔스의 아귀",0.2,1300000,11500000,13,true,new Piece("원칙의 원형낫",0.9,2)));
  SwordManager.appendSword(new Sword("무한의 대검",0.1,1500000,13700000,13,true,new Piece("나보리 신속검",1,10),new Piece("요정의 부적",1,10),new Piece("점화석",1,10),new Piece("망가진 초시계",1,20)));
  SwordManager.appendSword(new Sword("몰락한 왕의 검",0.05,2000000,17000000,15,true,new Piece("나보리 신속검",1,20),new Piece("요정의 부적",1,20),new Piece("점화석",1,20),new Piece("망가진 초시계",1, 20)));
  SwordManager.appendSword(new Sword("제국의 명령",0,0,100000000,0,true));
  
  /* Recipes Setting */
  MakingManager.setRepairPaperRecipe(new MoneyItem(300));
  MakingManager.setRecipe("폭풍갈퀴",new PieceItem("나보리 신속검",1),new PieceItem("요정의 부적",3));
  MakingManager.setRecipe("핏빛 칼날",new PieceItem("점화석",3),new PieceItem("나보리 신속검",1));
  MakingManager.setRecipe("헤르메스의 시미터",new PieceItem("수은 장식띠",1),new PieceItem("원기 회복의 구슬",3));
  MakingManager.setRecipe("수호천사",new PieceItem("초시계",3),new PieceItem("망가진 초시계",1),new SwordItem("BF 대검",1));
  MakingManager.setRecipe("마법사의 최후",new PieceItem("방출의 마법봉",1),new PieceItem("망각의 구",1),new PieceItem("충전형 물약",3));
  MakingManager.setRecipe("마나무네",new PieceItem("여신의 눈물",3),new PieceItem("미니언 해체 분석기",3),new PieceItem("삼위일체",3));
  MakingManager.setRecipe("무라마나",new PieceItem("여신의 눈물",3),new PieceItem("마법의 영약",2),new SwordItem("마나무네",1));
  MakingManager.setRecipe("피바라기",new PieceItem("바미의 불씨",3),new PieceItem("삼위일체",5),new SwordItem("BF 대검",1));
  MakingManager.setRecipe("월식",new PieceItem("증오의 사슬",3),new PieceItem("에테르 환영",3),new SwordItem("톱날 단검",3));
  MakingManager.setRecipe("드락사르의 황혼검",new SwordItem("톱날 단검",3),new PieceItem("원칙의 원형낫",3));
  MakingManager.setRecipe("리치베인",new PieceItem("에테르 환영",4),new PieceItem("방출의 마법봉",1),new SwordItem("광휘의 검",3));
  MakingManager.setRecipe("요우무의 유령검",new SwordItem("톱날 단검",4),new PieceItem("심연의 가면",4),new PieceItem("신록의 장벽",4));
  MakingManager.setRecipe("맬모셔스의 아귀",new PieceItem("요정의 부적",5),new PieceItem("역병의 보석",5),new SwordItem("주문포식자",1));
  MakingManager.setRecipe("무한의 대검",new PieceItem("원칙의 원형낫",5),new SwordItem("BF 대검",5),new SwordItem("무라마나",1));
  MakingManager.setRecipe("몰락한 왕의 검",new PieceItem("망각의 구",5),new PieceItem("심연의 가면",5),new SwordItem("무한의 대검",1),new SwordItem("피바라기",1));
  MakingManager.setRecipe("제국의 명령",new SwordItem("몰락한 왕의 검",1),new SwordItem("무한의 대검",1),new SwordItem("맬모셔스의 아귀",1),new SwordItem("요우무의 유령검",1));

  /* Init Game */
  Game.init();
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

        const re = current_sword.pieces.map(value => value.calculate()).filter(value => value !== null); // 떨어진 조각 맵핑
        re.forEach(value => InventoryManager.savePiece(value.name, value.count)); // 조각 저장
        const percent = StatManager.getInvalidatedSphere()/100; // [ 무효화 구체 ] 스탯 확률
        if(Math.random() < percent) { // [ 무효화 구체 ] 성공시
          SwordManager.downgradeSword(); // -1강
          MainScreen.render(); // 화면 새로고침
          MessageWindow.popupInvalidationMessage(...re); // 구체 발동 메세지
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
  Game.init(); // 게임 초기화
}
/* 보관하기 버튼을 눌렀을 때 */
function onClickSaveButton() {
  const current_sword = SwordManager.getCurrentSword();
  InventoryManager.saveSword(current_sword.name, 1); // 검 저장
  Game.init(); // 게임 초기화
}
/* 복구하기 버튼을 눌렀을 때 */
function onClickRepairButton() {
  const required = SwordManager.getCurrentSword().requiredRepairs;
  if(InventoryManager.canUseRepairPaper(required)) { // 복구권이 충분하면
    InventoryManager.subtractRepairPaper(required); // 복구권 차감
    Game.init(SwordManager.current_sword_index); // 복구한 검부터 재시작
  }
}
/* 다시하기 버튼을 눌렀을 때 */
function onClickInitButton() {
  Game.init(); // 게임 초기화
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
loadAllImg();