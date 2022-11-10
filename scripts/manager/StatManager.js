/* 스탯  */
class Stat {
  constructor(name, description, stat_per_level, color) {
    this.current = 0;
    this.name = name;
    this.image = "images/stats/" + name + ".png";
    this.description = description;
    this.stat_per_level = stat_per_level;
    this.color = color;
  }
  getCurrent() {
    return (this.current == 0) ? 0 : this.stat_per_level[this.current-1];
  }
}
StatManager = {
  stat_point: 0,
  LUCKY_BRACELET: 0,
  GOD_HAND: 1,
  BIG_MERCHANT: 2,
  SMITH: 3,
  INVALIDATED_SPHERE: 4,
  MARGIN_HAT: 5,
  stats: [
    new Stat("행운 팔찌", "성공 확률 증가(+)", [1, 2, 3, 4, 5], "blue"),
    new Stat("신의 손", "성공 시 일정 확률로 +2강(%)", [10, 20, 30, 40, 50], "red"),
    new Stat("대상인", "판매 가격 증가(%)", [5, 10, 15, 20, 25], "sky"),
    new Stat("대장장이", "강화 비용 감소(%)", [1, 2, 3, 4, 5], "green"),
    new Stat("무효화 구체", "파괴 시 -1강으로 복구 확률(%)", [10, 20, 30, 40, 50], "purple"),
    new Stat("마법 모자", "제작소 재료 조각 갯수 감소", [1, 2, 3, 4, 5], "navy")
  ]
}
StatManager.addStatPoint = function() { this.stat_point++; }
StatManager.upgradeStat = function(stat) {
  if(!(stat instanceof Stat)) throw new TypeError(`${stat} is not stat.`)
  if(stat.current == 5) throw new Error(`${stat.name} is already full-upgrade.`);
  if(this.stat_point <= 0) throw new Error(`There are no stat points.`);
  this.stat_point--;
  stat.current++;
}
StatManager.getCurrentStat = function(statIndex) { return this.stats[statIndex].getCurrent(); }
StatManager.getLuckyBracelet = function() { return this.getCurrentStat(this.LUCKY_BRACELET); }
StatManager.getGodHand = function() { return this.getCurrentStat(this.GOD_HAND); }
StatManager.getBigMerchant = function() { return this.getCurrentStat(this.BIG_MERCHANT); }
StatManager.getSmith = function() { return this.getCurrentStat(this.SMITH); }
StatManager.getInvalidatedSphere = function() { return this.getCurrentStat(this.INVALIDATED_SPHERE); }
StatManager.getMagicHat = function() { return this.getCurrentStat(this.MARGIN_HAT); }

StatManager.calculateLuckyBraclet = function(initialProb) { return Math.min(initialProb + this.getLuckyBracelet()/100, 1) }
StatManager.calculateSmith = function(initialCost) { return initialCost*(100 - this.getSmith())/100 }
StatManager.calculateBigMerchant = function(initialPrice) { return initialPrice*(100 + this.getBigMerchant())/100 }