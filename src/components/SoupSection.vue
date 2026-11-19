<script setup>
/**
 * 海龟汤栏目外壳：汤规旁白 + 游戏卡。
 */
import SoupGameCard from './SoupGameCard.vue';
</script>

<template>
  <section class="section section--soup" id="soup" aria-labelledby="soup-title">
    <div class="wrap">
      <header class="section-head section-head--light" v-reveal>
        <div class="section-index">
          <span class="type-label">02 — TURTLE SOUP</span>
          <span class="section-index__no">贰</span>
        </div>
        <div class="section-head__main">
          <h2 id="soup-title">一碗汤，<em>问出真相。</em></h2>
          <p>主持人只回答「是」「否」或「与此无关」。你需要的不是灵感，是一个足够刁钻的问题。</p>
        </div>
      </header>

      <div class="soup-layout">
        <aside class="soup-rules" v-reveal>
          <div class="rules-card">
            <span class="type-label">HOW TO PLAY / 汤规</span>
            <ol>
              <li><b>01</b><span>读一遍汤面，记住那些反常的细节。</span></li>
              <li><b>02</b><span>用问题缩小范围，主持人的回答只有「是」「否」「与此无关」三种。</span></li>
              <li><b>03</b><span>别急着问「汤里有什么」，先问「他经历了什么」。</span></li>
            </ol>
            <div class="rules-card__foot">
              <span class="verdict verdict--yes">是</span>
              <span class="verdict verdict--no">否</span>
              <span class="verdict verdict--na">与此无关</span>
            </div>
          </div>
          <p class="soup-hint">每碗汤都有汤底。问不动了，就掀开它——但真相通常没你想象的温柔。</p>
        </aside>

        <SoupGameCard />
      </div>
    </div>
  </section>
</template>

<style scoped>
.section--soup {
  background: var(--color-dark-bg); color: var(--color-dark-text);
  background-image:
    radial-gradient(40rem 30rem at 88% 12%, rgba(166, 83, 46, .22), transparent 62%),
    radial-gradient(34rem 28rem at 8% 90%, rgba(142, 91, 52, .16), transparent 60%);
}
.soup-layout { display: grid; grid-template-columns: .72fr 1.28fr; gap: clamp(28px, 4vw, 60px); align-items: start; }
.rules-card {
  padding: var(--space-5); background: rgba(244, 236, 221, .05);
  border: 1px solid var(--color-dark-line); border-radius: var(--radius-sm);
}
.rules-card :deep(.type-label) { color: #D9A279; }
.rules-card ol { margin-top: var(--space-4); display: grid; gap: 22px; }
.rules-card li { display: flex; gap: 14px; align-items: flex-start; }
.rules-card li b {
  font-family: var(--font-type); font-size: .86rem; color: #D99562;
  padding-top: 3px; flex-shrink: 0;
}
.rules-card li span { font-size: var(--text-sm); line-height: 1.85; color: var(--color-dark-muted); }
.rules-card__foot { display: flex; gap: 10px; margin-top: var(--space-5); padding-top: var(--space-4); border-top: 1px dashed var(--color-dark-line); }
.verdict {
  font-family: var(--font-type); font-size: .72rem; padding: 4px 12px;
  border: 1.5px solid currentColor; transform: rotate(-4deg);
}
.verdict--yes { color: #A9C69B; } .verdict--no { color: #D99562; } .verdict--na { color: var(--color-dark-muted); }
.soup-hint { margin-top: var(--space-4); color: var(--color-dark-muted); font-size: var(--text-sm); line-height: 1.9; font-style: italic; }

@media (max-width: 1100px) {
  .soup-layout { grid-template-columns: 1fr; }
  .soup-rules { max-width: 640px; }
  .rules-card ol { grid-template-columns: repeat(3, 1fr); }
  .rules-card li { flex-direction: column; gap: 6px; }
  .rules-card__foot { grid-column: 1 / -1; }
}
@media (max-width: 720px) {
  .rules-card ol { grid-template-columns: 1fr; }
  .rules-card li { flex-direction: row; }
}
</style>
