let touch = 0;
$("#developer-mod-button").addEventListener("click", () => {
  if(touch >= 2) {
    MessageWindow.popupMessage($("#developer-mod"));
  } else {
    touch++;
    setTimeout(() => touch=0,500)
  }
});
$("#infinity-gold").addEventListener("click", event => {
  if(event.target.checked) {
    MoneyDisplay.setMoney(Infinity);
  } else {
    MoneyDisplay.setMoney(500000);
  }
});
$("#infinity-material").addEventListener("click", event => {
  if(event.target.checked) {
    InventoryManager.repair_paper = Infinity;
    for(const recipe of Object.values(MakingManager.recipes)) {
      for(const material of recipe) {
        if(material instanceof PieceItem) InventoryManager.savePiece(material.name, Infinity);
        else if(material instanceof SwordItem) InventoryManager.saveSword(material.name, Infinity);
      }
    }
  } else {
    InventoryManager.repair_paper = 0;
    InventoryManager.inventory = [];
  }
});