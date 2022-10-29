/*

---Class---------------------------------

new PieceItem(
  name:String,  : 조각의 이름
  count:Number  : 조각의 갯수
)
new SwordItem(
  name:String,  : 검의 이름
  count:Number  : 검의 갯수
)
new MoneyItem(
  count:Number  : 돈의 수량
)

new Sword(
  index:Number,           : 검의 강화 번호
  name:String,            : 검의 이름
  prob:Number,            : 다음 단계 성공 확률
  cost:Number,            : 다음 단계 강화비용
  price:Number,           : 판매시 가격
  requiredRepairs:Number, : 필요한 복구권 갯수
  canSave:Boolean,        : 보관함에 저장 가능 여부
  pieces: ...Piece        : 드랍되는 조각들
)
new Piece(
  name:String,    : 조각 이름
  prob:Number,    : 조각 생성 확률
  max_drop:Number : 최대 생성 확률
)

---Funcion&Variable---------------------------------

Piece.calculate() : PieceItem
  생성 확률에 따라 성공시 PieceItem, 실패시 null

init() : 게임을 초기화한다.(0강으로 되돌림)

$(selector: String) : Element | selector로 찾은 html 요소를 반환

GameManager.swords: Sword[]     | Sword가 담긴 배열
GameManager.max_upgradable_index: Number | 최대 강화 가능 번호
GameManager.sword_index: Number | 현재 강화 번호
GameManager.money: Number       | 현재 가진 돈
GameManager.repair_paper        | 현재 가진 복구권 갯수
GameManager.repair_paper_recipe | 복구권 조합법 배열
GameManager.recipes             | 아이템 조합법 객체

GameManager.getCurrentSword() : Sword
  현재 가지고 있는 검을 반환합니다.
GameManager.appendSword(sword: Sword)
  sword를 검 리스트에 추가합니다.
GameManager.addRecord(sword: Sword, type: "upgrade" || "sell") 
  기록 보관함에 sword를 type한 기록을 합니다.
GameManager.changeGold(gold: Number)
  가진 자산을 gold만큼 변경합니다.
GameManager.upgradeSword()
  검을 +1강 합니다.
GameManager.savePiece(name: String, count: Number)
  name인 조각을 count만큼 보관함에 저장합니다.
GameManager.saveSword(name: String, count: Number)
  name인 검을 count만큼 보관함에 저장합니다.
GameManager.setRepairPaperRecipe(...materials: ...Item)
  복구권 조합법을 materials로 정합니다.
GameManager.addRecipe(resultItem: String, ...materials: ...Item)
  이름이 resultItem인 검으로 워프권의 조합법을 materials로 정합니다.
GameManager.popupFallMessage(...pieces: ...Piece)
  검 파괴 알림을 떨어진 조각 정보와 함께 보여줍니다.
GameManager.renderGameInterFace()
  메인 게임 화면을 새로고침합니다.
GameManager.init(start: Number)
  GameManager.init() : 검을 0강으로 초기화 후 메인 게임 화면을 보여줍니다.
  GameManager.init(start) : 검을 start강으로 초기화 후 메인 게임 화면을 보여줍니다.
GameManager.useRepairPair(count: Number) : Boolean
  복구권을 count만큼 차감 후 true 반환하고, 사용 불가시(갯수 부족) false 반환합니다.
*/
function gameStart() {
  /* Game Setting */
  GameManager.max_upgradable_index = 30;
  GameManager.money = 100000;
  GameManager.repair_paper = 0;

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
  GameManager.appendSword(new Sword(19, "구인수의 격노검", 0.5, 10000, 30000, 1, true));

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
  if(GameManager.money - current_sword.cost <= 0) return;
  GameManager.addRecord(current_sword, "upgrade");
  GameManager.changeGold(-current_sword.cost);
  const num = Math.random();
  console.log(num, current_sword.prob);
  if(num < current_sword.prob) {
      GameManager.upgradeSword();
      GameManager.renderGameInterFace();
  } else {
      const re = current_sword.pieces.map(value => value.calculate());
      re.forEach(value => GameManager.savePiece(value.name, value.count));
      GameManager.popupFallMessage(...re);
  }
}
/* 판매하기 버튼을 눌렀을 때 */
function onClickSellButton() {
  GameManager.addRecord(GameManager.getCurrentSword(), "sell");
  GameManager.changeGold(GameManager.getCurrentSword().price);
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
  if(GameManager.useRepairPair(GameManager.getCurrentSword().requiredRepairs)) {
    GameManager.init(GameManager.sword_index)
  }
}
/* 다시하기 버튼을 눌렀을 때 */
function onClickInitButton() {
  GameManager.init();
}
gameStart();