/*

---Class---------------------------------

new Sword(
  name:String,    : 검의 이름
  prob:Number,    : 다음 단계 성공 확률
  cost:Number,    : 다음 단계 강화비용
  price: Number,  : 판매시 가격
  ...pieces: ...Piece : 드랍되는 조각들
)
new Piece(
  name:String,    : 조각 이름
  prob:Number,    : 조각 생성 확률
  max_drop:Number : 최대 생성 확률
)

---Funcion&Variable---------------------------------

Piece.caculate() : Object?
  생성 확률에 따라 성공시 {name: String, count: Number}를, 실패시 null을 반환한다.
  name: 조각 이름
  count: 생성된 조각(prob 성공시 1~max_drop까지는 동일한 확률로 생성)

init() : 게임을 초기화한다.(0강으로 되돌림)

$(selector: String) : Element | selector로 찾은 html 요소를 반환한다.

GameManager : Object | 게임관련 변수와 함수를 가지고 있는 객체
GameManager.swords : Sword[] | 검을 담고 있는 배열
GameManager.sword_index : Number | 현재 몇강인지 담고 있는 정수
GameManager.money : Number | 현재 보유 자산을 담고 있는 변수
GameManager.repair_paper : Number | 현재 가진 복구권 갯수
GameManager.inventory : Object | 보유한 조각, 복구권을 담고 있는 배열
GameManager.records : Object[] | 최근 강화/판매 전적을 담고 있는 배열
GameManager.max_recordable_count : Number | 최대 기록(GameManager.records에 담기는) 가능한 갯수
GameManager.recipes : Object<String: Object<String, Number>> : 제작소에서 만들수 있는 검 조합식을 담고 있는 객체


GameManager.resetSword() | 검을 0강으로 초기화 시킨다.
GameManager.upgradeSword() | 검을 한단계 강화시키고, 최초 강화면 기록한다.
GameManager.canBeRepaired() : Boolean | 현재 가진 복구권으로 복구가 가능한지 반환한다.
GameManager.getCurrentSword() : Sword | 현재 검을 반환한다.
GameManager.appendSword(sword:Sword) | 검을 하나 추가한다.
GameManager.calculateLoss(index:Number) : Number | index를 포함한 검까지 강화하는데 소모된 골드를 계산함.
GameManager.renderGameInterFace() | 검강화 화면을 새로고침 한다.
GameManager.renderGameInformation() | 내 정보 화면을 새로고침 한다.
GameManager.renderInventory() | 보관함 화면을 새로고침 한다.
GameManager.renderMaking() | 제작소 화면을 새로고침 한다.
GameManager.returnDroppedPieces(name: String, count: Number) : Object | {name: name, count: count} 오브젝트로 변경하여 반환한다.
GameManager.popupFallMessage(...pieces : ...Pieces) | 드랍된 조각이 포함된 실패창을 새로고침 한 뒤 띄운다. (pieces는 returnDroppedPieces() 로 반환된 Object의 배열이여야 한다.)
GameManager.changeGold(Number) | 보유 자산을 Number 만큼 가감한다.
GameManager.addRecord(sword: Sword, *mod: String) *"upgrade" || "sell" | 최근 기록에 추가한다.
GameManager.makeSword(sword_name: String) : sword_name 이름의 검을 제작한다. 재료가 없을 시 아무것도 작동하지 않는다.

*GameManager.showGameInterface() | 검강화 화면을 새로고침한 후 띄운다.
*GameManager.showGameInformation() | 내정보 화면을 새로고침 한 후 띄운다.
*GameManager.showInventory() | 보관함 화면을 새로고침 한 후 띄운다.
*GameManager.showMaking() | 제작소 화면을 새로고침 한 후 띄운다.
*GameManager.renderFallMessage(...pieces: ...Pieces) | 드랍된 조각을 포함한  실패 화면을 새로고침한다.

*/