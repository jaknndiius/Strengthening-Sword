const $createElementWithClasses = function(tagName, ...classes) {const tag = document.createElement(tagName);tag.classList.add(...classes);return tag;}
Node.prototype.appendChildren = function(...nodes) {for(const node of nodes) this.appendChild(node);}


const Information = {}
Information.makeSwordIcon = function(src, alt, type) {
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
const Inventory = {}
Inventory.makeHoverSellDiv = function(onclick) {
  const div = $createElementWithClasses("div", "hover_sell");
  const span = document.createElement("span");
  span.textContent = "판매 하기";
  div.appendChild(span);
  div.addEventListener("click", onclick);
  return div;
}
Inventory.makeInventoryArticle = function(src, name, count, sellFnc) {
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
const Making = {}
Making.makeMaterialSection = function(recipes, sale) {
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
Making.makeMaterialDiv = function(itemName, itemType, curc, count, sale) {

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
Making.makeGroupArticle = function(material, result, disabled, clickFunction) {

  const article = $createElementWithClasses("article", "group")

  article.appendChildren(material, result);
  
  const btn = document.createElement("button");
  btn.addEventListener("click", clickFunction);
  btn.textContent = "제작";
  btn.disabled = disabled;

  article.appendChild(btn);

  return article;

}
Making.makeResultSection = function(src, name, count)  {

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
const Stat = {}
Stat.makeIconDiv = function(img_src, onclick) {
  const icon_box = $createElementWithClasses("div", "icon");
  icon_box.addEventListener("click", onclick);

  const img = $createElementWithClasses("img", "stat_img");
  img.src = img_src;
  const stat_up = $createElementWithClasses("div", "stat_up");
  icon_box.appendChildren(img, stat_up);

  return icon_box;
}
Stat.makeLevelDiv = function(current_level) {
  const level_box = $createElementWithClasses("div", "level");
  const ul = document.createElement("ul");
  for(let i=0;i<5;i++) {
    const li_point = $createElementWithClasses("li", "point");
    if(i < current_level) li_point.classList.add("active");
    ul.appendChild(li_point);
  }
  level_box.appendChild(ul);
  return level_box;
}
Stat.makeInfoDiv = function(current_level, name, description, stat_per_level) {
  const info_box = $createElementWithClasses("div", "info");
  const pname = $createElementWithClasses("p", "name");
  pname.textContent = name;
  const pdescription = $createElementWithClasses("p", "description");
  pdescription.textContent = description;
  const details = $createElementWithClasses("ul", "detail");
  const lis = stat_per_level.map((value, index) => {
    const stat_li = $createElementWithClasses("li", "stat_per_level");
    if(current_level == index +1) stat_li.classList.add("active");
    stat_li.textContent = value;
    return stat_li;
  });
  details.appendChildren(...lis);

  info_box.appendChildren(pname, pdescription, details);

  return info_box;
}
Stat.makeStatSection = function(stat) {
  const section = $createElementWithClasses("section", "stat", stat.color);

  const icon_box = this.makeIconDiv(stat.image, () => onStatUp(stat));
  const level_box = this.makeLevelDiv(stat.current);
  const info_box = this.makeInfoDiv(stat.current, stat.name, stat.description, stat.stat_per_level)

  section.appendChildren(icon_box, level_box, info_box);
  return section;
}
const FallMessage = {}
FallMessage.makeDroppedPieceDiv = function(name, count) {
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