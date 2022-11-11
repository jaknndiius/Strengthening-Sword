const $ = (selector) => document.querySelector(selector);
const $createElementWithClasses = (tagName, ...classes) => { const tag = document.createElement(tagName); tag.classList.add(...classes); return tag; };
const $createImgWithSrc = (src, alt) => { const img = new Image(); img.src = src; img.alt = alt ? '' : alt; return img; };
Node.prototype.appendChildren = function(...nodes) { for(const node of nodes ) this.appendChild(node); };
HTMLElement.prototype.display = function() { this.style.display = "block" };
HTMLElement.prototype.hide = function() { this.style.display = "none" };