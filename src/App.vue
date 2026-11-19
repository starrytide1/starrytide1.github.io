<script setup>
/**
 * 应用外壳：站点级固定元素（跳转链接、纸张颗粒、页头、跑马灯、页脚）
 * 只在这里装配一次，路由切换时仅有 <router-view> 内的页面发生变化。
 */
import SiteHeader from './components/SiteHeader.vue';
import TickerStrip from './components/TickerStrip.vue';
import SiteFooter from './components/SiteFooter.vue';
</script>

<template>
  <a class="skip-link" href="#main">跳到主要内容</a>
  <div class="grain" aria-hidden="true"></div>

  <SiteHeader />
  <TickerStrip />

  <main id="main">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </main>

  <SiteFooter />
</template>
