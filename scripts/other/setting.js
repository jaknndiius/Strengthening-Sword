const $ = selector => document.querySelector(selector);
const $createElement = tagName => document.createElement(tagName);
const $createElementWithClasses = (tagName, ...classes) => { const tag = $createElement(tagName); tag.classList.add(...classes); return tag; };
const $createImgWithSrc = (src, alt="") => { const img = new Image(); img.src = src; img.alt = alt; return img; };
Node.prototype.text = function(textContent) { this.textContent = textContent; return this; }
Node.prototype.appendChildren = function(...nodes) { for(const node of nodes ) this.appendChild(node); };
HTMLElement.prototype.display = function() { this.style.display = "block" };
HTMLElement.prototype.hide = function() { this.style.display = "none" };
const TestResult = {
  /**
   * 자원 부족으로 불가능
   */
  RESOURCES_LACK: "RESOURCES LACK",
  /**
   * 최대 강화 달성으로 불가능
   */
  MAX_UPGRADE: "MAX UPGRADE",
  /**
   * 업그레이드 가능
   */
  SUCCESS: "SUCCESS"
};
const Path = {
  "repair": "images/items/repair_paper.png",
  "money": "images/items/money.png",
  "unknown": "images/items/unknown.png",
  "BF 대검": "images/swords/bf_sword.png",
  "광휘의 검": "images/swords/sheen.png",
  "구인수의 격노검": "images/swords/guinsoos_rageblade.png",
  "그림자 검": "images/swords/umbral_glaive.png",
  "단검": "images/swords/dagger.png",
  "도란의 검": "images/swords/dorans_blade.png",
  "독사의 송곳니": "images/swords/serpents_fang.png",
  "드락사르의 황혼검": "images/swords/duskblade_of_draktharr.png",
  "롱소드": "images/swords/long_sword.png",
  "리치베인": "images/swords/lich_bane.png",
  "마나무네": "images/swords/manamune.png",
  "마법사의 최후": "images/swords/wits_end.png",
  "맬모셔스의 아귀": "images/swords/maw_of_malmortius.png",
  "몰락한 왕의 검": "images/swords/blade_of_the_ruined.png",
  "무라마나": "images/swords/muramana.png",
  "무한의 대검": "images/swords/infinity_edge.png",
  "분노의 칼": "images/swords/rageknife.png",
  "수호천사": "images/swords/guardian_angel.png",
  "수호자의 검": "images/swords/guardians_blade.png",
  "열정의 검": "images/swords/zeal.png",
  "요우무의 유령검": "images/swords/yoummuus_ghostblade.png",
  "월식": "images/swords/eclipse.png",
  "제국의 명령": "images/swords/imperial_mandate.png",
  "주문포식자": "images/swords/hexdrinker.png",
  "죽음의 무도": "images/swords/deaths_dance.png",
  "처형인의 대검": "images/swords/executioners_calling.png",
  "톱날 단검": "images/swords/serrated_dirk.png",
  "폭풍갈퀴": "images/swords/stormrazor.png",
  "피바라기": "images/swords/bloodthirster.png",
  "핏빛 칼날": "images/swords/sanguine_blade.png",
  "헤르메스의 시미터": "images/swords/mercurial_scimitar.png",
  "ITEM_FRAME": "images/ui/frames/item_frame.png",
  "RESULT_FRAME": "images/ui/frames/result_frame.png",
  "SWORD_FRAME": "images/ui/frames/sword_frame.png",
  "BIG_MERCHANT": "images/stats/big_merchant.png",
  "SMITH": "images/stats/smith.png",
  "MAGIC_HAT": "images/stats/magic_hat.png",
  "INVALIDATED_SPHERE": "images/stats/invalidated_sphere.png",
  "GOD_HAND": "images/stats/god_hand.png",
  "LUCKY_BRACELET": "images/stats/lucky_bracelet.png",
  "감시하는 와드석": "images/pieces/watchful_wardstone.png",
  "거인의 허리띠": "images/pieces/giants_belf.png",
  "금지된 우상": "images/pieces/forbidden_idol.png",
  "나보리 신속검": "images/pieces/navori_quickblades.png",
  "도란의 반지": "images/pieces/dorans_ring.png",
  "루비 수정": "images/pieces/ruby_crystal.png",
  "마법의 영약": "images/pieces/elixir_of_sorcery.png",
  "망가진 초시계": "images/pieces/broken_stopwatch.png",
  "망각의 구": "images/pieces/oblivion_orb.png",
  "미니언 해체 분석기": "images/pieces/minion_dematerailizer.png",
  "바미의 불씨": "images/pieces/bamis_cinder.png",
  "방출의 마법봉": "images/pieces/blasting_wand.png",
  "사파이어 수정": "images/pieces/sapphire_crystal.png",
  "삼위일체": "images/pieces/trinity_force.png",
  "수은 장식띠": "images/pieces/quicksilver_sash.png",
  "수호자의 보주": "images/pieces/guardians_orb.png",
  "신록의 장벽": "images/pieces/verdant_barrier.png",
  "심연의 가면": "images/pieces/abyssal_mask.png",
  "암흑의 인장": "images/pieces/dark_seal.png",
  "얼음방패": "images/pieces/glacial_buckler.png",
  "에테르 환영": "images/pieces/aether_wisp.png",
  "여신의 눈물": "images/pieces/tear_of_the_goddess.png",
  "역병의 보석": "images/pieces/blighting_jewel.png",
  "요정의 부적": "images/pieces/faerie_charm.png",
  "원기 회복의 구슬": "images/pieces/rejuvenation_bead.png",
  "원칙의 원형낫": "images/pieces/axiom_arc.png",
  "저녁 갑주": "images/pieces/evenshroud.png",
  "점화석": "images/pieces/kindlegem.png",
  "주문 도둑의 검": "images/pieces/spellthiefs_edge.png",
  "증오의 사슬": "images/pieces/anathemas_chains.png",
  "초시계": "images/pieces/commencing_stopwatch.png",
  "충전형 물약": "images/pieces/refillable_potion.png"
};
function loadAllImg() {
  (function load(idx, values) {
    if(idx >= values.length) return;
    $("#img-loadder").appendChild($createImgWithSrc(values[idx]));
    setTimeout(() => load(idx +1, values), 10);
  })(0, Object.values(Path));
}