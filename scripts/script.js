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

Piece.calculate() : PieceItem
  생성 확률에 따라 성공시 PieceItem, 실패시 null

init() : 게임을 초기화한다.(0강으로 되돌림)

$(selector: String) : Element | selector로 찾은 html 요소를 반환

GameManager.swords: Sword[]     | Sword가 담긴 배열
GameManager.sword_index: Number | 현재 강화 번호
GameManager.money: Number       | 현재 가진 돈
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
GameManager.popupFallMessage(pieces: ...Piece)
  검 파괴 알림을 떨어진 조각 정보와 함께 보여줍니다.
GameManager.renderGameInterFace()
  메인 게임 화면을 새로고침합니다.
GameManager.init(start: Number)
  GameManager.init() : 검을 0강으로 초기화 후 메인 게임 화면을 보여줍니다.
  GameManager.init(start) : 검을 start강으로 초기화 후 메인 게임 화면을 보여줍니다.
GameManager.useRepairPair(count: Number) : Boolean
  복구권을 count만큼 차감 후 true 반환하고, 사용 불가시(갯수 부족) false 반환합니다.

*조합법 작성 방법

GameManager.repair_paper_recipe = *material_list0 -> material_list0으로 복구권을 만드는 조합법

GameManager.recipes = [
{"A": *material_list1} -> material_list1으로 A를 만드는 조합법
{"B": *material_list2} -> material_list2으로 B를 만드는 조합법
{"C": *material_list3} -> material_list3으로 C를 만드는 조합법
{"D": *material_list4} -> material_list4으로 D를 만드는 조합법
]

*material_list 작성 방법
[
  new PieceItem("X", 1),
  new PieceItem("Y", 2),
  new SwordItem("Z", 3),
  new MoneyItem(100)
] -> 조각X 1개 + 조각Y 2개 + 검Z 3개 + 100원이 재료로 필요함


*/