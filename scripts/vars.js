const $ = (selector) => document.querySelector(selector)
const $createElementWithClasses = function(tagName, ...classes) {const tag = document.createElement(tagName);tag.classList.add(...classes);return tag;}
Node.prototype.appendChildren = function(...nodes) {for(const node of nodes) this.appendChild(node);}
HTMLElement.prototype.display = function() {this.style.display = "block"};
HTMLElement.prototype.hide = function() {this.style.display = "none"};

const Path = {}
Path.unknownPath = "images/swords/unknown.png";
Path.repairPath = "images/repair_paper/복구권.png";
Path.moneyPath = "images/item/돈.png";
Path.piecePath = piece_name => `images/item/${piece_name}.png`;
Path.swordPath = sword_name => `images/swords/${sword_name}.png`;

const TestResult = {
  MONEY_LACK: "MONEY LACK",
  MAX_UPGRADE: "MAX UPGRADE",
  SUCCESS: "SUCCESS"
}