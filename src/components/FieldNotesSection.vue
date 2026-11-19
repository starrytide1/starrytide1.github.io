<script setup>
/**
 * 玩家手记：散场后的第一句话。
 */
const notes = [
  {
    text: '上一次哭得那么凶，还是因为《候鸟与咖啡》里的那封信。散场后我在门口坐了十分钟才缓过来。',
    name: '阿梨',
    file: '参与档案 No. 023'
  },
  {
    text: '我是个逻辑控，《钟楼第七响》的五小时让我怀疑人生——但那种被诡计正面击败的感觉，太爽了。',
    name: '老 K',
    file: '参与档案 No. 014'
  },
  {
    text: '第一次玩海龟汤就上头，回家地铁上还在问自己：那碗汤，到底是不是海龟汤？',
    name: '小满',
    file: '参与汤 No. 006'
  }
];
</script>

<template>
  <section class="section section--notes" id="notes" aria-labelledby="notes-title">
    <div class="wrap">
      <header class="section-head section-head--light" v-reveal>
        <div class="section-index">
          <span class="type-label">05 — FIELD NOTES</span>
          <span class="section-index__no">伍</span>
        </div>
        <div class="section-head__main">
          <h2 id="notes-title">玩家<em>手记</em></h2>
          <p>散场之后，他们写下的第一句话。</p>
        </div>
      </header>

      <div class="quotes">
        <blockquote v-for="(note, index) in notes" :key="note.name" class="quote" v-reveal="index * 120">
          <span class="quote__mark" aria-hidden="true">“</span>
          <p>{{ note.text }}</p>
          <footer><b>{{ note.name }}</b><span>{{ note.file }}</span></footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section--notes { background: var(--color-bg-deep); }
.quotes { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(22px, 3vw, 40px); }
.quote {
  position: relative; padding: var(--space-5) var(--space-4) var(--space-4);
  border-top: 2px solid var(--color-ink); background: rgba(255, 253, 247, .42);
}
.quote__mark {
  position: absolute; top: 6px; right: 18px; font-family: var(--font-display);
  font-size: 4.4rem; line-height: 1; color: var(--color-line-strong); opacity: .6;
}
.quote p { font-size: var(--text-sm); line-height: 2; color: var(--color-text); font-style: italic; position: relative; }
.quote footer { display: flex; flex-direction: column; gap: 2px; margin-top: var(--space-4); }
.quote footer b { color: var(--color-ink); font-size: var(--text-sm); }
.quote footer span { font-family: var(--font-type); font-size: .64rem; color: var(--color-muted); letter-spacing: .06em; }

@media (max-width: 720px) {
  .quotes { grid-template-columns: 1fr; }
}
</style>
