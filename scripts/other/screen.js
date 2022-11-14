/* 화면 제어 */
const changeBody = id => $("#main-body").replaceChildren(document.importNode($("#" + id).content, true));
const Path = {};
Path.unknownPath = "images/swords/unknown.png";
Path.repairPath = "images/repair_paper/복구권.png";
Path.moneyPath = "images/item/돈.png";
Path.piecePath = piece_name => `images/item/${piece_name}.png`;
Path.swordPath = sword_name => `images/swords/${sword_name}.png`;

const Keyframes = {
  lodding_kef: [{opacity: '0'}, {opacity: '1'}],
  hammer_kef: [{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0deg)", offset: 0, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0.2turn)", offset: .5, easing: "ease" },{ transform: "translate(calc(-50% - 38.4765625px), -50%) rotate(0turn)", offset: 1}],
  popup_kef: [{opacity: '0'}, {opacity: '1'}],
  money_change_kef: [{opacity: '1', transform: 'translate(-30%, 0%)'},{opacity: '0', transform: 'translate(-30%, -70%)'}],
};

const MainScreen = {};
MainScreen.show = function() {
  changeBody("game-interface");
  this.render();
};
/**
 * 메인 게임 화면을 새로고침합니다.
 */
MainScreen.render = function() {
  $("#fall-message").hide();
  $("#max-message").hide();

  const current_sword = SwordManager.getCurrentSword();
  const current_idx = SwordManager.getIndex(current_sword);

  $("#sword-image").src = current_sword.image;

  const number = $("#sword-number");
  number.textContent = SwordManager.current_sword_index + "강";
  if(current_idx == SwordManager.max_upgradable_index) number.classList.add("hightlight");
  
  $("#sword-name").textContent = current_sword.name;

  const prob = $("#sword-prob")
  const cost = $("#sword-cost")
  if(current_idx == SwordManager.max_upgradable_index) {
    prob.textContent = "강화 불가";
    cost.textContent = "";
  } else {
    prob.textContent = `강화 성공 확률: ${Math.floor(StatManager.calculateLuckyBraclet(current_sword.prob)*100)}%`;
    cost.textContent = `강화 비용: ${StatManager.calculateSmith(current_sword.cost)}원`;
  }
  $("#sword-price").textContent = `판매 가격: ${StatManager.calculateBigMerchant(current_sword.price)}원`;

  $("#sell-button")[(SwordManager.current_sword_index == 0) ? "hide" : "display"]();
  $("#save-button")[(SwordManager.getCurrentSword().canSave) ? "display" : "hide"]();
};
const InventoryScreen = {};
InventoryScreen.makeHoverSellDiv = function(onclick) {
  const div = $createElementWithClasses("div", "hover_sell");
  const span = document.createElement("span");
  span.textContent = "판매 하기";
  div.appendChild(span);
  div.addEventListener("click", onclick);
  return div;
};
InventoryScreen.makeInventoryArticle = function(src, name, count, sellFnc) {
  const article = $createElementWithClasses("article", "group");

  if(src === undefined) return article;

  const div = $createElementWithClasses("div", "item");
  const img = $createImgWithSrc(src);

  if(sellFnc !== undefined) div.appendChild(this.makeHoverSellDiv(sellFnc));

  div.appendChild(img);

  const pname = $createElementWithClasses("p", "item_name");
  pname.textContent = name;
  const pcount = $createElementWithClasses("p", "item_count");
  pcount.textContent = count;
  article.appendChildren(div, pname, pcount);

  return article;
};
InventoryScreen.show = function() {
  changeBody("inventory");
  this.render();
};
InventoryScreen.render = function() {
  const inner = [];

  if(InventoryManager.repair_paper > 0) {
    inner.push(
      $createElementWithClasses("div", "underline", "bok"),
      this.makeInventoryArticle(Path.repairPath, "복구권", InventoryManager.repair_paper),
      this.makeInventoryArticle()
    );
  }

  const pieces = InventoryManager.getPieces();
  const swords = InventoryManager.getSwords();
  pieces.sort((a, b) => a.count - b.count);
  swords.sort((a, b) => SwordManager.getIndex(a.name) - SwordManager.getIndex(b.name) );

  if(pieces.length != 0) inner.push($createElementWithClasses("div", "underline", "pie"));
  pieces.forEach(value => inner.push(this.makeInventoryArticle(Path.piecePath(value.name), value.name, value.count)));
  if(pieces.length%2 == 1) inner.push(this.makeInventoryArticle());

  if(swords.length != 0) inner.push($createElementWithClasses("div", "underline", "swo"));
  swords.forEach(value => inner.push(this.makeInventoryArticle(Path.swordPath(value.name), value.name, value.count, () => InventoryManager.sellSword(value.name))));
  if(swords.length%2 == 1) inner.push(this.makeInventoryArticle());

  if(pieces.length == 0 && swords.length == 0) {
    $(".inventory_window main").classList.add("empty_inventory");
    if(InventoryManager.repair_paper <= 0) {
      const p = $createElementWithClasses("p", "no_item");
      p.textContent = "보관된 아이템이 없습니다.";
      inner.push(p);
    }
  } else $(".inventory_window main").classList.remove("empty_inventory");

  $("#inventory-items").replaceChildren(...inner);
};
const InformationScreen = {};
InformationScreen.makeSwordIcon = function(src, alt, type) {
  const div = $createElementWithClasses("div", "sword_icon", type);
  const img = $createImgWithSrc(src, alt);
  div.appendChild(img);
  if(type == "sword") {
    const name_span = $createElementWithClasses("span", "sword_name");
    name_span.textContent = alt;
    div.appendChild(name_span);
  }
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
    if(SwordManager.isFound(i)) found.push(this.makeSwordIcon(value.image, value.name, "sword"));
    else found.push(this.makeSwordIcon(Path.unknownPath, "unknown", "unknown"));
  }
  $("#found-swords").replaceChildren(...found);
  $("#found-sword-count").textContent = SwordManager.found_swords.length;
};
const MakingScreen = {};
MakingScreen.makeMaterialSection = function(recipes, sale) {
  const material = $createElementWithClasses("section", "material");
  if(recipes.length == 1) material.classList.add("one");
  for(const item of recipes) {
    const myitem = InventoryManager.findItem(item.name, item.type);

    let mcount;
    if(item.type == "money") mcount = InventoryManager.money;
    else if(myitem === undefined) mcount = 0;
    else mcount = myitem.count;

    if(item.type == "sword" && !SwordManager.isFound(item.name)) material.appendChild(this.makeMaterialDiv("발견 안됨","unknown", mcount, item.count));
    else material.appendChild(this.makeMaterialDiv(item.name, item.type, mcount, item.count, sale));
  }
  return material;
};
MakingScreen.makeMaterialDiv = function(itemName, itemType, curc, count, sale) {

  const div = $createElementWithClasses("div", "item");
  const img = new Image();
  switch(itemType) {
    case "money":
      img.src = Path.moneyPath;
      break;
    case "piece":
      img.src = Path.piecePath(itemName);
      break;
    case "sword":
      img.src = Path.swordPath(itemName);
      break;
    case "unknown":
      img.src = Path.unknownPath;
      break;
  }
  div.appendChild(img)
  if(itemType == "sword" || itemType == "unknown") {
    const name_span = $createElementWithClasses("span", "name");
    name_span.textContent = itemName;
    div.appendChild(name_span);
  }

  if(curc === undefined) return div;
  if(sale !== undefined && itemType == "piece") count -= sale;
  const count_span = $createElementWithClasses("span", "count");
  if(curc < count) count_span.classList.add("unable");

  count_span.textContent = (itemType == "money") ? count : curc + "/" + count;
  div.appendChild(count_span);

  return div;
};
MakingScreen.makeGroupArticle = function(material, result, disabled, clickFunction) {

  const article = $createElementWithClasses("article", "group")

  article.appendChildren(material, result);
  
  const btn = document.createElement("button");
  btn.addEventListener("click", clickFunction);
  btn.textContent = "제작";
  btn.disabled = disabled;

  article.appendChild(btn);

  return article;
};
MakingScreen.makeResultSection = function(src, name, count)  {

  const result = $createElementWithClasses("section", "result");

  const img_div = $createElementWithClasses("div", "item");

  const img = $createImgWithSrc(src);

  const span = $createElementWithClasses("span", "name");
  span.textContent = name;

  img_div.appendChildren(img, span);

  if(count != null) {
    const countspan = $createElementWithClasses("span", "count");
    countspan.textContent = count;

    img_div.appendChild(countspan);
  }

  result.appendChild(img_div);

  return result;
};
MakingScreen.show = function() {
  changeBody("making");
  this.render();
};
MakingScreen.render = function() {
  const inner = [];
  const sale = StatManager.getMagicHat();

  const material = this.makeMaterialSection(MakingManager.repair_paper_recipe);

  const result = this.makeResultSection(Path.repairPath, "복구권", InventoryManager.repair_paper);
  const article = this.makeGroupArticle(
    material, 
    result, 
    !MakingManager.canMake(MakingManager.repair_paper_recipe), 
    () => MakingManager.makeRepairPaper());

  inner.push(article);

  for(const [sword_name, recipe] of Object.entries(MakingManager.recipes)) {
    const material = this.makeMaterialSection(recipe, sale);
    const result = (SwordManager.isFound(sword_name)) ? this.makeResultSection(Path.swordPath(sword_name), sword_name) : this.makeResultSection(Path.unknownPath, "발견 안됨");
    const article = this.makeGroupArticle(
      material, 
      result, 
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
  hammer.animate(Keyframes.hammer_kef, {duration: speed, iterations: 2});
  setTimeout(() => {
    onfinish();
    lodding.animate(
      Keyframes.lodding_kef,
      {duration: speed/2, direction: "reverse"}
    ).onfinish = () => lodding.hide();
  }, speed);
};
const StatScreen = {};
StatScreen.makeIconDiv = function(img_src, onclick) {
  const icon_box = $createElementWithClasses("div", "icon");
  icon_box.addEventListener("click", onclick);

  const img = $createElementWithClasses("img", "stat_img");
  img.src = img_src;
  const stat_up = $createElementWithClasses("div", "stat_up");
  icon_box.appendChildren(img, stat_up);

  return icon_box;
};
StatScreen.makeLevelDiv = function(current_level) {
  const level_box = $createElementWithClasses("div", "level");
  const ul = document.createElement("ul");
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

  const pname = $createElementWithClasses("p", "name");
  pname.textContent = stat.name;
  const pdescription = $createElementWithClasses("p", "description");
  pdescription.textContent = stat.description;

  const details = $createElementWithClasses("ul", "detail");
  for(let i=0;i<StatManager.getMaxStatLevel();i++) {
    const stat_li = document.createElement("li");
    if(stat.current == i +1) stat_li.classList.add("active");
    stat_li.textContent = stat.prefix + stat.stat_per_level[i] + stat.suffix;
    details.appendChild(stat_li)
  }
  // const lis = stat.stat_per_level.map((value, index) => {
  //   const stat_li = document.createElement("li");
  //   if(stat.current == index +1) stat_li.classList.add("active");
    
  //   return stat_li;
  // });
  // details.appendChildren(...lis);

  info_box.appendChildren(pname, pdescription, details);

  return info_box;
};
StatScreen.makeStatSection = function(stat) {
  const section = $createElementWithClasses("section", "stat", stat.color);

  const icon_box = this.makeIconDiv(stat.image, () => onStatUp(stat));
  const level_box = this.makeLevelDiv(stat.current);
  const info_box = this.makeInfoDiv(stat)

  section.appendChildren(icon_box, level_box, info_box);
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
  const stb = StatManager.stats.map((value) => this.makeStatSection(value));
  $("#stat_box").replaceChildren(...stb);

  $("#stat-point-count").textContent = StatManager.stat_point;
};
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
  const div = document.createElement("div");

  const img = $createImgWithSrc(Path.piecePath(name));

  const span0 = $createElementWithClasses("span", "name");
  const span1 = $createElementWithClasses("span", "count");
  span0.innerHTML = name;
  span1.innerHTML = count;

  div.appendChildren(img, span0, span1);
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

  if(pieces.length != 0 && !pieces.every(value => value instanceof PieceItem))
    throw new TypeError(`${pieces.filter(value => !(value instanceof Item)).join(", ")} is not pieceItem`);

  const pieces_box = $("#pieces");

  $("#loss").textContent = "손실: " + SwordManager.calculateLoss(SwordManager.current_sword_index) + "원";

  const ret = pieces.map(ele => this.makeDroppedPieceDiv(ele.name, ele.count));

  pieces_box.replaceChildren(...ret);

  const paper_range = `${InventoryManager.repair_paper}/${SwordManager.getCurrentSword().requiredRepairs}`;
  if(InventoryManager.canUseRepairPaper(SwordManager.getCurrentSword().requiredRepairs)) {
    $("#fix-button").display();
    $("#required-count").textContent = `복구권 ${SwordManager.getCurrentSword().requiredRepairs}개로 복구할 수 있습니다. (${paper_range})`;
    $("#required-count").classList.remove("red-text");
  } else {
    $("#fix-button").hide();
    $("#required-count").textContent = `복구권이 부족하여 복구할 수 없습니다. (${paper_range})`;
    $("#required-count").classList.add("red-text");
  }
};
/**
 * [ 무효화 구체 ]가 발동했음을 알리는 알림을 보여줍니다.
 */
MessageWindow.popupInvalidationMessage = function() {
  this.renderInvalidationMessage();
  this.popupMessage($("#invalidation-message"))
};
MessageWindow.renderInvalidationMessage = function() {
  $("#downgrade").textContent = SwordManager.current_sword_index + "강으로 떨어졌습니다!";
};
/**
 * [ 신의 손 ]이 발동했음을 알리는 알림을 보여줍니다.
 */
MessageWindow.popupGreatSuccessMessage = function() {
  this.renderGreatSuccessMessage();
  this.popupMessage($("#great-success-message"))
};
MessageWindow.renderGreatSuccessMessage = function() {
  $("#what_count").textContent = SwordManager.current_sword_index + "강이 되었습니다!";
};
/**
 * 게임의 엔딩(목적 달성) 알림을 보여줍니다.
 */
MessageWindow.popupGameEndMessage = function() {
  this.popupMessage($("#game-end-message"))
};
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

  const money_change_span = $("#money-change");
  money_change_span.textContent = ((num >= 0) ? "+" + num : num) + "원";
  money_change_span.animate(Keyframes.money_change_kef, {duration: 300, fill: "both"});
  this.render();
};
MoneyDisplay.render = function() {
  $("#money-number").textContent = InventoryManager.getMoney();
};
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
RecordStorage.render = function () {
  const ret = this.records.map(rec => {
    const p = document.createElement("p");
    if(rec.type == "upgrade")
      p.textContent = `${rec.name} 강화 -${rec.change}`;
    else if(rec.type == "sell")
      p.textContent = `${rec.name} 판매 +${rec.change}`;
    return p;
  });

  $("#records").replaceChildren(...ret);
};