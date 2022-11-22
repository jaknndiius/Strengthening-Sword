/* 스탯  */
class Stat {
  constructor(name, description, stat_per_level, color, affixs) {
    this.current = 0;
    this.name = name;
    this.description = description;
    this.stat_per_level = stat_per_level;
    this.color = color;
    this.prefix = affixs[0];
    this.suffix = affixs[1];
  }
  getCurrent() {
    return (this.current == 0) ? 0 : this.stat_per_level[this.current-1];
  }
}
/**
 * 스탯 관련 객체
 */
StatName = {
  LUCKY_BRACELET: 0,
  GOD_HAND: 1,
  BIG_MERCHANT: 2,
  SMITH: 3,
  INVALIDATED_SPHERE: 4,
  MAGIC_HAT: 5
}
StatManager = {
  stat_point: 0,
  max_stat_level: 5,
  stats: [
    new Stat("행운 팔찌", "성공 확률 증가", [1, 2, 3, 4, 5], "blue", ["+", ""]),
    new Stat("신의 손", "성공 시 일정 확률로 +2강", [10, 20, 30, 40, 50], "red", ["", "%"]),
    new Stat("대상인", "판매 가격 증가", [5, 10, 15, 20, 25,], "sky", ["+", "%"]),
    new Stat("대장장이", "강화 비용 감소", [1, 2, 3, 4, 5], "green", ["-", "%"]),
    new Stat("무효화 구체", "파괴 시 -1강으로 복구", [10, 20, 30, 40, 50], "purple", ["", "%"]),
    new Stat("마법 모자", "제작소 재료 조각 갯수 감소", [10, 20, 30, 40, 50], "navy", ["-", "개"])
  ]
};
/**
 * 현재 사용 가능한 스탯 갯수를 반환합니다.
 */
StatManager.getStatPoint = function() { return this.stat_point; };
StatManager.addStatPoint = function() { this.stat_point++; };
StatManager.getMaxStatLevel = function() { return this.max_stat_level; }
/**
 * 가진 스탯 포인트를 1 차감하고 해당 스탯의 레벨을 1 올립니다.
 * @param {Stat} stat 레벨을 올릴 스탯
 */
StatManager.upgradeStat = function(stat) {
  if(!(stat instanceof Stat)) throw new TypeError(`${stat} is not stat.`)
  if(stat.current >= this.getMaxStatLevel()) throw new Error(`${stat.name} is already full-upgrade.`);
  if(this.stat_point <= 0) throw new Error(`There are no stat points.`);
  this.stat_point--;
  stat.current++;
};
StatManager.getCurrentStat = function(statName) { return this.stats[statName].getCurrent(); };
StatManager.getLuckyBracelet = function() { return this.getCurrentStat(StatName.LUCKY_BRACELET); };
StatManager.getGodHand = function() { return this.getCurrentStat(StatName.GOD_HAND); };
StatManager.getBigMerchant = function() { return this.getCurrentStat(StatName.BIG_MERCHANT); };
StatManager.getSmith = function() { return this.getCurrentStat(StatName.SMITH); };
StatManager.getInvalidatedSphere = function() { return this.getCurrentStat(StatName.INVALIDATED_SPHERE); };
StatManager.getMagicHat = function() { return this.getCurrentStat(StatName.MAGIC_HAT); };

/**
 * 초기 확률과 [ 행운 팔찌 ]의 현재 스탯을 계산한 확률을 반환합니다.
 * @param {number} initialProb 초기 확률
 */
StatManager.calculateLuckyBraclet = function(initialProb) { return Math.min(initialProb + this.getLuckyBracelet()/100, 1) };
/**
 * 초기 비용과 [ 대장장이 ]의 현재 스탯을 계산하여 비용을 반환합니다.
 * @param {number} initialCost 초기 비용
 */
StatManager.calculateSmith = function(initialCost) { return initialCost*(100 - this.getSmith())/100 };
/**
 * 초기 가격과 [ 대상인 ]의 현재 스탯을 계산하여 가격을 반환합니다.
 * @param {number} initialPrice 초기 가격
 */
StatManager.calculateBigMerchant = function(initialPrice) { return initialPrice*(100 + this.getBigMerchant())/100 };