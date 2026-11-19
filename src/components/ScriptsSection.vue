<script setup>
/**
 * 剧本杀栏目：档案数据驱动卡片列表，插画交给 ScriptArtwork。
 */
import { SCRIPT_CARDS } from '../data/scripts.js';
import ScriptArtwork from './ScriptArtwork.vue';
</script>

<template>
  <section class="section section--scripts" id="scripts" aria-labelledby="scripts-title">
    <div class="wrap">
      <header class="section-head" v-reveal>
        <div class="section-index">
          <span class="type-label">01 — SCRIPT MURDER</span>
          <span class="section-index__no">壹</span>
        </div>
        <div class="section-head__main">
          <h2 id="scripts-title">今晚，<em>你是谁？</em></h2>
          <p>三十二部存档，从情感沉浸到硬核诡计。翻开封面之前，没有人知道结局——包括你。</p>
        </div>
        <router-link class="text-link" to="/reserve">查看完整档案库 <span aria-hidden="true">↗</span></router-link>
      </header>

      <div class="script-grid">
        <article
          v-for="(card, index) in SCRIPT_CARDS"
          :key="card.no"
          v-reveal="index * 90"
          class="script-card"
          :class="card.variant"
        >
          <div class="script-card__top">
            <span>档案 No. {{ card.no }}</span>
            <span class="difficulty" :aria-label="card.difficultyLabel">{{ card.difficulty }}</span>
          </div>
          <div class="script-card__art">
            <ScriptArtwork :art="card.art" />
          </div>
          <div class="script-card__body">
            <h3>{{ card.title }}</h3>
            <p class="script-card__desc">{{ card.desc }}</p>
            <ul class="tags"><li v-for="tag in card.tags" :key="tag">{{ tag }}</li></ul>
            <div class="script-card__meta"><span v-for="item in card.meta" :key="item">{{ item }}</span></div>
            <router-link class="script-card__link" to="/reserve">调阅此档 <span aria-hidden="true">→</span></router-link>
          </div>
          <span v-if="card.stamp" class="corner-stamp">{{ card.stamp }}</span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section--scripts { background: var(--color-bg); }
.script-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: clamp(24px, 3.5vw, 48px);
}
.script-card {
  position: relative; background: var(--color-surface);
  border: 1px solid var(--color-line); border-radius: var(--radius-sm);
  box-shadow: var(--shadow-1); overflow: hidden;
  transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
}
.script-card:nth-child(2) { margin-top: 56px; }
.script-card:nth-child(3) { margin-top: -24px; }
.script-card:nth-child(4) { margin-top: 32px; }
.script-card:hover, .script-card:focus-within { transform: translateY(-9px) rotate(-.4deg); box-shadow: var(--shadow-3); }
.script-card--accent { background: #F6EADA; }
.script-card__top {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 20px; border-bottom: 1px dashed var(--color-line-strong);
  font-family: var(--font-type); font-size: .68rem; letter-spacing: .08em; color: var(--color-muted);
}
.difficulty { color: var(--color-accent); letter-spacing: .12em; font-size: .72rem; }
.script-card__art {
  height: 190px; display: grid; place-items: center; color: var(--color-ink);
  background: linear-gradient(160deg, rgba(233, 220, 198, .55), rgba(251, 247, 239, .2));
  border-bottom: 1px solid var(--color-line);
}
.script-card__art :deep(svg) { width: min(80%, 260px); height: 100%; padding: 14px 0; opacity: .88; transition: transform var(--dur-base) var(--ease-out); }
.script-card:hover .script-card__art :deep(svg) { transform: scale(1.04); }
.script-card__body { padding: 24px 26px 26px; }
.script-card__body h3 { font-size: var(--text-xl); margin-bottom: 10px; }
.script-card__desc { color: var(--color-muted); font-size: var(--text-sm); line-height: 1.85; min-height: 3.7em; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.tags li {
  font-size: .72rem; padding: 3px 10px; border: 1px solid var(--color-line-strong);
  border-radius: 99px; color: var(--color-text); background: rgba(255, 255, 255, .35);
}
.script-card__meta {
  display: flex; flex-wrap: wrap; gap: 14px; margin-top: 20px; padding-top: 16px;
  border-top: 1px solid var(--color-line);
  font-family: var(--font-type); font-size: .70rem; color: var(--color-muted);
}
.script-card__meta span:not(:last-child)::after { content: " ·"; margin-left: 12px; color: var(--color-line-strong); }
.script-card__link {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 20px;
  font-size: var(--text-sm); font-weight: 700; color: var(--color-accent);
}
.script-card__link span { transition: transform var(--dur-fast) var(--ease-out); }
.script-card__link:hover span { transform: translateX(6px); }
.corner-stamp {
  position: absolute; top: 64px; right: -34px;
  background: var(--color-seal); color: #F7E3D2;
  font-family: var(--font-body); font-size: .72rem; font-weight: 700; letter-spacing: .2em;
  padding: 5px 40px; transform: rotate(38deg); opacity: .9;
  box-shadow: var(--shadow-1);
}

@media (max-width: 720px) {
  .script-grid { grid-template-columns: 1fr; }
  .script-card:nth-child(n) { margin-top: 0; }
}
@media (max-width: 560px) {
  .script-card__art { height: 160px; }
}
</style>
