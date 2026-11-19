<script setup>
/**
 * 首页：完整的滚动档案叙事，按栏目顺序组合全部 section。
 * 海龟汤与每日谜题已并入首页，导航通过锚点直达对应板块。
 */
import HeroSection from '../components/HeroSection.vue';
import ScriptsSection from '../components/ScriptsSection.vue';
import SoupSection from '../components/SoupSection.vue';
import RiddleSection from '../components/RiddleSection.vue';
import HowItWorksSection from '../components/HowItWorksSection.vue';
import FieldNotesSection from '../components/FieldNotesSection.vue';
import ReserveSection from '../components/ReserveSection.vue';
</script>

<template>
  <HeroSection />
  <ScriptsSection />
  <SoupSection />
  <RiddleSection />
  <HowItWorksSection />
  <FieldNotesSection />
  <ReserveSection />
</template>
