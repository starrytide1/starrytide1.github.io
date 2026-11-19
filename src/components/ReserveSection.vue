<script setup>
/**
 * 预约夜场：本地邮箱格式校验，仅给出反馈，不提交到任何服务器。
 */
import { ref } from 'vue';

const email = ref('');
const message = ref('');
const invalid = ref(false);
const emailInput = ref(null);

function submit() {
  const value = email.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!valid) {
    invalid.value = true;
    message.value = '请留下一个有效的邮箱地址，我们才好给你寄谜题。';
    emailInput.value?.focus();
    return;
  }
  invalid.value = false;
  message.value = '座位记下了。周五见——记得带一个相信你的人。';
  email.value = '';
}
</script>

<template>
  <section class="section section--reserve" id="reserve" aria-labelledby="reserve-title">
    <div class="reserve-panel" v-reveal>
      <div class="reserve-seal" aria-hidden="true"><span>预<br>约</span></div>
      <div class="reserve-copy">
        <span class="type-label">RESERVATION · 每周五 20:00 夜场</span>
        <h2 id="reserve-title">灯已经亮了，<br><em>位置还留着。</em></h2>
        <p>留下邮箱，下一场局的名单和谜题会一起寄给你。不发广告，只发好故事。</p>
      </div>
      <form class="reserve-form" novalidate @submit.prevent="submit">
        <label class="sr-only" for="reserveEmail">你的邮箱</label>
        <div class="reserve-form__row">
          <input
            id="reserveEmail"
            ref="emailInput"
            v-model="email"
            type="email"
            placeholder="your@email.com"
            autocomplete="email"
            required
            aria-describedby="reserveMsg"
            :aria-invalid="invalid ? 'true' : undefined"
          >
          <button class="btn btn--solid" type="submit">占个座 <span aria-hidden="true">→</span></button>
        </div>
        <p id="reserveMsg" class="form-msg" role="status">{{ message }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.section--reserve { padding-block: var(--space-7); background: var(--color-bg); }
.reserve-panel {
  position: relative; overflow: hidden;
  background: var(--color-surface); border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-sm); box-shadow: var(--shadow-2);
  padding: clamp(32px, 5vw, 64px);
  display: grid; grid-template-columns: 1.15fr .85fr; gap: clamp(28px, 5vw, 72px); align-items: center;
  background-image: radial-gradient(30rem 20rem at 100% 0%, rgba(206, 170, 118, .18), transparent 65%);
}
.reserve-seal {
  position: absolute; right: 6%; bottom: -34px; width: 148px; height: 148px; border-radius: 50%;
  display: grid; place-items: center; transform: rotate(-14deg); opacity: .16;
  border: 3px double var(--color-accent); color: var(--color-accent);
  font-family: var(--font-body); font-size: 2.2rem; font-weight: 900; line-height: 1.1; text-align: center;
}
.reserve-copy { position: relative; z-index: 1; }
.reserve-copy h2 { font-size: var(--text-2xl); line-height: 1.2; margin: var(--space-3) 0; }
.reserve-copy h2 em { color: var(--color-accent); }
.reserve-copy p { color: var(--color-muted); font-size: var(--text-sm); line-height: 1.95; max-width: 32em; }
.reserve-form { position: relative; z-index: 1; }
.reserve-form__row { display: flex; gap: 10px; }
.reserve-form input {
  flex: 1; min-width: 0; min-height: 50px; padding: 10px 14px;
  background: #FFFDF8; border: 1.5px solid var(--color-line-strong); border-radius: var(--radius-sm);
  font-size: var(--text-sm); transition: border-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease;
}
.reserve-form input::placeholder { color: #8A7A67; }
.reserve-form input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(166, 83, 46, .14); }
.reserve-form input[aria-invalid="true"] { border-color: var(--color-seal); }
.form-msg { min-height: 1.6em; margin-top: 10px; font-size: var(--text-sm); color: var(--color-accent); }

@media (max-width: 900px) {
  .reserve-panel { grid-template-columns: 1fr; }
  .reserve-seal { right: -30px; bottom: -50px; }
}
@media (max-width: 560px) {
  .reserve-form__row { flex-direction: column; }
}
</style>
