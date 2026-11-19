<script setup>
/**
 * 跑马灯：一份词条数组渲染两遍，CSS 用 translateX(-50%) 无缝循环。
 */
const items = ['本期上新', '剧本杀', '海龟汤', '沉浸演绎', '新手友好', '老玩家慎入', '每周五夜场'];
</script>

<template>
  <div class="ticker" aria-label="本期栏目">
    <div class="ticker__track">
      <template v-for="round in 2" :key="round">
        <template v-for="(item, index) in items" :key="`${round}-${index}`">
          <span>{{ item }}</span><i aria-hidden="true">✦</i>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  overflow: hidden; background: var(--color-ink); color: var(--color-surface);
  padding: 14px 0; border-block: 1px solid rgba(255, 249, 240, .1);
}
.ticker__track {
  display: flex; align-items: center; gap: 28px; width: max-content;
  animation: tickerMove 34s linear infinite;
  font-family: var(--font-type); font-size: .82rem; letter-spacing: .16em; white-space: nowrap;
}
.ticker__track i { color: var(--color-accent); font-style: normal; }
@keyframes tickerMove { to { transform: translateX(-50%); } }
.ticker:hover .ticker__track { animation-play-state: paused; }
</style>
