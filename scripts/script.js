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
  canSave:Boolean,        : 인벤토리에 저장 가능 여부
  pieces: ...Piece        : 드랍되는 조각들
)
new Piece(
  name:String,    : 조각 이름
  prob:Number,    : 조각 생성 확률
  max_drop:Number : 최대 생성 확률
)

---Funcion&Variable---------------------------------

Piece.caculate() : Object?
  생성 확률에 따라 성공시 {name: String, count: Number}, 실패시 null
  name: 생성된 조각 이름
  count: 생성된 조각 갯수(prob 성공시 1~max_drop까지는 동일한 확률로 생성)

init() : 게임을 초기화한다.(0강으로 되돌림)

$(selector: String) : Element | selector로 찾은 html 요소를 반환

GameManager.swords: Sword[]     | Sword가 담긴 배열
GameManager.sword_index: Number | 현재 강화 번호
GameManager.money: Number       | 현재 가진 돈
GameManager.repair_paper_recipe | 복구권 레시피 배열
GameManager.recipes             | 아이템 레시피 객체

GameManager.getCurrentSword() : Sword
  
GameManager.appendSword(sword: Sword)
  
GameManager.addRecord(sword: Sword, type: "upgrade" || "sell") 
  
GameManager.changeGold(gold: Number)
  
GameManager.upgradeSword()
  
GameManager.savePiece(name: String, count: Number)
  
GameManager.saveSword(name: String, count: Number)
  
GameManager.popupFallMessage(pieces: ...Piece)
  
GameManager.renderGameInterFace()
  
GameManager.init(start: Number)
  
GameManager.useRepairPair(count: Number) : Boolean
  
*/