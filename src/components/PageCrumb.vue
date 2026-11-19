<script setup>
/**
 * 独立栏目页的档案导览条：面包屑 + 栏目代号。
 * 各 section 自带大标题，这里只提供返回首页的路径与档案编号，避免标题重复。
 */
defineProps({
  label: { type: String, required: true },
  code: { type: String, default: '' }
});
</script>

<template>
  <nav class="crumb" aria-label="当前位置">
    <div class="wrap crumb__inner">
      <div class="crumb__path">
        <router-link to="/">首页</router-link>
        <span class="crumb__sep" aria-hidden="true">/</span>
        <span class="crumb__current" aria-current="page">{{ label }}</span>
      </div>
      <span v-if="code" class="crumb__code">{{ code }}</span>
    </div>
  </nav>
</template>

<style scoped>
.crumb {
  background: var(--color-bg-deep);
  border-bottom: 1px solid var(--color-line);
}
.crumb__inner {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
  min-height: 62px;
}
.crumb__path {
  display: flex; align-items: center; gap: 12px;
  font-family: var(--font-type); font-size: var(--text-xs); letter-spacing: .08em;
}
.crumb__path a { color: var(--color-muted); transition: color var(--dur-fast) ease; }
.crumb__path a:hover { color: var(--color-accent); }
.crumb__sep { color: var(--color-line-strong); }
.crumb__current { color: var(--color-accent); font-weight: 700; }
.crumb__code { color: var(--color-line-strong); font-family: var(--font-type); font-size: var(--text-xs); letter-spacing: .12em; }
</style>
