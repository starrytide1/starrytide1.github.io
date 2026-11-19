<script setup>
/**
 * 顶部导航：移动菜单开合 + 当前路由栏目高亮。
 */
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const links = [
  { name: 'home', to: '/', label: '首页' },
  { name: 'scripts', to: '/scripts', label: '剧本杀' },
  { name: 'soup', to: '/#soup', label: '海龟汤' },
  { name: 'riddle', to: '/#riddle', label: '每日谜题' },
  { name: 'notes', to: '/notes', label: '玩家手记' }
];

const navOpen = ref(false);
const toggleBtn = ref(null);
const activeName = computed(() => route.name);

/** 锚点栏目在首页时按 hash 高亮，普通栏目按路由名高亮。 */
function isActive(link) {
  if (link.to.includes('#')) {
    const hash = link.to.slice(link.to.indexOf('#'));
    return route.name === 'home' && route.hash === hash;
  }
  return activeName.value === link.name && !route.hash;
}

function closeNav() {
  navOpen.value = false;
}

function onKeydown(event) {
  if (event.key === 'Escape' && navOpen.value) {
    closeNav();
    toggleBtn.value?.focus();
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <router-link class="brand" to="/" aria-label="子夜档案馆 首页" @click="closeNav">
        <span class="brand__seal" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" stroke="currentColor" stroke-width="1.4"/>
            <circle cx="20" cy="20" r="12.5" stroke="currentColor" stroke-width="0.7" opacity=".6"/>
            <path d="M20 10v3M20 27v3M10 20h3M27 20h3" stroke="currentColor" stroke-width="1.2"/>
            <circle cx="20" cy="20" r="4.2" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </span>
        <span class="brand__name">
          <strong>子夜档案馆</strong>
          <small>MIDNIGHT ARCHIVE · 推理剧本社</small>
        </span>
      </router-link>

      <button
        ref="toggleBtn"
        class="nav-toggle"
        type="button"
        :aria-expanded="String(navOpen)"
        aria-controls="primaryNav"
        @click="navOpen = !navOpen"
      >
        <span></span><span></span><span></span>
        <span class="sr-only">展开导航菜单</span>
      </button>

      <nav id="primaryNav" class="primary-nav" :class="{ 'is-open': navOpen }" aria-label="主导航">
        <router-link
          v-for="link in links"
          :key="link.name"
          :to="link.to"
          :class="{ 'is-active': isActive(link) }"
          :aria-current="isActive(link) ? 'page' : undefined"
          @click="closeNav"
        >{{ link.label }}</router-link>
        <router-link class="nav-cta" to="/reserve" @click="closeNav">预约夜场 <span aria-hidden="true">↗</span></router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky; top: 0; z-index: 800;
  background: rgba(242, 235, 223, .88);
  backdrop-filter: blur(14px) saturate(1.2);
  border-bottom: 1px solid var(--color-line);
}
.header-inner {
  width: min(100% - 2 * var(--space-4), var(--wrap));
  margin-inline: auto;
  min-height: 84px;
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
}
.brand { display: inline-flex; align-items: center; gap: 12px; flex-shrink: 0; }
.brand__seal { width: 42px; height: 42px; color: var(--color-accent); flex-shrink: 0; }
.brand__seal svg { width: 100%; height: 100%; }
.brand__name { display: flex; flex-direction: column; line-height: 1.25; }
.brand__name strong {
  font-family: var(--font-display); font-size: 1.16rem; letter-spacing: -0.02em; color: var(--color-ink);
}
.brand__name small {
  font-family: var(--font-type); font-size: .60rem; letter-spacing: .08em; color: var(--color-muted);
  margin-top: 3px;
}
.primary-nav { display: flex; align-items: center; gap: clamp(14px, 2vw, 30px); }
.primary-nav > a:not(.nav-cta) {
  font-size: var(--text-sm); font-weight: 600; color: var(--color-text);
  position: relative; padding: 10px 0; white-space: nowrap;
}
.primary-nav > a:not(.nav-cta).is-active { color: var(--color-accent); }
.primary-nav > a:not(.nav-cta)::after {
  content: ""; position: absolute; left: 0; right: 100%; bottom: 4px;
  height: 2px; background: var(--color-accent);
  transition: right var(--dur-base) var(--ease-out);
}
.primary-nav > a:not(.nav-cta):hover::after,
.primary-nav > a:not(.nav-cta):focus-visible::after { right: 0; }
.nav-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 20px; min-height: 44px;
  background: var(--color-ink); color: var(--color-surface);
  font-size: var(--text-sm); font-weight: 600; border-radius: var(--radius-sm);
  transition: background var(--dur-fast) ease, transform var(--dur-fast) var(--ease-out);
}
.nav-cta:hover { background: var(--color-accent); transform: translateY(-2px); }
.nav-cta span { color: #E8B48C; }
.nav-cta:hover span { color: #FFF9F0; }

.nav-toggle {
  display: none; width: 44px; height: 44px; background: none; border: 0;
  flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer;
}
.nav-toggle span:not(.sr-only) {
  display: block; width: 22px; height: 2px; background: var(--color-ink);
  transition: transform var(--dur-fast) var(--ease-out), opacity var(--dur-fast) ease;
}
.nav-toggle[aria-expanded="true"] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggle[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.nav-toggle[aria-expanded="true"] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 900px) {
  .nav-toggle { display: flex; }
  .primary-nav {
    position: absolute; top: 100%; left: 0; right: 0;
    display: flex; flex-direction: column; align-items: stretch; gap: 0;
    background: var(--color-surface); border-bottom: 1px solid var(--color-line);
    box-shadow: var(--shadow-2); padding: 8px var(--space-4) var(--space-4);
    opacity: 0; visibility: hidden; transform: translateY(-10px);
    transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), visibility var(--dur-base);
  }
  .primary-nav.is-open { opacity: 1; visibility: visible; transform: none; }
  .primary-nav > a:not(.nav-cta) { padding: 14px 4px; border-bottom: 1px solid var(--color-line); font-size: var(--text-base); }
  .nav-cta { margin-top: var(--space-3); justify-content: center; }
}
@media (max-width: 560px) {
  .brand__name small { display: none; }
}
</style>
