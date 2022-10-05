/*

class

new Sword(
  name:String,    :검의 이름
  prob:Number,    :다음 단계 성공 확률
  cost:Number,    :다음 단계 강화비용
  price: Number,  :판매시 가격
  ...pieces: ...Piece :드랍되는 조각들
)
new Piece(
  name:String,    : 조각 이름
  prob:Number,    : 조각 생성 확률
  max_drop:Number : 최대 생성 확률
)

Piece.caculate() : Object?
  생성 확률에 따라 성공시 {name: String, count: Number}를, 실패시 null 반환
  name: 조각 이름
  count: 생성된 조각(prob 성공시 1~max_drop까지는 동일한 확률로 생성됨)




init() : 검을 0강으로 되돌린다

GameManager.getCurrentSword() : Sword | 현재 검을 반환한다.
GameManager.appendSword(sword:Sword) | 검을 하나 추가한다.
GameManager.calculateLoss(index:Number) : Number | index를 포함한 검까지 강화하는데 소모된 골드를 계산함.
GameManager.renderGameInterFace() | 검강화 화면을 새로고침 한다.
GameManager.renderGameInformation() | 내 정보 화면을 새로고침 한다.
GameManager.renderInventory() | 보관함 화면을 새로고침 한다.
GameManager.renderFallMessage(...pieces: ...Pieces) | 드랍된 조각을 포함한  실패 화면을 새로고침한다.
GameManager.changeGold(Number) | 보유 자산을 Number 만큼 가감한다.
GameManager.addRecord(Sword, *Mod) *"upgrade" || "sell" | 최근 기록에 추가한다.

showGameInterface() | 검강화 화면을 새로고침한 후 띄운다.
showGameInformation() | 내정보 화면을 새로고침 한 후 띄운다.
showInventory() | 보관함 화면을 새로고침 한 후 띄운다.
popupFallMessage(...pieces) | 

*/