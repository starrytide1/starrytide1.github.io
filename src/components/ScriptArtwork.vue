<script setup>
/**
 * 剧本档案卡的手绘 SVG 插画，按 art 字段切换。
 */
defineProps({
  art: { type: String, required: true }
});
</script>

<template>
  <!-- 信封与海浪：雾港来信 -->
  <svg v-if="art === 'envelope'" viewBox="0 0 200 132" fill="none" role="img" aria-label="被海水浸湿的信封">
    <path d="M24 44h152v66H24z" stroke="currentColor" stroke-width="1.6"/>
    <path d="M24 45l76 48 76-48" stroke="currentColor" stroke-width="1.4"/>
    <path d="M24 110l76-46 76 46" stroke="currentColor" stroke-width="1" opacity=".5"/>
    <circle cx="100" cy="68" r="9" fill="var(--color-seal)" opacity=".9"/>
    <path d="M0 124c18-9 32 9 50 0s32 9 50 0 32 9 50 0 32 9 50 0" stroke="currentColor" stroke-width="1" opacity=".55"/>
  </svg>

  <!-- 钟楼：钟楼第七响 -->
  <svg v-else-if="art === 'clock'" viewBox="0 0 200 132" fill="none" role="img" aria-label="指向七点的钟楼">
    <path d="M68 40l32-24 32 24" stroke="currentColor" stroke-width="1.6"/>
    <path d="M74 40h52v78H74z" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="100" cy="66" r="18" stroke="currentColor" stroke-width="1.5"/>
    <path d="M100 66V52M100 66l9 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M92 118V92h16v26" stroke="currentColor" stroke-width="1.2"/>
    <path d="M40 118h120" stroke="currentColor" stroke-width="1" opacity=".5"/>
    <path d="M30 34h14M156 34h14M34 28l10 12M166 28l-10 12" stroke="currentColor" stroke-width="1" opacity=".6"/>
  </svg>

  <!-- 咖啡杯与候鸟 -->
  <svg v-else-if="art === 'coffee'" viewBox="0 0 200 132" fill="none" role="img" aria-label="冒热气的咖啡杯与飞鸟">
    <path d="M70 52h60v34a30 30 0 0 1-60 0z" stroke="currentColor" stroke-width="1.6"/>
    <path d="M130 60c22 0 22 20 0 20" stroke="currentColor" stroke-width="1.5"/>
    <path d="M84 44c-7-8 3-12 0-20M104 42c-7-8 3-12 0-20M124 44c-7-8 3-12 0-20" stroke="currentColor" stroke-width="1.2" opacity=".7"/>
    <path d="M34 44c6-7 14-7 20 0M146 34c6-7 14-7 20 0" stroke="currentColor" stroke-width="1.2" opacity=".8"/>
    <path d="M48 112h104" stroke="currentColor" stroke-width="1" opacity=".5"/>
  </svg>

  <!-- 末班地铁 -->
  <svg v-else viewBox="0 0 200 132" fill="none" role="img" aria-label="末班地铁的车门">
    <rect x="34" y="36" width="132" height="74" rx="6" stroke="currentColor" stroke-width="1.6"/>
    <path d="M100 36v74" stroke="currentColor" stroke-width="1.4"/>
    <circle cx="62" cy="90" r="5" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="138" cy="90" r="5" stroke="currentColor" stroke-width="1.3"/>
    <path d="M52 24h96" stroke="currentColor" stroke-width="1" opacity=".6"/>
    <path d="M58 30h84" stroke="currentColor" stroke-width="1" opacity=".35"/>
  </svg>
</template>
