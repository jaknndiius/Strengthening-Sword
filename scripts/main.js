const $ = (selector) => document.querySelector(selector)

const GameManager = {
  swords: [],
  max_upgradable_count: 30,
  sword_index: 0,
  max_sword_index: 0,
  money: 100000,
  repair_paper: 0,
  inventory: {
    "여신의 눈물": 30,
    "도란의 반지": 230,
    "심연의 가면": 30,
    "얼음 방패": 40,
    "역병의 보석": 100,
    "삼위일체": 2000,
    "바미의 불씨": 2500
  },
  records: [],
  max_recordable_count: 10,
  repair_paper_recipe: {
    "여신의 눈물": 2,
    "도란의 반지": 220
  },
  recipes: {
    "BF 대검": {
      "여신의 눈물": 10,
      "도란의 반지": 13
    },
    "수호자의 검": {
      "심연의 가면": 10,
      "얼음 방패": 10,
      "역병의 보석": 10
    },
    "요우무의 유령검": {
      "도란의 반지": 12,
      "여신의 눈물": 7
    },
    "헤르메스의 시미터": {
      "도란의 반지": 24,
      "바미의 불씨": 30,
    }
  }
}
GameManager.resetSword = function() {
  this.sword_index = 0;
}
GameManager.upgradeSword = function() {
  if(++this.sword_index > this.max_sword_index) this.max_sword_index = this.sword_index;

}
GameManager.canBeRepaired = function() {
  return this.repair_paper >= this.getCurrentSword().requiredRepairs;
}
GameManager.getCurrentSword = function() {
  return this.swords[this.sword_index];
}
GameManager.appendSword = function(sword) {
  this.swords.push(sword);
}
GameManager.calculateLoss = function(index) {
  return this.swords.filter((value, idx) => idx <= index)
      .reduce((pre, cur) => pre += cur.cost, 0);
}
GameManager.renderGameInterFace = function() {

  const sell_button = $("#sell-button");

  const current_sword = this.getCurrentSword();

  $("#sword-image").src = current_sword.image;

  $("#sword-number").textContent = this.sword_index + "강";
  $("#sword-name").textContent = current_sword.name;
  $("#sword-prob").textContent = "강화 성공 확률: " + Math.floor(current_sword.prob *100) + "%";
  $("#sword-cost").textContent = "강화 비용: " + current_sword.cost + "원";
  $("#sword-price").textContent = "판매 가격: " + current_sword.price + "원";
  
  sell_button.style.display = (this.sword_index === 0) ? "none" : "block";

}
GameManager.renderGameInformation = function() {

  const found = this.swords.slice(0, this.max_sword_index +1)
    .map(value => `<div class="sword_icon"><img src="${value.image}" alt="${value.name}"></div>`);
  $("#found-sword-count").textContent = found.length;

  const unknown = this.max_upgradable_count - found.length;
  for(let i = 0; i<unknown; i++) {
    found.push(`<div class="sword_icon"><img src="images/swords/unknown.png" alt="unknown"></div>`);
  }
  $("#found-swords").innerHTML = found.join("");
}
GameManager.renderInventory = function() {

}

GameManager.makeMaterialSection = function(recipes) {
  let material = '<section class="material">';
  for(const [piece_name, count] of Object.entries(recipes)) {
    material += this.makeMaterialDiv(piece_name, this.inventory[piece_name], count);
  }
  material += '</section>';

  return material;
}
GameManager.makeMaterialDiv = function(piece_name, curc, count) {
  curc = (curc) ? curc :0

  return `
  <div class="item">
  <img src="images/piece/${piece_name}.png">
  <span${(curc < count) ?  ' class="unable"' : ''}>${curc + "/" + count}</span$>
  </div>
  `
}
GameManager.renderMaking = function() {
  $("#recipes").innerHTML = "";

  const material = this.makeMaterialSection(this.repair_paper_recipe);

  $("#recipes").innerHTML += `<article class="gruop">${material}<section class="result"><div class="item"><img src="images/repair_paper/복구권.png"><span>복구권</span></div></section><button onclick="GameManager.makeRepairPaper()">제작</button></article>`;

  for(const [sword_name, recipe] of Object.entries(this.recipes)) {

    const result = `<section class="result"><div class="item"><img src="images/swords/${sword_name}.png"><span>${sword_name}</span></div></section>`;
    const material = this.makeMaterialSection(recipe);

    $("#recipes").innerHTML += `<article class="gruop">${material}${result}<button onclick="GameManager.makeSword('${sword_name}')">제작</button></article>`;

  }

}
GameManager.returnDroppedPieces = function(name, count) {
  return {name: name, count: count};
}
GameManager.renderFallMessage = function(...pieces) {
  const pieces_box = $("#pieces");

  $("#loss").textContent = "손실: " + this.calculateLoss(this.sword_index) + "원";
  pieces_box.innerHTML = "";

  pieces.forEach(
      ele => {
          const p = document.createElement("p")
          p.textContent = ele.name + " x " + ele.count
          pieces_box.appendChild(p)
      }
  );
}
GameManager.changeGold = function(number) {

  const gold_change_span = $("#gold-change");

  this.money += number;

  if(this.money < 0) {
    this.money = 0;
  }

  gold_change_span.textContent = ((number >= 0) ? "+" + number : number) + "원";

  gold_change_span.animate(
    [
      {opacity: '1', transform: 'translate(-50%, 0%)'}, 
      {opacity: '0', transform: 'translate(-50%, -70%)'}
    ],
    {duration: 300, fill: "both"}
  );

  this.renderGold();

  return true;
}
GameManager.renderGold = function() {
  $("#gold-number").textContent = this.money;
}
GameManager.addRecord = function(sword, type) {
  this.records.push({sword: sword, type: type});
  let idx = this.records.length - this.max_recordable_count;
  if(idx < 0) idx = 0;

  this.records = this.records.slice(idx);
  this.renderRecords();
}
GameManager.renderRecords = function () {
  const records_div = $("#records");

  records_div.innerHTML = "";
  for(const rec of this.records) {
      const p = document.createElement("p");
      
      if(rec.type == "upgrade") {
          p.textContent = `${rec.sword.name} 강화 -${rec.sword.cost}`;
      } else if(rec.type == "sell")
      p.textContent =  `${rec.sword.name} 판매 +${rec.sword.price}`;
      $("#records").appendChild(p);
  }
}
GameManager.changeBody = function(id) {
  $("#main-body").innerHTML = $("#" + id).innerHTML;
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
GameManager.popupFallMessage = function(...pieces) {

  this.renderFallMessage(...pieces);

  const message_box = $("#message-box");
  message_box.style.display = "block";
  message_box.animate(
      [{opacity: '0'}, {opacity: '1'}],
      {duration: 300, fill: "both"}
  );
}
GameManager.canMake = function(recipe) {
  for(const [key, value] of Object.entries(recipe)) {
    if(this.inventory[key] == null ||
      this.inventory[key] == undefined ||
      this.inventory[key] < value) //재료부족
      return false;
  }
  return true;
}
GameManager.makeWithRecipe = function(recipe) {
  if(!this.canMake(recipe)) return false;
  for(const [key, value] of Object.entries(recipe)) {
    this.inventory[key] -= value;
  }
  return true;
}
GameManager.makeSword = function(sword_name) {
  this.makeWithRecipe(this.recipes[sword_name]);

  // toDo("검으로 이동하기")
  // this.swords.find(value => value.name == sword_name)
  this.renderMaking();
}
GameManager.makeRepairPaper = function() {
  const a = this.makeWithRecipe(this.repair_paper_recipe);
  this.renderMaking();
}


// sword class
class Sword {
  constructor(name, prob, cost, price, requiredRepairs, ...pieces) {
      this.name = name;
      this.image = "images/swords/" + name + ".png";
      this.prob = prob;
      this.cost = cost;
      this.price = price;
      this.requiredRepairs = requiredRepairs;
      this.pieces = pieces;
  }
}
// piece class
class Piece {
  constructor(name, prob, max_drop) {
      this.name = name;
      this.prob = prob;
      this.max_drop = max_drop;
  }

  calculate() {
      if(Math.random() < this.prob) {
          // const num = Math.round(Math.random()*100);
          const result = Math.ceil(Math.round(Math.random()*100)/(100/this.max_drop));
          return GameManager.returnDroppedPieces(this.name, result);
      } return null;
  }
}

const asdf = [
  new Sword("단검", 1.0, 300, 0, 1),
  new Sword("롱소드", 0.95, 300, 100, 1),
  new Sword("처형인의 대검", 0.9, 400, 300, 1),
  new Sword("BF 대검", 0.85, 500, 600, 1),
  new Sword("마나무네", 0.8, 600, 1000, 1),
  new Sword("무라마나", 0.75, 700, 1200, 1, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)),
  new Sword("드락사르의 황혼검", 0.7, 1000, 1500, 1, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)),
  new Sword("무한의 대검", 0.65, 1500, 3000, 1, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)),
  new Sword("수호 천사", 0.6, 5000, 12000, 1, new Piece("바미의 불씨", 1.0, 10), new Piece("도란의 반지", 1.0, 100)),
  new Sword("제국의 명령", 0.55, 10000, 30000, 1),
  new Sword("요우무의 유령검", 0.5, 300, 0, 1),
  new Sword("톱날 단검", 0.45, 300, 100, 1),
  new Sword("독사의 송곳니", 0.4, 400, 300, 1),
  new Sword("리치베인", 0.35, 500, 600, 1),
  new Sword("마법사의 최후", 0.3, 600, 1000, 1),
  new Sword("죽음의 무도", 0.25, 700, 1200, 1),
  new Sword("열정의 검", 0.2, 1000, 1500, 1),
  new Sword("몰락한 왕의 검", 0.15, 1500, 3000, 1),
  new Sword("그림자 검", 0.1, 5000, 12000, 1),
  new Sword("구인수의 격노검", 0.5, 10000, 30000, 1)
]

asdf.forEach(value => GameManager.appendSword(value));

// 초기화 및 전체 업데이트
function init() {
  GameManager.resetSword();
  //GameManager.showGameInterface();
  GameManager.showMaking();
  GameManager.renderGold();
}

// onClick: upgrade button
function upgrade() {

  const current_sword = GameManager.getCurrentSword();
  if(GameManager.money - current_sword.cost <= 0) return;

  console.log(GameManager.max_sword_index);
  GameManager.addRecord(current_sword, "upgrade");
  GameManager.changeGold(-current_sword.cost);

  const num = Math.random();
  console.log(num, current_sword.prob);

  if(num < current_sword.prob) {
      GameManager.upgradeSword();
  } else {
      const re = current_sword.pieces.map(value => value.calculate());

      re.forEach(value => {
          if(value.name in GameManager.inventory) { //인벤토리에 있으면
            GameManager.inventory[value.name] += value.count
          } else { //없으면
            GameManager.inventory[value.name] = value.count
          }
      });
      GameManager.popupFallMessage(...re);
  }
  
  GameManager.renderGameInterFace();
}

// onClick: sell button
function sell() {

  GameManager.addRecord(GameManager.getCurrentSword(), "sell");
  GameManager.changeGold(GameManager.getCurrentSword().price);
  
  init();
}

// onClick: init button
function initButton() {
  $("#message-box").style.display = "none";
  init();
}

// onClick: fix button
function repair() {
  console.log(GameManager.canBeRepaired());
}

/* Footer */

$("#main-game-button").addEventListener("click", () => {
  GameManager.showGameInterface();
})
$("#information-button").addEventListener("click", () => {
  GameManager.showGameInformation();
})
$("#inventory-button").addEventListener("click", () => {
  GameManager.showInventory();
})
$("#making-button").addEventListener("click", () => {
  GameManager.showMaking();
})
init();