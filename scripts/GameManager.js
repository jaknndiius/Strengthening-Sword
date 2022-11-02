const $ = (selector) => document.querySelector(selector)
const $createElementWithClasses = function(tagName, ...classes) {const tag = document.createElement(tagName);tag.classList.add(...classes);return tag;}
Node.prototype.appendChildren = function(...nodes) {for(const node of nodes) this.appendChild(node);}
class Item {constructor(type, name, count){this.type = type; this.name = name; this.count = count;}}
class PieceItem extends Item {constructor(name, count){super("piece", name, count);}}
class SwordItem extends Item {constructor(name, count){super("sword", name, count);}}
class MoneyItem extends Item {constructor(count){super("money", "돈", count);}}
class Stat {
  constructor(name, description, stats_per_level, color) {
    this.current = 0;
    this.name = name;
    this.image = "images/stats/" + name + ".png";
    this.description = description;
    this.stats_per_level = stats_per_level;
    this.color = color;
  }
  getCurrent() {
    if(this.current == 0) return 0;
    return this.stats_per_level[this.current-1];
  }
}
HTMLElement.prototype.display = function() {this.style.display = "block"};
HTMLElement.prototype.hide = function() {this.style.display = "none"};
class Sword {
  constructor(index, name, prob, cost, price, requiredRepairs, canSave, ...pieces) {
    this.index = index;
    this.name = name;
    this.image = "images/swords/" + name + ".png";
    this.prob = prob;
    this.cost = cost;
    this.price = price;
    this.requiredRepairs = requiredRepairs;
    this.canSave = canSave;
    this.pieces = pieces;
  }
}
class Piece {
  constructor(name, prob, max_drop) {
    this.name = name;
    this.prob = prob;
    this.max_drop = max_drop;
  }
  calculate() {
    if(Math.random() < this.prob) {
      const result = Math.ceil(Math.round(Math.random()*100)/(100/this.max_drop));
      return new PieceItem(this.name, result);
    } return null;
  }
}
const GameManager = {
  swords: [],
  max_upgradable_index: 0,
  sword_index: 0,
  money: 0,
  repair_paper: 0,
  found_swords: [],
  inventory: [],
  records: [],
  max_recordable_count: 10,
  repair_paper_recipe: [],
  recipes: {},
  testResult: {
    MONEY_LACK: "MONEY LACK",
    MAX_UPGRADE: "MAX UPGRADE",
    SUCCESS: "SUCCESS"
  },
  stats: [
    new Stat("행운 팔찌", "성공 확률 증가(+)", [2, 4, 6, 8, 10], "blue"),
    new Stat("신의 손", "일정 확률로 +2강(%)", [10, 20, 30, 40, 50], "red"),
    new Stat("대상인", "판매 가격 증가(%)", [5, 10, 15, 20, 25], "sky"),
    new Stat("대장장이", "강화 비용 감소(%)", [1, 2, 3, 4, 5], "green"),
    new Stat("무효화 구체", "파괴 시 -1강으로 복구 확률(%)", [10, 20, 30, 40, 50], "purple"),
    new Stat("마법 모자", "워프권 재료 조각 갯수 감소", [1, 2, 3, 4, 5], "purple")
  ],
  stat_point: 0
}
GameManager.unknownPath = "images/swords/unknown.png";
GameManager.repairPath = "images/repair_paper/복구권.png";
GameManager.moneyPath = "images/item/돈.png";
GameManager.piecePath = piece_name => `images/item/${piece_name}.png`;
GameManager.swordPath = sword_name => `images/swords/${sword_name}.png`;
GameManager.resetSword = function() { this.jumpTo(0); }
GameManager.upgradeSword = function(index) {
  if(index === undefined) {
    this.jumpTo(this.sword_index +1);
    return;
  }
  if(typeof index != "number") throw new TypeError(`${index} is not a number.`);
  this.jumpTo(this.sword_index +2)
}
GameManager.downgradeSword = function() { this.jumpTo(this.sword_index -1)}
GameManager.test = function() {
  if(this.money - this.getCurrentSword().cost < 0) return this.testResult.MONEY_LACK;
  else if(this.max_upgradable_index < this.sword_index +1) return this.testResult.MAX_UPGRADE;
  else return this.testResult.SUCCESS;
}
GameManager.getSword = function(name) {
  const res = this.swords.find(value => value.name == name);
  if(res === undefined) throw new Error(`There is no sword named ${name}`);
  return res;
}
GameManager.isFound = function(swordValue) {
  switch (typeof swordValue) {
    case "number": return this.found_swords.includes(swordValue);
    case "string": return this.found_swords.includes(this.getSword(swordValue).index);
    default: throw new TypeError(`${swordValue} is not sword's name or sword's index`);
  }
}
GameManager.findSword = function(index) {
  if(this.isFound(index)) throw new Error("The sword is already on found sword list.")
  this.found_swords.push(index);
  this.stat_point += 1;
}
GameManager.jumpTo = function(index) {
  if(typeof index != "number") throw new TypeError(`${index} is not a number`);
  if(index < 0) index = 0;
  if(index > this.max_upgradable_index) index = this.max_upgradable_index;
  if(!this.isFound(index)) this.findSword(index);
  this.sword_index = index;
}
GameManager.canUseRepairPaper = function(count) {
  if(count === undefined) return this.repair_paper >= this.getCurrentSword().requiredRepairs;
  else return this.repair_paper >= count;
}
GameManager.useRepairPair = function(count) {
  if(typeof count != "number") throw new TypeError(`${count} is not a number`);
  if(!this.canUseRepairPaper(count)) throw new Error("There are no enough repair papers.");
  GameManager.repair_paper -= count;
}
GameManager.getCurrentSword = function() {
  return this.swords[this.sword_index];
}
GameManager.getNextSword = function() {
  if(this.sword_index == this.max_upgradable_index) return this.swords[this.sword_index];
  return this.swords[this.sword_index +1];
}
GameManager.appendSword = function(sword) {
  if(sword instanceof Sword) {
    this.swords.push(sword);
    this.max_upgradable_index = this.swords.length -1;
  }
  else throw new TypeError(`${sword} is not a sword`);
}
GameManager.calculateLoss = function(index) {
  return this.swords.filter((v, idx) => idx <= index).reduce((pre, cur) => pre += cur.cost, 0);
}
GameManager.getInvalidationPercent = function() {
  return this.getCurrentStat("무효화 구체")/100;
}
GameManager.getGreatSuccessPercent = function() {
  return this.getCurrentStat("신의 손")/100;
}
GameManager.saveItem = function(type, name, count) {
  if(typeof count != "number") throw new TypeError(`${count} is not a number`);
  if(count < 0) throw new RangeError(`${count} is not more than 0. To subtract the item, use GameManager.subtractItem`);

  const item = this.findItem(name, type);
  if(item === undefined) {
    switch (type) {
      case "piece":
        GameManager.inventory.push(new PieceItem(name, count));
        break;
      case "sword":
        GameManager.inventory.push(new SwordItem(name, count));
        break;
      default:
        throw new Error(`${type} is not 'piece' or 'sword'`);
    }
  } else item.count += count;
}
GameManager.savePiece = function(name, count) {
  this.saveItem("piece", name, count);
}
GameManager.saveSword = function(name, count) {
  this.saveItem("sword", name, count);
}
GameManager.subtractItem = function(type, name, count) {
  const item = this.findItem(name, type);
  if(item === undefined) return new Error("There is no such sword.");
  if(item.count < count) return false;
  item.count -= count
  return true;
}
GameManager.findItem = function(name, type) {
  if(type === undefined) return GameManager.inventory.find(value => value.name == name);
  return GameManager.inventory.find(value => value.type == type && value.name == name);
}
GameManager.sellSword = function(name) {
  if(this.subtractItem("sword", name, 1)) {
    GameManager.addRecord(this.getSword(name), "sell");
    this.renderInventory();
    this.changeMoney(this.getSword(name).price);
  }
}
GameManager.setRepairPaperRecipe = function(...materials) {
  if(materials.length == 0) throw new Error("GameManager.setRepairPaperRecipe needs more args.");
  if(!materials.every(value => value instanceof Item)) throw new TypeError(`${materials.filter(value => !(value instanceof Item)).join(", ")} is not item`);
  this.repair_paper_recipe = materials;
}
GameManager.setRecipe = function(resultItem, ...materials) {
  if(materials.length == 0) throw new Error("GameManager.setRecipe needs more args.");
  if(!materials.every(value => value instanceof Item)) throw new TypeError(`${materials.filter(value => !(value instanceof Item)).join(", ")} is not item`);
  this.recipes[resultItem] = materials;
}
GameManager.getCurrentStat = function(statName) {
  return this.stats.find(value => value.name == statName).getCurrent();
}
GameManager.renderGameInterFace = function() {

  $("#fall-message").hide();
  $("#max-message").hide();

  const current_sword = this.getCurrentSword();

  $("#sword-image").src = current_sword.image;

  const number = $("#sword-number");
  number.textContent = this.sword_index + "강";
  if(current_sword.index == this.max_upgradable_index) number.classList.add("hightlight");
  else number.classList.remove("hightlight");
  $("#sword-name").textContent = current_sword.name;

  if(current_sword.index == this.max_upgradable_index) {
    $("#sword-prob").textContent = "강화 불가";
    $("#sword-cost").textContent = "";
  } else {
    const percent = Math.floor(current_sword.prob *100) + this.getCurrentStat("행운 팔찌");
    $("#sword-prob").textContent = "강화 성공 확률: " + ((percent > 100) ? 100 : percent) + "%";

    const result = current_sword.cost*(100-this.getCurrentStat("대장장이"))/100
    $("#sword-cost").textContent = "강화 비용: " + result + "원";
  }

  const res = current_sword.price*(100+this.getCurrentStat("대상인"))/100;
  $("#sword-price").textContent = "판매 가격: " + res + "원";

  $("#sell-button")[(this.sword_index == 0) ? "hide" : "display"]();
  $("#save-button")[(this.getCurrentSword().canSave) ? "display" : "hide"]();
}
GameManager.showFall = function(result) {
  $("#sword-number").classList.add("hightlight");
}
GameManager.makeSwordIcon = function(src, alt, type) {
  const div = $createElementWithClasses("div", "sword_icon", type);
  const img = new Image();
  img.src = src;
  img.alt = alt;
  div.appendChild(img);
  if(type == "sword") {
    const name_span = $createElementWithClasses("span", "sword_name");
    name_span.textContent = alt;
    div.appendChild(name_span);
  }
  return div;
}
GameManager.renderGameInformation = function() {
  const found = [];
  for(let i=0; i<=this.max_upgradable_index;i++) {
    const value = this.swords[i];
    if(this.isFound(i)) found.push(this.makeSwordIcon(value.image, value.name, "sword"));
    else found.push(this.makeSwordIcon(this.unknownPath, "unknown", "unknown"));
  }
  $("#found-swords").replaceChildren(...found);
  $("#found-sword-count").textContent = this.found_swords.length;
}
GameManager.makeHoverSellDiv = function(onclick) {
  const div = $createElementWithClasses("div", "hover_sell");
  const span = document.createElement("span");
  span.textContent = "판매 하기";
  div.appendChild(span);
  div.onclick = onclick;
  return div;
}
GameManager.makeInventoryArticle = function(src, name, count, sellFnc) {
  const article = $createElementWithClasses("article", "group");

  if(src === undefined) return article;

  const div = $createElementWithClasses("div", "item");
  const img = new Image();
  img.src = src;

  if(sellFnc !== undefined) div.appendChild(this.makeHoverSellDiv(sellFnc));

  div.appendChild(img);

  const pname = $createElementWithClasses("p", "item_name");
  pname.textContent = name;
  const pcount = $createElementWithClasses("p", "item_count");
  pcount.textContent = count;
  article.appendChildren(div, pname, pcount);

  return article;
}
GameManager.renderInventory = function() {
  const inner = [];

  if(this.repair_paper > 0) {
    inner.push(
      $createElementWithClasses("div", "underline", "bok"),
      this.makeInventoryArticle(this.repairPath, "복구권", this.repair_paper),
      this.makeInventoryArticle()
    );
  }

  const pieces = this.inventory.filter(value => value.type == "piece" && value.count != 0);
  const swords = this.inventory.filter(value => value.type == "sword" && value.count != 0);
  pieces.sort((a, b) => a.count - b.count);
  swords.sort((a, b) => this.getSword(a.name).index - this.getSword(b.name).index );

  if(pieces.length != 0) inner.push($createElementWithClasses("div", "underline", "pie"));
  pieces.forEach(value => inner.push(this.makeInventoryArticle(this.piecePath(value.name), value.name, value.count)));
  if(pieces.length%2 == 1) inner.push(this.makeInventoryArticle());

  if(swords.length != 0)inner.push($createElementWithClasses("div", "underline", "swo"));
  swords.forEach(value => inner.push(this.makeInventoryArticle(this.swordPath(value.name), value.name, value.count, () => this.sellSword(value.name))));
  if(swords.length%2 == 1) inner.push(this.makeInventoryArticle());

  if(pieces.length == 0 && swords.length == 0) {
    $(".inventory_window main").classList.add("empty_inventory");
    if(this.repair_paper <= 0) {
      const p = $createElementWithClasses("p", "no_item");
      p.textContent = "보관된 아이템이 없습니다.";
      inner.push(p);
    }
  } else $(".inventory_window main").classList.remove("empty_inventory");

  $("#inventory-items").replaceChildren(...inner);
}
GameManager.makeMaterialSection = function(recipes, sale) {
  const material = $createElementWithClasses("section", "material");
  if(recipes.length == 1) material.classList.add("one");
  for(const item of recipes) {
    const myitem = this.findItem(item.name, item.type);

    let mcount;
    if(item.type == "money") mcount = this.money;
    else if(myitem === undefined) mcount = 0;
    else mcount = myitem.count;

    if(item.type == "sword" && !this.isFound(item.name)) material.appendChild(this.makeMaterialDiv("발견 안됨","unknown", mcount, item.count));
    else material.appendChild(this.makeMaterialDiv(item.name, item.type, mcount, item.count, sale));
  }
  return material;
}
GameManager.makeMaterialDiv = function(itemName, itemType, curc, count, sale) {

  const div = $createElementWithClasses("div", "item");
  const img = new Image();
  switch(itemType) {
    case "money":
      img.src = this.moneyPath;
      break;
    case "piece":
      img.src = this.piecePath(itemName);
      break;
    case "sword":
      img.src = this.swordPath(itemName);
      break;
    case "unknown":
      img.src = this.unknownPath;
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

  count_span.textContent = (itemName == "돈") ? count : curc + "/" + count;
  div.appendChild(count_span);

  return div;
}
GameManager.makeGroupArticle = function(material, result, disabled, clickFunction) {

  const article = $createElementWithClasses("article", "group")

  article.appendChildren(material, result);
  
  const btn = document.createElement("button");
  btn.onclick = clickFunction;
  btn.textContent = "제작";
  btn.disabled = disabled;

  article.appendChild(btn);

  return article;

}
GameManager.makeResultSection = function(src, name, count)  {

  const result = $createElementWithClasses("section", "result");

  const img_div = $createElementWithClasses("div", "item");

  const img = new Image();
  img.src = src;

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
}
GameManager.renderMaking = function() {

  const inner = [];
  const sale = this.getCurrentStat("마법 모자");

  const material = this.makeMaterialSection(this.repair_paper_recipe);

  const result = this.makeResultSection(this.repairPath, "복구권", this.repair_paper);
  const article = this.makeGroupArticle(
    material, 
    result, 
    !this.canMake(this.repair_paper_recipe), 
    () => this.makeRepairPaper());

  inner.push(article);

  for(const [sword_name, recipe] of Object.entries(this.recipes)) {
    const material = this.makeMaterialSection(recipe, sale);
    const result = (this.isFound(sword_name)) ? this.makeResultSection(this.swordPath(sword_name), sword_name) : this.makeResultSection(this.unknownPath, "발견 안됨");
    const article = this.makeGroupArticle(
      material, 
      result, 
      !(this.canMake(recipe, sale) && this.sword_index == 0),
      () => GameManager.makeSword(sword_name)
    );
    inner.push(article);
  }
  $("#recipes").replaceChildren(...inner);
}
GameManager.makeStatSection = function(stat) {
  const section = $createElementWithClasses("section", "stat", stat.color);

  const icon_box = $createElementWithClasses("div", "icon");
  icon_box.onclick = () => onStatUp(stat);

  const img = $createElementWithClasses("img", "stat_img");
  img.src = stat.image;
  const stat_up = $createElementWithClasses("div", "stat_up");
  icon_box.appendChildren(img, stat_up);

  const level_box = $createElementWithClasses("div", "level");
  const ul = document.createElement("ul");
  for(let i=0;i<5;i++) {
    const li_point = $createElementWithClasses("li", "point");
    if(i < stat.current) li_point.classList.add("active");
    ul.appendChild(li_point);
  }
  level_box.appendChild(ul);

  const info_box = $createElementWithClasses("div", "info");
  const pname = $createElementWithClasses("p", "name");
  pname.textContent = stat.name;
  const pdescription = $createElementWithClasses("p", "description");
  pdescription.textContent = stat.description;
  const detail = $createElementWithClasses("ul", "detail");
  const lis = stat.stats_per_level.map((value, index) => {
    const stat_li = $createElementWithClasses("li", "stat_per_level");
    if(stat.current == index +1) stat_li.classList.add("active");
    stat_li.textContent = value;
    return stat_li;
  });
  detail.appendChildren(...lis);

  info_box.appendChildren(pname, pdescription, detail);
  
  section.appendChildren(icon_box, level_box, info_box);
  return section;
}
GameManager.renderStat = function() {
  const stb = this.stats.map((value) => this.makeStatSection(value));
  $("#stat_box").replaceChildren(...stb);

  $("#stat-point-count").textContent = this.stat_point;
}
GameManager.makeDroppedPieceDiv = function(name, count) {
  const div = document.createElement("div");

  const img = new Image();
  img.src = this.piecePath(name);

  const span0 = $createElementWithClasses("span", "name");
  const span1 = $createElementWithClasses("span", "count");
  span0.innerHTML = name;
  span1.innerHTML = count;

  div.appendChildren(img, span0, span1);
  return div;
}
GameManager.renderFallMessage = function(...pieces) {

  if(pieces.length != 0 && !pieces.every(value => value instanceof PieceItem))
    throw new TypeError(`${pieces.filter(value => !(value instanceof Item)).join(", ")} is not pieceItem`);

  const pieces_box = $("#pieces");

  $("#loss").textContent = "손실: " + this.calculateLoss(this.sword_index) + "원";

  const ret = pieces.map(ele => this.makeDroppedPieceDiv(ele.name, ele.count));

  pieces_box.replaceChildren(...ret);

  if(this.canUseRepairPaper()) {
    $("#fix-button").display();
    $("#required-count").textContent = `복구권 ${this.getCurrentSword().requiredRepairs}개로 복구할 수 있습니다. (${this.repair_paper}/${this.getCurrentSword().requiredRepairs})`;
    $("#required-count").classList.remove("red-text");
  } else {
    $("#fix-button").hide();
    $("#required-count").textContent = `복구권이 부족하여 복구할 수 없습니다. (${this.repair_paper}/${this.getCurrentSword().requiredRepairs})`;
    $("#required-count").classList.add("red-text");
  }
}
GameManager.renderInvalidationMessage = function() {
  $("#downgrade").textContent = this.sword_index + "강으로 떨어졌습니다!";
}
GameManager.renderGreatSuccessMessage = function() {
  $("#what_count").textContent = this.sword_index + "강이 되었습니다!";
}
GameManager.money_change_kef = [{opacity: '1', transform: 'translate(-30%, 0%)'},{opacity: '0', transform: 'translate(-30%, -70%)'}];
GameManager.setMoney = function(num) {
  if(typeof num != "number") throw new TypeError(`${num} is not a number`);
  this.money = (num >= 0) ? num : 0;
  this.renderMoney();
}
GameManager.changeMoney = function(num) {
  this.setMoney(this.money + num);
  const money_change_span = $("#money-change");
  money_change_span.textContent = ((num >= 0) ? "+" + num : num) + "원";
  money_change_span.animate(this.money_change_kef, {duration: 300, fill: "both"});
}
GameManager.renderMoney = function() {
  $("#money-number").textContent = this.money;
}
GameManager.addRecord = function(sword, type) {
  if(sword instanceof Sword) this.swords.push(sword);
  else throw new TypeError("Arg-1 must be Sword");
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
GameManager.canMake = function(recipe, sale) {
  for(const rec of recipe) {
    if(rec.type == "money") {
      if(this.money >= rec.count) continue;
      return false;
    }
    const item = this.findItem(rec.name, rec.type);

    if(item !== undefined) {
      if(rec.type == "piece") {
        if(sale === undefined) {
          if(item.count < rec.count) return false;
        } else if(item.count < rec.count-sale) return false;
      } else if(item.count < rec.count) return false;      
    } else return false;
  }
  return true;
}
GameManager.makeWithRecipe = function(recipe, sale) {
  if(!this.canMake(recipe, sale)) return false;

  for(const item of recipe) {
    if(item.type == "money") this.changeMoney(-item.count);
    else if(item.type == "piece" && sale !== undefined) this.findItem(item.name, item.type).count -= item.count - sale;
    else this.findItem(item.name, item.type).count -= item.count;
  }
  return true;
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
GameManager.makeSword = function(swordName) {
  const sale = this.getCurrentStat("마법 모자");
  if(this.makeWithRecipe(this.recipes[swordName], sale)) {
    const sword = this.swords.find(value => value.name == swordName);
    const index = sword.index;
    this.jumpTo(index);
    this.animateLodding(800, () => this.showGameInterface());
  }
}
GameManager.makeRepairPaper = function() {
  if(this.makeWithRecipe(this.repair_paper_recipe)) {
    this.repair_paper += 1;
    this.animateLodding(450, () => this.renderMaking());
  }
}
GameManager.init = function(start) {
  if(start !== undefined) this.jumpTo(start);
  else this.resetSword();
  this.showGameInterface();
  this.renderMoney();
  this.showStat();
}

$("#main-game-button").addEventListener("click", () => {GameManager.showGameInterface();});
$("#information-button").addEventListener("click", () => {GameManager.showGameInformation();});
$("#inventory-button").addEventListener("click", () => {GameManager.showInventory();});
$("#making-button").addEventListener("click", () => {GameManager.showMaking();});
$("#stat-button").addEventListener("click", () => {GameManager.showStat();});

const onClickCloseButton = id => $("#" + id).hide();