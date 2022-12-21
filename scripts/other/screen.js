/**
 * 게임 관련 객체
 */
 const Game = {
  /**
  * 검을 초기화하고 메인 게임 화면을 보여줍니다.
  * @param {number?} start 검을 몇강으로 초기화 할 지 정합니다. 생략시 0강으로 초기화합니다.
  */
  init(start=0) {
    SwordManager.jumpTo(start);
    MainScreen.show();
  }
};
/* 화면 제어 */
const changeBody = id => $("#main-body").replaceChildren(document.importNode($("#" + id).content, true));
const Keyframes = {
  lodding_kef: [{opacity: '0'}, {opacity: '1'}],
  hammer_kef: [{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0deg)", offset: 0, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: .4, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0turn)", offset: .7, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: 1, easing: "ease" }],
  popup_kef: [{opacity: '0'}, {opacity: '1'}],
  money_change_kef: [{opacity: '1', transform: 'translate(-30%, 0%)'},{opacity: '0', transform: 'translate(-30%, -70%)'}]
};
/**
 * 메인 게임 화면을 제어합니다.
 */
const MainScreen = {};
MainScreen.show = function() {
  changeBody("game-interface");
  this.render();
};
/**
 * 메인 게임 화면을 새로고침합니다.
 */
MainScreen.render = function() {
  const current_sword = SwordManager.getCurrentSword();
  const isUpgradable = SwordManager.max_upgradable_index != SwordManager.getIndex(current_sword);

  $("#sword-image").src = Path[current_sword.name];

  const number = $("#sword-number").text(SwordManager.current_sword_index);

  if(!isUpgradable) number.classList.add("hightlight");

  $("#sword-name").text(current_sword.name);

  const prob = $("#sword-prob");
  const cost = $("#sword-cost");
  prob.setAttribute("enabled", isUpgradable);
  cost.setAttribute("enabled", isUpgradable);
  if(isUpgradable) {
    prob.text(Math.floor(StatManager.calculateLuckyBraclet(current_sword.prob)*100));
    cost.text(StatManager.calculateSmith(current_sword.cost));
  } else {
    prob.text("");
    cost.text("");
  }
  $("#sword-price").text(StatManager.calculateBigMerchant(current_sword.price));
  if(current_sword.price > 0) $("#sell-button").style.visibility = "visible";
  if(current_sword.canSave) $("#save-button").style.visibility = "visible";
};
/**
 * 보관함 화면을 제어합니다.
 */
const InventoryScreen = {};
InventoryScreen.makeHoverSellDiv = function(onclick) {
  const div = $createElementWithClasses("div", "hover_sell");
  div.appendChild($createElement("span").text("판매 하기"));
  div.addEventListener("click", onclick);
  return div;
};
InventoryScreen.makeInventoryArticle = function(src, name, count, sellFnc) {
  const article = $createElementWithClasses("article", "group");

  const div = $createElementWithClasses("div", "item");
  const img = $createImgWithSrc(src);
  if(sellFnc !== undefined) div.appendChild(this.makeHoverSellDiv(sellFnc));
  div.appendChild(img);

  article.appendChildren(
    div,
    $createElementWithClasses("p", "item_name").text(name),
    $createElementWithClasses("p", "item_count").text(count));
  return article;
};
InventoryScreen.makeRepairGroupSection = function() {
  const repair_group = $createElementWithClasses("section", "item_group");
  repair_group.appendChildren(
    $createElementWithClasses("div", "underline", "bok"),
    this.makeInventoryArticle(Path.repair, "복구권", InventoryManager.repair_paper),
  )
  return repair_group;
}
InventoryScreen.makePieceGroupSection = function(pieceList) {
  const piece_group = $createElementWithClasses("section", "item_group");
  piece_group.appendChild($createElementWithClasses("div", "underline", "pie"));
  pieceList.forEach(value => piece_group.appendChild(this.makeInventoryArticle(Path[value.name], value.name, value.count)));
  return piece_group;
}
InventoryScreen.makeSwordGroupSection = function(swordList) {
  const sword_group = $createElementWithClasses("section", "item_group");
  sword_group.appendChild($createElementWithClasses("div", "underline", "swo"));
  swordList.forEach(value => sword_group.appendChild(this.makeInventoryArticle(Path[value.name], value.name, value.count, () => InventoryManager.sellSword(value.name))));
  return sword_group;
}
InventoryScreen.show = function() {
  changeBody("inventory");
  this.render();
};
InventoryScreen.render = function() {
  const inner = [];

  if(InventoryManager.repair_paper > 0) inner.push(this.makeRepairGroupSection());

  const pieces = InventoryManager.getPieces();
  if(pieces.length != 0) {
    pieces.sort((a, b) => a.count - b.count);
    inner.push(this.makePieceGroupSection(pieces));
  }

  const swords = InventoryManager.getSwords();
  if(swords.length != 0) {
    swords.sort((a, b) => SwordManager.getIndex(a.name) - SwordManager.getIndex(b.name));
    inner.push(this.makeSwordGroupSection(swords));
  }

  if(pieces.length == 0 && swords.length == 0) {
    $(".inventory_window main").classList.add("empty_inventory");
    if(InventoryManager.repair_paper <= 0) inner.push($createElementWithClasses("p", "no_item").text("보관된 아이템이 없습니다."));
  } else $(".inventory_window main").classList.remove("empty_inventory");

  $("#inventory-items").replaceChildren(...inner);
};
/**
 * 내 정보 화면을 제어합니다.
 */
const InformationScreen = {};
InformationScreen.makeSwordIcon = function(src, name, type) {
  const div = $createElementWithClasses("div", "sword_icon", type);
  const img = $createImgWithSrc(src, name);
  div.appendChild(img);
  if(type == "sword") div.appendChild($createElementWithClasses("span", "sword_name").text(name));
  return div;
};
InformationScreen.show = function() {
  changeBody("game-information");
  this.render();
};
InformationScreen.render = function() {
  const found = [];
  for(let i=0; i<=SwordManager.max_upgradable_index;i++) {
    const value = SwordManager.getSword(i);
    if(SwordManager.isFound(i)) found.push(this.makeSwordIcon(Path[value.name], value.name, "sword"));
    else found.push(this.makeSwordIcon(Path.unknown, "unknown", "unknown"));
  }
  $("#found-swords").replaceChildren(...found);
  $("#found-sword-count").text(SwordManager.found_swords.length);
};
/**
 * 제작소 화면을 제어합니다.
 */
const MakingScreen = {};
MakingScreen.makeMaterialSection = function(recipes) {
  const material = $createElementWithClasses("section", "material");
  if(recipes.length == 1) material.classList.add("one");
  for(const item of recipes) {
    const myitem = InventoryManager.findItem(item.type, item.name);

    let mcount;
    if(item.type == "money") mcount = InventoryManager.money;
    else if(myitem === undefined) mcount = 0;
    else mcount = myitem.count;

    if(item.type == "sword" && !SwordManager.isFound(item.name)) material.appendChild(this.makeMaterialDiv("발견 안됨", "unknown", mcount, item.count));
    else material.appendChild(this.makeMaterialDiv(item.name, item.type, mcount, item.count));
  }
  return material;
};
MakingScreen.makeMaterialDiv = function(itemName, itemType, curc, count) {

  const div = $createElementWithClasses("div", "item");
  const img = new Image();
  switch(itemType) {
    case "money":
    case "unknown":
      img.src = Path[itemType];
      break;
    case "piece":
    case "sword":
      img.src = Path[itemName];
      break;
  }
  div.appendChild(img);
  if(itemType == "sword" || itemType == "unknown") {
    const name_span = $createElementWithClasses("span", "name").text(itemName);
    div.appendChild(name_span);
  }

  if(curc === undefined) return div;
  if(itemType == "piece") count = MakingManager.salePieceCount(count);
  const count_span = $createElementWithClasses("span", "count");
  if(curc < count) count_span.classList.add("unable");
  count_span.text((itemType == "money") ? count + "원" : curc + "/" + count);
  div.appendChild(count_span);

  return div;
};
MakingScreen.makeGroupArticle = function(material, result, color, disabled, clickFunction) {

  const article = $createElementWithClasses("article", "group")

  article.appendChildren(material, result);
  
  const btn = $createElementWithClasses("button", color).text("제작");
  btn.addEventListener("click", clickFunction);
  btn.disabled = disabled;

  article.appendChild(btn);

  return article;
};
MakingScreen.makeResultSection = function(src, name, count)  {
  const result = $createElementWithClasses("section", "result");
  const img_div = $createElementWithClasses("div", "item");
  img_div.appendChildren($createImgWithSrc(src), $createElementWithClasses("span", "name").text(name));
  if(count != null) img_div.appendChild($createElementWithClasses("span", "count").text("+" + count));
    result.appendChild(img_div);
  return result;
};
MakingScreen.makeRecipeGroup = function(count=1) {
  let recipe = MakingManager.multiplyRecipe(MakingManager.repair_paper_recipe, count);
  return this.makeGroupArticle(
    this.makeMaterialSection(recipe), 
    this.makeResultSection(Path.repair, "복구권", count),
    "blue",
    !MakingManager.canMake(recipe), 
    () => MakingManager.makeRepairPaper(count));
};
MakingScreen.show = function() {
  changeBody("making");
  this.render();
};
MakingScreen.render = function() {
  const inner = [];
  inner.push(this.makeRecipeGroup(1));
  for(let i=1;i<=3;i++) inner.push(this.makeRecipeGroup(i*5));
  for(const [sword_name, recipe] of Object.entries(MakingManager.recipes)) {
    const material = this.makeMaterialSection(recipe);
    const result = (SwordManager.isFound(sword_name)) ? this.makeResultSection(Path[sword_name], sword_name) : this.makeResultSection(Path.unknown, "발견 안됨");
    const article = this.makeGroupArticle(
      material, 
      result,
      "purple",
      !(MakingManager.canMake(recipe) && SwordManager.current_sword_index == 0),
      () => MakingManager.makeSword(sword_name)
    );
    inner.push(article);
  }
  $("#recipes").replaceChildren(...inner);
};
MakingScreen.animateLodding = function(speed, onfinish) {

  const lodding = $("#maker-window-lodding");
  const hammer = $("#maker-window-lodding div");
  lodding.display();
  lodding.animate(Keyframes.lodding_kef, {duration: speed/2});
  hammer.animate(Keyframes.hammer_kef, {duration: speed, fill: "both"}).onfinish = () => {
    onfinish();
    lodding.animate(Keyframes.lodding_kef, {duration: speed/2, direction: "reverse"}).onfinish = () => lodding.hide();
  }
};
/**
 * 스탯 화면을 제어합니다.
 */
const StatScreen = {};
StatScreen.makeIconDiv = function(img_src, onclick) {
  const icon_box = $createElementWithClasses("div", "icon");
  icon_box.addEventListener("click", onclick);

  const stat_up = $createElementWithClasses("div", "stat_up");
  icon_box.appendChildren($createImgWithSrc(img_src), stat_up);

  return icon_box;
};
StatScreen.makeLevelDiv = function(current_level) {
  const level_box = $createElementWithClasses("div", "level");
  const ul = $createElement("ul");
  for(let i=0;i<StatManager.getMaxStatLevel();i++) {
    const li_point = $createElementWithClasses("li", "point");
    if(i < current_level) li_point.classList.add("active");
    ul.appendChild(li_point);
  }
  level_box.appendChild(ul);
  return level_box;
};
StatScreen.makeInfoDiv = function(stat) {
  const info_box = $createElementWithClasses("div", "info");

  const pname = $createElementWithClasses("p", "name").text(stat.name);
  const pdescription = $createElementWithClasses("p", "description").text(stat.description);

  const details = $createElementWithClasses("ul", "detail");
  for(let i=0; i<StatManager.getMaxStatLevel(); i++) {
    const stat_li = $createElement("li").text(stat.prefix + stat.stat_per_level[i] + stat.suffix);
    if(stat.current == i +1) stat_li.classList.add("active");
    details.appendChild(stat_li);
  }
  info_box.appendChildren(pname, pdescription, details);

  return info_box;
};
StatScreen.makeStatSection = function(statName) {

  const stat = StatManager.getStat(statName);

  const section = $createElementWithClasses("section", "stat", stat.color);

  section.appendChildren(
    this.makeIconDiv(Path[statName], () => onStatUp(statName)),
    this.makeLevelDiv(stat.current), 
    this.makeInfoDiv(stat));
  return section;
};
StatScreen.show = function() {
  changeBody("game-stat");
  this.render();
};
/**
 * 스탯 화면을 새로고침합니다.
 */
StatScreen.render = function() {
  const stb = Object.keys(StatManager.stats).map(statName => this.makeStatSection(statName));
  $("#stat_box").replaceChildren(...stb);
  $("#stat-point-count").text(StatManager.stat_point);
};
/**
 * 메세지 창을 제어합니다.
 */
const MessageWindow = {};
MessageWindow.popupMessage = function(message_box) {
  message_box.display();
  message_box.animate(
    Keyframes.popup_kef,
    {duration: 300, fill: "both"}
  );
};
/**
 * 최대 강화 달성을 축하하는 알림을 보여줍니다.
 */
MessageWindow.popupMaxMessage = function() {
  this.popupMessage($("#max-message"));
};
/**
 * 돈 부족 알림을 보여줍니다.
 */
MessageWindow.popupMoneyLackMessage = function() {
  this.popupMessage($("#money-lack-message"));
};
MessageWindow.makeDroppedPieceDiv = function(name, count) {
  const div = $createElement("div");
  div.appendChildren(
    $createImgWithSrc(Path[name]),
    $createElementWithClasses("span", "name").text(name),
    $createElementWithClasses("span", "count").text(count));
  return div;
};
/**
 * 검 파괴 알림을 떨어진 조각 정보와 함께 보여줍니다.
 * @param  {...Piece} pieces 떨어진 조각들
 */
MessageWindow.popupFallMessage = function(...pieces) {
  this.renderFallMessage(...pieces);
  this.popupMessage($("#fall-message"));
};
MessageWindow.renderFallMessage = function(...pieces) {
  if(pieces.length != 0 && !pieces.every(value => value instanceof PieceItem))throw new TypeError(`${pieces.filter(value => !(value instanceof Item)).join(", ")} is not pieceItem`);

  $("#loss").text(`손실: ${SwordManager.calculateLoss(SwordManager.current_sword_index)}원`);
  const ret = pieces.map(ele => this.makeDroppedPieceDiv(ele.name, ele.count));
  $("#fall-pieces").replaceChildren(...ret);

  const paper_range = `${InventoryManager.repair_paper}/${SwordManager.getCurrentSword().requiredRepairs}`;
  if(InventoryManager.canUseRepairPaper(SwordManager.getCurrentSword().requiredRepairs)) {
    $("#fix-button").display();
    $("#required-count").text(`복구권 ${SwordManager.getCurrentSword().requiredRepairs}개로 복구할 수 있습니다. (${paper_range})`);
    $("#required-count").classList.remove("red-text");
  } else {
    $("#fix-button").hide();
    $("#required-count").text(`복구권이 부족하여 복구할 수 없습니다. (${paper_range})`);
    $("#required-count").classList.add("red-text");
  }
};
/**
 * [ 무효화 구체 ]가 발동했음을 알리는 알림을 보여줍니다.
 */
MessageWindow.popupInvalidationMessage = function(...pieces) {
  this.renderInvalidationMessage(...pieces);
  this.popupMessage($("#invalidation-message"));
};
MessageWindow.renderInvalidationMessage = function(...pieces) {
  $("#downgrade").text(SwordManager.current_sword_index + "강으로 떨어졌습니다!");

  const ret = pieces.map(ele => this.makeDroppedPieceDiv(ele.name, ele.count));
  $("#invalidation-pieces").replaceChildren(...ret);
};
/**
 * [ 신의 손 ]이 발동했음을 알리는 알림을 보여줍니다.
 */
MessageWindow.popupGreatSuccessMessage = function() {
  this.renderGreatSuccessMessage();
  this.popupMessage($("#great-success-message"));
};
MessageWindow.renderGreatSuccessMessage = function() {
  $("#what_count").text(SwordManager.current_sword_index + "강이 되었습니다!");
};
/**
 * 게임의 엔딩(목적 달성) 알림을 보여줍니다.
 */
MessageWindow.popupGameEndMessage = function() {
  this.popupMessage($("#game-end-message"));
};
/**
 * 스탯 최대 강화 달성 알림을 보여줍니다.
 */
MessageWindow.popupMaxStatMessage = function() {
  this.popupMessage($("#max-stat-message"));
}
/**
 * 진 엔딩 알림을 보여줍니다.
 */
MessageWindow.popupRealEndingMessage = function() {
  this.popupMessage($("#game-real-end-message"));
}
/**
 * 스탯 포인트 부족 알림을 보여줍니다.
 */
MessageWindow.popupStatPointLackMessage = function() {
  this.popupMessage($("#statpoint-lack-message"))
}
/**
 * 자산 화면을 제어합니다.
 */
MoneyDisplay = {};
/**
 * 가진 자산을 설정합니다.
 * @param {number} num 
 */
MoneyDisplay.setMoney = function(num) {
  InventoryManager.setMoney(num);
  this.render();
};
/**
 * 가진 자산에 추가합니다.
 * @param {number} num 
 */
MoneyDisplay.changeMoney = function(num) {
  InventoryManager.changeMoney(num);

  const money_change_span = $("#money-change").text(((num >= 0) ? "+" + num : num) + "원");
  money_change_span.animate(Keyframes.money_change_kef, {duration: 300, fill: "both"});
  this.render();
};
MoneyDisplay.render = function() {
  $("#money-number").text(InventoryManager.getMoney());
};
/**
 * 기록 보관소 창을 제어합니다.
 */
RecordStorage = {
  records: [],
  max_recordable_count: 10
};
/**
 * name을 change만큼 type한 기록을 저장합니다.
 * @param {"upgrade" | "sell"} type 
 * @param {string} name 
 * @param {number} change 
 */
RecordStorage.addRecord = function(type, name, change) {
  if(type != "upgrade" && type != "sell") throw new Error(`${type} is not 'upgrade' or 'sell'.`);
  if(typeof change != "number") throw new TypeError(`${name} is not a number.`);
  this.records.push({type:type, name: name, change: change});
  this.records = this.records.slice(Math.max(this.records.length - this.max_recordable_count, 0));
  this.render();
};
RecordStorage.recordFormat = {
  upgrade: (name, change) => `${name} 강화 -${change}`,
  sell: (name, change) => `${name} 판매 +${change}`
}
RecordStorage.render = function () {
  const ret = this.records.map(rec => $createElement("p").text(this.recordFormat[rec.type](rec.name, rec.change)));
  $("#records").replaceChildren(...ret);
};
const onClickCloseButton = id => $("#" + id).hide();
(function onClickFooterIcon() {
  $("#main-game-button").addEventListener("click", () => MainScreen.show());
  $("#information-button").addEventListener("click", () => InformationScreen.show());
  $("#inventory-button").addEventListener("click", () => InventoryScreen.show());
  $("#making-button").addEventListener("click", () => MakingScreen.show());
  $("#stat-button").addEventListener("click", () => StatScreen.show());
})();