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
//밸런스 계산을 위한 함수
function cal() {
  const sidx = 0;

  const p = (initp, bm) => initp*(100 + bm)/100;
  const c = (initc, smi) => initc*(100 - smi)/100;

  const f = (sidx) => {

    const rl = [];
    let t = 0;
    for(let i=0;i<SwordManager.swords.length;i++) {
      let b;
      let s;
      if(sidx == -1) {
        b = 0; s = 0;
      } else {
        b = StatManager.stats.BIG_MERCHANT.stat_per_level[sidx];
        s = StatManager.stats.SMITH.stat_per_level[sidx];
      }
      const sword = SwordManager.getSword(i);
      const price = p(sword.price, b);
      const loss = SwordManager.swords.slice(0, i+1).reduce((pre, cur) => pre += c(cur.cost, s), 0);

      //손익 분기점 출력-> 15,15,14,14,13,12
      if(price >= loss && t++ == 0) console.log(sidx, i);
      if(t > 0 && price <= loss) console.log('why!', sidx, i);
      rl.push(price - loss);
    }
    return rl;
  }

  const result = [];
  for(let i=-1;i<5;i++) {
    result.push(f(i));
  }
  // for(let i=0;i<result[0].length;i++) {
  //   const a=result[0][i];
  //   const b=result[1][i];
  //   const c=result[2][i];
  //   const d=result[3][i];
  //   const e=result[4][i];
  //   const f=result[5][i];
  //   console.log(b-a, c-b, d-c, e-d, f-e);
  // }

  // 비용, 가격이 점점 많이 증가하도록 조정
  const costs = SwordManager.swords.map(value => value.cost);
  const prices = SwordManager.swords.map(value => value.price);
  // costs.reduce((pre, cur, idx) => {console.log(cur - pre, SwordManager.getSword(idx).name); return cur;});
  // prices.reduce((pre, cur, idx) => {console.log(cur - pre, SwordManager.getSword(idx).name); return cur;});
}
