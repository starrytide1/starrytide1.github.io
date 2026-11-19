<script setup>
/**
 * 额外线索的模拟支付弹层。
 * 纯静态演示站点，不接入任何真实支付渠道，不产生扣费。
 */
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false }
});
const emit = defineEmits(['close', 'pay']);

const payBtn = ref(null);
const closeBtn = ref(null);

watch(() => props.open, async (open) => {
  if (!open) return;
  await nextTick();
  payBtn.value?.focus();
});

function onKeydown(event) {
  if (!props.open) return;
  if (event.key === 'Escape') {
    emit('close');
    return;
  }
  if (event.key !== 'Tab') return;

  // 焦点锁在弹层内循环
  const focusables = [payBtn.value, closeBtn.value];
  const idx = focusables.indexOf(document.activeElement);
  if (event.shiftKey && idx <= 0) {
    event.preventDefault();
    focusables[focusables.length - 1]?.focus();
  } else if (!event.shiftKey && idx === focusables.length - 1) {
    event.preventDefault();
    focusables[0]?.focus();
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
  if (props.open) nextTick(() => payBtn.value?.focus());
});
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <div class="modal">
    <div class="modal__backdrop" @click="emit('close')"></div>
    <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="payTitle" aria-describedby="payDesc">
      <span class="type-label">UNLOCK MORE CLUES</span>
      <h3 id="payTitle">线索已经用完了</h3>
      <p id="payDesc">三次免费线索已用完。额外线索需付费解锁——本站为演示站点，我不会真的收取任何费用。</p>
      <div class="modal__actions">
        <button ref="payBtn" class="btn btn--solid" type="button" @click="emit('pay')">模拟支付 · 解锁 3 条</button>
        <button ref="closeBtn" class="btn btn--ghost" type="button" @click="emit('close')">再想想</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal { position: fixed; inset: 0; z-index: 1200; display: grid; place-items: center; padding: var(--space-4); }
.modal[hidden] { display: none; }
.modal__backdrop { position: absolute; inset: 0; background: rgba(44, 35, 28, .66); backdrop-filter: blur(5px); }
.modal__panel {
  position: relative; width: min(100%, 460px);
  background: var(--color-surface); border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-sm); padding: clamp(24px, 4vw, 38px);
  box-shadow: var(--shadow-3);
  animation: riseIn var(--dur-base) var(--ease-out) both;
}
.modal__panel h3 { font-size: var(--text-xl); margin: 12px 0; }
.modal__panel p { color: var(--color-muted); font-size: var(--text-sm); line-height: 1.9; }
.modal__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: var(--space-4); }

@media (max-width: 560px) {
  .modal__actions :deep(.btn) { width: 100%; }
}
</style>
