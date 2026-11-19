<script setup>
/**
 * 每日谜题：题库按日期选一题，卡片正面题目、背面答案。
 */
import { ref } from 'vue';
import { RIDDLES } from '../data/riddles.js';
import { todayIndex } from '../utils/date.js';

const riddle = RIDDLES[todayIndex(RIDDLES.length)];
const flipped = ref(false);
const flipBtn = ref(null);
const flipBack = ref(null);

function flip() {
  flipped.value = true;
  flipBack.value?.focus();
}

function flipBackToFront() {
  flipped.value = false;
  flipBtn.value?.focus();
}
</script>

<template>
  <section class="section section--riddle" id="riddle" aria-labelledby="riddle-title">
    <div class="wrap riddle-wrap">
      <div class="riddle-block" v-reveal>
        <span class="type-label">03 — DAILY PUZZLE · 每日一题</span>
        <h2 id="riddle-title">一天一道，<br><em>保持怀疑。</em></h2>
        <p>不是脑筋急转弯，是让你在通勤路上皱一会儿眉头的那种小麻烦。答案在卡片背面。</p>
        <router-link class="text-link" to="/reserve">订阅每日谜题 <span aria-hidden="true">↗</span></router-link>
      </div>

      <div class="flip-card" v-reveal="120">
        <div class="flip-card__inner" :class="{ 'is-flipped': flipped }">
          <div class="flip-face flip-face--front">
            <span class="type-label">PUZZLE No. {{ riddle.id }} · 每日更新</span>
            <!-- 题库为本地静态数据，题目中的 <br> 用于排版换行 -->
            <p class="flip-question" v-html="riddle.q"></p>
            <button ref="flipBtn" class="flip-btn" type="button" @click="flip">翻到背面看看 ↻</button>
          </div>
          <div class="flip-face flip-face--back">
            <span class="type-label">ANSWER / 答案</span>
            <p class="flip-answer">{{ riddle.a }}</p>
            <p class="flip-note">{{ riddle.n }}</p>
            <button ref="flipBack" class="flip-btn" type="button" @click="flipBackToFront">翻回去 ↺</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section--riddle { background: var(--color-bg-deep); }
.riddle-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 6vw, 100px); align-items: center; }
.riddle-block h2 { font-size: var(--text-2xl); line-height: 1.2; margin: var(--space-4) 0; }
.riddle-block h2 em { color: var(--color-accent); }
.riddle-block p { color: var(--color-muted); font-size: var(--text-sm); line-height: 2; max-width: 34em; }
.riddle-block :deep(.text-link) { margin-top: var(--space-4); }
.flip-card { perspective: 1200px; min-height: 420px; }
.flip-card__inner {
  position: relative; width: 100%; min-height: 420px;
  transform-style: preserve-3d;
  transition: transform var(--dur-slow) var(--ease-in-out);
}
.flip-card__inner.is-flipped { transform: rotateY(180deg); }
.flip-face {
  position: absolute; inset: 0; backface-visibility: hidden;
  border: 1px solid var(--color-line-strong); border-radius: var(--radius-sm);
  padding: clamp(28px, 4vw, 48px); box-shadow: var(--shadow-2);
  display: flex; flex-direction: column; align-items: flex-start;
}
.flip-face--front { background: var(--color-surface); }
.flip-face--back { background: var(--color-ink); color: var(--color-dark-text); transform: rotateY(180deg); }
.flip-face--back :deep(.type-label) { color: #D9A279; }
.flip-question {
  margin-block: auto; font-family: var(--font-display); font-weight: 700;
  font-size: clamp(1.7rem, 3vw, 2.5rem); line-height: 1.45; color: var(--color-ink);
  letter-spacing: -0.02em;
}
.flip-answer {
  margin-block: auto; font-family: var(--font-display); font-weight: 900;
  font-size: clamp(2.6rem, 5vw, 4.2rem); letter-spacing: .1em; color: #D99562;
}
.flip-note { font-size: var(--text-sm); line-height: 1.9; color: var(--color-dark-muted); }
.flip-btn {
  margin-top: 24px; background: none; border: 0; border-bottom: 1px solid currentColor;
  color: var(--color-accent); font-weight: 700; font-size: var(--text-sm);
  padding: 6px 0; cursor: pointer; min-height: 44px;
}
.flip-face--back .flip-btn { color: #D99562; }

@media (max-width: 900px) {
  .riddle-wrap { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .flip-card, .flip-card__inner { min-height: 380px; }
}
</style>
