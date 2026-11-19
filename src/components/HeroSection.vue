<script setup>
/**
 * 首屏：非对称档案拼贴 + 动态「今日海龟汤」卡片。
 */
import { computed } from 'vue';
import { SOUP_LIBRARY } from '../data/soups.js';
import { todayIndex, todayLabel } from '../utils/date.js';

const todaySoup = SOUP_LIBRARY[todayIndex(SOUP_LIBRARY.length)];
const soupSnippet = computed(() => (
  todaySoup.prompt.length > 26
    ? `${todaySoup.prompt.slice(0, 26)}……`
    : todaySoup.prompt
));
</script>

<template>
  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero-mesh" aria-hidden="true"></div>

    <div class="hero-inner">
      <div class="hero-copy">
        <p class="eyebrow hero-anim" style="--d: 60ms">
          <span class="eyebrow__rule" aria-hidden="true"></span>
          VOL. 07 · 今晚不打烊
        </p>

        <h1 class="hero-title" id="hero-title">
          <span class="hero-line hero-anim" style="--d: 140ms">把夜晚，</span>
          <span class="hero-line hero-anim" style="--d: 220ms">交给一场<span class="ink-mark">推理<svg viewBox="0 0 160 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8C42 2 108 2 158 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span>。</span>
        </h1>

        <p class="hero-lede hero-anim" style="--d: 320ms">
          剧本杀、海龟汤、沉浸演绎——在咖啡香与旧台灯下，<br class="desktop-only">
          我们为好故事留了一张桌子。今晚，你是谁？
        </p>

        <div class="hero-actions hero-anim" style="--d: 400ms">
          <router-link class="btn btn--solid" to="/scripts">翻开剧本 <span aria-hidden="true">→</span></router-link>
          <router-link class="btn btn--ghost" to="/#soup">来一碗海龟汤</router-link>
        </div>

        <dl class="hero-facts hero-anim" style="--d: 480ms">
          <div><dt>现藏剧本</dt><dd>32<span> 部</span></dd></div>
          <div><dt>汤谱编号</dt><dd>56<span> 道</span></dd></div>
          <div><dt>夜场时间</dt><dd>周五<span> 20:00</span></dd></div>
        </dl>
      </div>

      <!-- 档案拼贴：纯装饰，用 CSS/SVG 手作，无外部图片依赖 -->
      <div class="hero-collage hero-anim" style="--d: 300ms" aria-hidden="true">
        <div class="file file--back">
          <div class="file__head"><span>CASE FILE</span><span>No. 007</span></div>
          <div class="file__lines"><i></i><i></i><i></i><i></i></div>
          <div class="file__stamp">待归档</div>
        </div>

        <div class="file file--mid">
          <div class="file__photo">
            <svg viewBox="0 0 200 150" fill="none">
              <path d="M18 20h164v110H18z" stroke="currentColor" stroke-width="1" opacity=".45"/>
              <path d="M18 52h164M18 98h164M72 20v110M132 20v110" stroke="currentColor" stroke-width=".7" opacity=".3"/>
              <circle cx="112" cy="72" r="30" stroke="currentColor" stroke-width="2"/>
              <path d="M134 96l24 26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
              <path d="M96 74c6-12 24-12 30 0" stroke="currentColor" stroke-width="1.4" opacity=".8"/>
              <circle cx="111" cy="71" r="2.4" fill="currentColor"/>
            </svg>
          </div>
          <div class="file__cap">EVIDENCE / 证物 A—03</div>
        </div>

        <div class="soup-card">
          <span class="type-label">今日海龟汤 · {{ todayLabel() }}</span>
          <p>{{ soupSnippet }}</p>
          <span class="soup-card__meta">{{ todaySoup.id }} · 每日更新</span>
        </div>

        <div class="wax-seal"><span>机密</span></div>
        <div class="ticket"><span>ADMIT ONE</span><b>夜场 · 周五 20:00</b></div>
        <div class="coffee-ring"></div>
        <div class="paperclip"></div>
      </div>
    </div>

    <div class="hero-scroll" aria-hidden="true"><span></span>向下翻阅档案</div>
  </section>
</template>

<style scoped>
.hero { position: relative; overflow: hidden; padding: clamp(56px, 7vw, 104px) 0 var(--space-7); }
.hero-mesh {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(48rem 34rem at 78% 6%, rgba(166, 83, 46, .13), transparent 62%),
    radial-gradient(40rem 30rem at 6% 92%, rgba(206, 170, 118, .28), transparent 60%),
    radial-gradient(30rem 24rem at 50% 40%, rgba(255, 252, 245, .55), transparent 70%);
}
.hero-inner {
  position: relative; z-index: 1;
  width: min(100% - 2 * var(--space-4), var(--wrap)); margin-inline: auto;
  display: grid; grid-template-columns: 1.02fr .98fr; align-items: center;
  gap: clamp(32px, 5vw, 72px);
}
.hero-copy { padding-block: 20px; }
.eyebrow { display: flex; align-items: center; gap: 12px; color: var(--color-accent); font-weight: 600; }
.eyebrow__rule { width: 38px; height: 1px; background: var(--color-accent); display: inline-block; }
.hero-title {
  font-size: var(--text-3xl);
  line-height: var(--leading-tight);
  margin: var(--space-4) 0 var(--space-5);
  letter-spacing: -0.045em;
}
.hero-line { display: block; }
.ink-mark { position: relative; color: var(--color-accent); white-space: nowrap; }
.ink-mark svg {
  position: absolute; left: 0; right: 0; bottom: -8px; width: 100%; height: 12px;
  color: var(--color-accent); opacity: .55;
}
.hero-lede { color: var(--color-muted); max-width: 34em; font-size: var(--text-lg); line-height: 1.9; }
.hero-actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-5); }

.hero-facts {
  display: flex; flex-wrap: wrap; gap: clamp(20px, 4vw, 52px);
  margin-top: var(--space-6); padding-top: var(--space-4);
  border-top: 1px solid var(--color-line);
}
.hero-facts div { display: flex; flex-direction: column; gap: 2px; }
.hero-facts dt {
  font-family: var(--font-type); font-size: var(--text-xs); letter-spacing: .08em;
  color: var(--color-muted); text-transform: uppercase;
}
.hero-facts dd { font-family: var(--font-display); font-size: 1.7rem; font-weight: 700; color: var(--color-ink); line-height: 1.1; }
.hero-facts dd span { font-family: var(--font-body); font-size: .9rem; font-weight: 400; color: var(--color-muted); }

/* ---- 首屏档案拼贴 ---- */
.hero-collage { position: relative; min-height: 560px; }
.file {
  position: absolute; padding: 18px 20px;
  background: var(--color-surface); border: 1px solid var(--color-line);
  box-shadow: var(--shadow-2); border-radius: var(--radius-xs);
}
.file__head {
  display: flex; justify-content: space-between;
  font-family: var(--font-type); font-size: .64rem; letter-spacing: .12em;
  color: var(--color-accent); padding-bottom: 10px; border-bottom: 1px dashed var(--color-line-strong);
}
.file__lines { display: grid; gap: 9px; margin-top: 16px; }
.file__lines i { display: block; height: 5px; background: var(--color-line); opacity: .55; }
.file__lines i:nth-child(2) { width: 82%; }
.file__lines i:nth-child(3) { width: 91%; }
.file__lines i:nth-child(4) { width: 58%; }
.file--back {
  width: 63%; top: 22px; left: 4%; transform: rotate(-7deg);
  background: #EFE6D6; z-index: 1;
}
.file__stamp {
  position: absolute; right: 16px; bottom: 12px;
  font-family: var(--font-type); font-size: .68rem; color: var(--color-seal);
  border: 1.5px solid var(--color-seal); padding: 2px 6px; transform: rotate(-11deg); opacity: .7;
}
.file--mid { width: 60%; top: 148px; right: 1%; transform: rotate(6deg); z-index: 2; background: #FDF9F1; }
.file__photo {
  background: linear-gradient(135deg, #E9DCC6, #F7F0E2);
  border: 1px solid var(--color-line); padding: 10px; color: var(--color-ink);
}
.file__photo svg { width: 100%; height: auto; }
.file__cap {
  margin-top: 10px; font-family: var(--font-type); font-size: .62rem;
  letter-spacing: .1em; color: var(--color-muted);
}
.soup-card {
  position: absolute; z-index: 4; width: 56%; bottom: 32px; left: 1%;
  padding: 22px 24px; transform: rotate(-2.5deg);
  background: var(--color-dark-bg); color: var(--color-dark-text);
  box-shadow: var(--shadow-3); border-radius: var(--radius-xs);
  border: 1px solid rgba(244, 236, 221, .14);
}
.soup-card :deep(.type-label) { color: #D9A279; font-size: .62rem; }
.soup-card p {
  font-family: var(--font-display); font-size: 1.35rem; font-weight: 600;
  line-height: 1.5; margin: 12px 0; letter-spacing: -0.01em;
}
.soup-card__meta { font-family: var(--font-type); font-size: .64rem; color: #BFA98E; letter-spacing: .08em; }
.wax-seal {
  position: absolute; z-index: 6; top: 42px; right: 7%;
  width: 98px; height: 98px; border-radius: 50%;
  display: grid; place-items: center; transform: rotate(13deg);
  background: radial-gradient(circle at 34% 30%, #A94C2D, #7A2E18 72%);
  box-shadow: 0 8px 18px rgba(90, 33, 16, .35), inset 0 0 0 5px rgba(255, 226, 200, .10);
  color: #F6DFCB;
}
.wax-seal::before {
  content: ""; position: absolute; inset: 9px; border: 1px dashed rgba(255, 226, 200, .45); border-radius: 50%;
}
.wax-seal span { font-family: var(--font-body); font-size: 1.2rem; font-weight: 700; letter-spacing: .16em; }
.ticket {
  position: absolute; z-index: 5; right: -2%; bottom: 106px;
  padding: 12px 20px; background: #E8C79A; color: #4A2E18;
  transform: rotate(9deg); box-shadow: var(--shadow-2);
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  border-left: 2px dashed rgba(74, 46, 24, .45);
  border-right: 2px dashed rgba(74, 46, 24, .45);
}
.ticket span { font-family: var(--font-type); font-size: .58rem; letter-spacing: .16em; }
.ticket b { font-family: var(--font-body); font-size: .78rem; white-space: nowrap; }
.coffee-ring {
  position: absolute; z-index: 3; right: 26%; bottom: 6px;
  width: 96px; height: 96px; border-radius: 50%; opacity: .30;
  border: 7px solid #7A4A2A; border-top-color: rgba(122, 74, 42, .55);
  box-shadow: inset 0 0 0 2px rgba(122, 74, 42, .25);
  transform: rotate(-18deg) scaleY(.92); filter: blur(.4px);
}
.paperclip {
  position: absolute; z-index: 7; top: 6px; left: 42%;
  width: 16px; height: 52px; border: 2px solid #9C8A72; border-radius: 10px;
  transform: rotate(18deg); opacity: .8;
}
.paperclip::after {
  content: ""; position: absolute; top: 8px; left: 3px; width: 6px; height: 30px;
  border: 2px solid #9C8A72; border-radius: 6px;
}

.hero-scroll {
  position: relative; z-index: 1;
  width: min(100% - 2 * var(--space-4), var(--wrap)); margin: var(--space-6) auto 0;
  display: flex; align-items: center; gap: 12px;
  font-family: var(--font-type); font-size: var(--text-xs); letter-spacing: .12em; color: var(--color-muted);
}
.hero-scroll span { display: block; width: 1px; height: 40px; background: var(--color-line-strong); }

@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; gap: var(--space-5); }
  .hero-copy { padding-block: 0; }
  .hero-collage { min-height: 500px; max-width: 620px; width: 100%; margin-inline: auto; }
  .hero-scroll { margin-top: var(--space-4); }
}
@media (max-width: 560px) {
  .hero-title { font-size: clamp(2.8rem, 12vw, 4rem); }
  .hero-facts { gap: 20px; }
  .hero-facts dd { font-size: 1.35rem; }
  .hero-collage { min-height: 420px; transform: scale(.92); transform-origin: top center; }
  .wax-seal { width: 74px; height: 74px; }
  .wax-seal span { font-size: .95rem; }
  .soup-card p { font-size: 1.05rem; }
  .ticket { right: -6%; bottom: 82px; }
  .coffee-ring { width: 70px; height: 70px; border-width: 5px; }
}
</style>
