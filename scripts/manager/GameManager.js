/* 화면 제어 */
const GameManager = {
  records: [],
  max_recordable_count: 10,
}
GameManager.test = function() {
  if(InventoryManager.getMoney() - SwordManager.getCurrentSword().cost < 0) return TestResult.MONEY_LACK;
  else if(SwordManager.max_upgradable_index < SwordManager.current_sword_index +1) return TestResult.MAX_UPGRADE;
  else return TestResult.SUCCESS;
}

GameManager.renderGameInterFace = function() {

  $("#fall-message").hide();
  $("#max-message").hide();

  const current_sword = SwordManager.getCurrentSword();
  const current_idx = SwordManager.getIndex(current_sword);

  $("#sword-image").src = current_sword.image;

  const number = $("#sword-number");
  number.textContent = SwordManager.current_sword_index + "강";
  if(current_idx == SwordManager.max_upgradable_index) number.classList.add("hightlight");
  else number.classList.remove("hightlight");
  $("#sword-name").textContent = current_sword.name;

  if(current_idx == SwordManager.max_upgradable_index) {
    $("#sword-prob").textContent = "강화 불가";
    $("#sword-cost").textContent = "";
  } else {
    const percent = Math.floor(current_sword.prob *100) + StatManager.getLuckyBracelet();
    $("#sword-prob").textContent = "강화 성공 확률: " + ((percent > 100) ? 100 : percent) + "%";

    const result = current_sword.cost*(100-StatManager.getSmith())/100
    $("#sword-cost").textContent = "강화 비용: " + result + "원";
  }

  const res = current_sword.price*(100+StatManager.getBigMerchant())/100;
  $("#sword-price").textContent = "판매 가격: " + res + "원";

  $("#sell-button")[(SwordManager.current_sword_index == 0) ? "hide" : "display"]();
  $("#save-button")[(SwordManager.getCurrentSword().canSave) ? "display" : "hide"]();
}
GameManager.renderGameInformation = function() {
  const found = [];
  for(let i=0; i<=SwordManager.max_upgradable_index;i++) {
    const value = SwordManager.getSword(i);
    if(SwordManager.isFound(i)) found.push(InformationScreen.makeSwordIcon(value.image, value.name, "sword"));
    else found.push(InformationScreen.makeSwordIcon(Path.unknownPath, "unknown", "unknown"));
  }
  $("#found-swords").replaceChildren(...found);
  $("#found-sword-count").textContent = SwordManager.found_swords.length;
}
GameManager.renderInventory = function() {
  const inner = [];

  if(InventoryManager.repair_paper > 0) {
    inner.push(
      $createElementWithClasses("div", "underline", "bok"),
      InventoryScreen.makeInventoryArticle(Path.repairPath, "복구권", InventoryManager.repair_paper),
      InventoryScreen.makeInventoryArticle()
    );
  }

  const pieces = InventoryManager.getPieces();
  const swords = InventoryManager.getSwords();
  pieces.sort((a, b) => a.count - b.count);
  swords.sort((a, b) => SwordManager.getIndex(a.name) - SwordManager.getIndex(b.name) );

  if(pieces.length != 0) inner.push($createElementWithClasses("div", "underline", "pie"));
  pieces.forEach(value => inner.push(InventoryScreen.makeInventoryArticle(Path.piecePath(value.name), value.name, value.count)));
  if(pieces.length%2 == 1) inner.push(InventoryScreen.makeInventoryArticle());

  if(swords.length != 0)inner.push($createElementWithClasses("div", "underline", "swo"));
  swords.forEach(value => inner.push(InventoryScreen.makeInventoryArticle(Path.swordPath(value.name), value.name, value.count, () => InventoryManager.sellSword(value.name))));
  if(swords.length%2 == 1) inner.push(InventoryScreen.makeInventoryArticle());

  if(pieces.length == 0 && swords.length == 0) {
    $(".inventory_window main").classList.add("empty_inventory");
    if(InventoryManager.repair_paper <= 0) {
      const p = $createElementWithClasses("p", "no_item");
      p.textContent = "보관된 아이템이 없습니다.";
      inner.push(p);
    }
  } else $(".inventory_window main").classList.remove("empty_inventory");

  $("#inventory-items").replaceChildren(...inner);
}
GameManager.renderMaking = function() {

  const inner = [];
  const sale = StatManager.getMagicHat();

  const material = MakingScreen.makeMaterialSection(MakingManager.repair_paper_recipe);

  const result = MakingScreen.makeResultSection(Path.repairPath, "복구권", InventoryManager.repair_paper);
  const article = MakingScreen.makeGroupArticle(
    material, 
    result, 
    !MakingManager.canMake(MakingManager.repair_paper_recipe), 
    () => MakingManager.makeRepairPaper());

  inner.push(article);

  for(const [sword_name, recipe] of Object.entries(MakingManager.recipes)) {
    const material = MakingScreen.makeMaterialSection(recipe, sale);
    const result = (SwordManager.isFound(sword_name)) ? MakingScreen.makeResultSection(Path.swordPath(sword_name), sword_name) : MakingScreen.makeResultSection(Path.unknownPath, "발견 안됨");
    const article = MakingScreen.makeGroupArticle(
      material, 
      result, 
      !(MakingManager.canMake(recipe) && SwordManager.current_sword_index == 0),
      () => MakingManager.makeSword(sword_name)
    );
    inner.push(article);
  }
  $("#recipes").replaceChildren(...inner);
}
GameManager.renderStat = function() {
  const stb = StatManager.stats.map((value) => StatScreen.makeStatSection(value));
  $("#stat_box").replaceChildren(...stb);

  $("#stat-point-count").textContent = StatManager.stat_point;
}
GameManager.renderFallMessage = function(...pieces) {

  if(pieces.length != 0 && !pieces.every(value => value instanceof PieceItem))
    throw new TypeError(`${pieces.filter(value => !(value instanceof Item)).join(", ")} is not pieceItem`);

  const pieces_box = $("#pieces");

  $("#loss").textContent = "손실: " + SwordManager.calculateLoss(SwordManager.current_sword_index) + "원";

  const ret = pieces.map(ele => FallMessageScreen.makeDroppedPieceDiv(ele.name, ele.count));

  pieces_box.replaceChildren(...ret);

  if(InventoryManager.canUseRepairPaper(SwordManager.getCurrentSword().requiredRepairs)) {
    $("#fix-button").display();
    $("#required-count").textContent = `복구권 ${SwordManager.getCurrentSword().requiredRepairs}개로 복구할 수 있습니다. (${InventoryManager.repair_paper}/${SwordManager.getCurrentSword().requiredRepairs})`;
    $("#required-count").classList.remove("red-text");
  } else {
    $("#fix-button").hide();
    $("#required-count").textContent = `복구권이 부족하여 복구할 수 없습니다. (${InventoryManager.repair_paper}/${SwordManager.getCurrentSword().requiredRepairs})`;
    $("#required-count").classList.add("red-text");
  }
}
GameManager.renderInvalidationMessage = function() {
  $("#downgrade").textContent = SwordManager.current_sword_index + "강으로 떨어졌습니다!";
}
GameManager.renderGreatSuccessMessage = function() {
  $("#what_count").textContent = SwordManager.current_sword_index + "강이 되었습니다!";
}

GameManager.money_change_kef = [{opacity: '1', transform: 'translate(-30%, 0%)'},{opacity: '0', transform: 'translate(-30%, -70%)'}];
GameManager.setMoney = function(num) {
  InventoryManager.setMoney(num);
  this.renderMoney();
}
GameManager.changeMoney = function(num) {
  InventoryManager.changeMoney(num);

  const money_change_span = $("#money-change");
  money_change_span.textContent = ((num >= 0) ? "+" + num : num) + "원";
  money_change_span.animate(this.money_change_kef, {duration: 300, fill: "both"});
  this.renderMoney();
}
GameManager.renderMoney = function() {
  $("#money-number").textContent = InventoryManager.getMoney();
}
GameManager.addRecord = function(sword, type) {
  // if(sword instanceof Sword) this.swords.push(sword);
  // else throw new TypeError(`${sword} is not a sword.`);
  if(type != "upgrade" && type != "sell") throw new Error(`${type} is not 'upgrade' or 'sell'.`);

  this.records.push({sword: sword, type: type});
  let idx = this.records.length - this.max_recordable_count;
  if(idx < 0) idx = 0;

  this.records = this.records.slice(idx);
  this.renderRecords();
}
GameManager.renderRecords = function () {
  const ret = this.records.map(rec => {
    const p = document.createElement("p");
    if(rec.type == "upgrade")
      p.textContent = `${rec.sword.name} 강화 -${rec.sword.cost}`;
    else if(rec.type == "sell")
      p.textContent =  `${rec.sword.name} 판매 +${rec.sword.price}`;
    return p;
  });

  $("#records").replaceChildren(...ret);
}
GameManager.changeBody = function(id) {
  $("#main-body").replaceChildren(document.importNode($("#" + id).content, true));
}
GameManager.showGameInterface = function() {
  this.changeBody("game-interface");
  this.renderGameInterFace();
}
GameManager.showGameInformation = function() {
  this.changeBody("game-information");
  this.renderGameInformation();
}
GameManager.showInventory = function() {
  this.changeBody("inventory");
  this.renderInventory();
}
GameManager.showMaking = function() {
  this.changeBody("making");
  this.renderMaking();
}
GameManager.showStat = function() {
  this.changeBody("game-stat");
  this.renderStat();
}
GameManager.popup_kef = [{opacity: '0'}, {opacity: '1'}];
GameManager.popupMessage = function(message_box) {
  message_box.display();
  message_box.animate(
    this.popup_kef,
    {duration: 300, fill: "both"}
  );
}
GameManager.popupMaxMessage = function() {
  this.popupMessage($("#max-message"));
}
GameManager.popupMoneyLackMessage = function() {
  this.popupMessage($("#money-lack-message"));
}
GameManager.popupFallMessage = function(...pieces) {
  this.renderFallMessage(...pieces);
  this.popupMessage($("#fall-message"));
}
GameManager.popupInvalidationMessage = function() {
  this.renderInvalidationMessage();
  this.popupMessage($("#invalidation-message"))
}
GameManager.popupGreatSuccessMessage = function() {
  this.renderGreatSuccessMessage();
  this.popupMessage($("#great-success-message"))
}
GameManager.popupGameEndMessage = function() {
  this.popupMessage($("#game-end-message"))
}
GameManager.lodding_kef = [{opacity: '0'}, {opacity: '1'}];
GameManager.hammer_kef = [{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0deg)", offset: 0, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: .5, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0turn)", offset: 1}];
GameManager.animateLodding = function(duration, onfinish) {
  const lodding = $("#maker-window-lodding");
  const hammer = $("#maker-window-lodding div");

  lodding.display();    
  lodding.animate(this.lodding_kef, {duration: duration/2});
  hammer.animate(this.hammer_kef, {duration: duration, iterations: 2});
  setTimeout(() => {
    onfinish();
    lodding.animate(
      this.lodding_kef,
      {duration: duration/2, direction: "reverse"}
    ).onfinish = () => lodding.hide();
  }, duration);
}
GameManager.init = function(start) {
  if(start !== undefined) SwordManager.jumpTo(start);
  else SwordManager.resetSword();
  this.showGameInterface();
  this.renderMoney();
}
$("#main-game-button").addEventListener("click", () => {GameManager.showGameInterface();});
$("#information-button").addEventListener("click", () => {GameManager.showGameInformation();});
$("#inventory-button").addEventListener("click", () => {GameManager.showInventory();});
$("#making-button").addEventListener("click", () => {GameManager.showMaking();});
$("#stat-button").addEventListener("click", () => {GameManager.showStat();});

const onClickCloseButton = id => $("#" + id).hide();