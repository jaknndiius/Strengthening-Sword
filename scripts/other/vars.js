const $ = (selector) => document.querySelector(selector);
const $createElementWithClasses = function(tagName, ...classes) {const tag = document.createElement(tagName);tag.classList.add(...classes);return tag;}
Node.prototype.appendChildren = function(...nodes) {for(const node of nodes) this.appendChild(node);}
HTMLElement.prototype.display = function() {this.style.display = "block"};
HTMLElement.prototype.hide = function() {this.style.display = "none"};
const TestResult = {
  MONEY_LACK: "MONEY LACK",
  MAX_UPGRADE: "MAX UPGRADE",
  SUCCESS: "SUCCESS"
}