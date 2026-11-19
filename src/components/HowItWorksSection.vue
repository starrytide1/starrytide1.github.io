<script setup>
/**
 * 参与流程：三步入戏。
 */
const steps = [
  {
    no: '01',
    title: '挑一本剧本',
    desc: '从档案库里选一个让你心动的故事。选错了也没关系，DM 会替你兜底。'
  },
  {
    no: '02',
    title: '约上三五好友',
    desc: '或者加入我们的拼场。陌生人坐到同一张桌子前，往往更快进入角色。'
  },
  {
    no: '03',
    title: '关掉手机，入戏',
    desc: '灯暗下来之后，你说的每一句话都算数。真相由你们亲手拼出来。'
  }
];
</script>

<template>
  <section class="section section--how" id="how" aria-labelledby="how-title">
    <div class="wrap">
      <header class="section-head" v-reveal>
        <div class="section-index">
          <span class="type-label">04 — HOW IT WORKS</span>
          <span class="section-index__no">肆</span>
        </div>
        <div class="section-head__main">
          <h2 id="how-title">三步，<em>入戏。</em></h2>
        </div>
      </header>
      <ol class="steps">
        <li v-for="(step, index) in steps" :key="step.no" class="step" v-reveal="index * 110">
          <span class="step__no">{{ step.no }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.section--how { background: var(--color-bg); padding-bottom: var(--space-7); }
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(24px, 4vw, 56px); position: relative; }
.steps::before {
  content: ""; position: absolute; top: 30px; left: 12%; right: 12%;
  border-top: 1.5px dashed var(--color-line-strong); z-index: 0;
}
.step { position: relative; z-index: 1; background: var(--color-bg); padding-right: 12px; }
.step__no {
  display: grid; place-items: center; width: 60px; height: 60px; margin-bottom: var(--space-4);
  border: 1.5px solid var(--color-accent); border-radius: 50%;
  background: var(--color-bg); color: var(--color-accent);
  font-family: var(--font-type); font-size: 1.1rem;
}
.step h3 { font-size: var(--text-lg); margin-bottom: 12px; }
.step p { color: var(--color-muted); font-size: var(--text-sm); line-height: 1.95; max-width: 26em; }

@media (max-width: 720px) {
  .steps { grid-template-columns: 1fr; }
  .steps::before { display: none; }
  .step { display: grid; grid-template-columns: 60px 1fr; column-gap: 18px; align-items: start; }
  .step__no { grid-row: 1 / 3; margin: 0; }
  .step h3 { margin-top: 4px; }
}
</style>
