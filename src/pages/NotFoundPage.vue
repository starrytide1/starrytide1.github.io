<script setup>
/**
 * 兜底页：把 404 写成一张「走失档案」，延续整体纸本质感。
 */
</script>

<template>
  <section class="lost" aria-labelledby="lost-title">
    <div class="wrap lost__inner">
      <span class="lost__code">ERR · 404</span>
      <div class="lost__seal" aria-hidden="true">？</div>
      <h1 id="lost-title">这张档案，<em>走失了。</em></h1>
      <p>你要找的编号不在架子上。也许它换了个抽屉，也许它从未存在过——毕竟这里专收说不清的故事。</p>
      <router-link class="btn btn--solid" to="/">回到档案室 <span aria-hidden="true">→</span></router-link>
    </div>
  </section>
</template>

<style scoped>
.lost { min-height: 62vh; display: grid; place-items: center; padding: var(--space-8) 0; }
.lost__inner { position: relative; text-align: center; display: flex; flex-direction: column; align-items: center; }
.lost__code {
  font-family: var(--font-type); font-size: var(--text-xs); letter-spacing: .18em;
  color: var(--color-accent); border: 1px solid var(--color-line-strong); padding: 6px 14px;
}
.lost__seal {
  margin: var(--space-5) 0 var(--space-4);
  width: 92px; height: 92px; border-radius: 50%; display: grid; place-items: center;
  font-family: var(--font-display); font-size: 3rem; color: var(--color-seal);
  border: 3px double var(--color-seal); transform: rotate(-9deg); opacity: .8;
}
.lost h1 { font-size: var(--text-2xl); line-height: 1.2; }
.lost h1 em { color: var(--color-accent); }
.lost p { margin: var(--space-4) 0 var(--space-5); color: var(--color-muted); font-size: var(--text-sm); line-height: 2; max-width: 34em; }
</style>
