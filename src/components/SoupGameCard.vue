<script setup>
/**
 * 海龟汤游戏卡：提问与判定、线索通道、推理进度、真相还原。
 * 所有规则与状态由 useSoupGame 提供，这里只负责模板与 DOM 副作用。
 */
import { nextTick, ref, watch } from 'vue';
import { useSoupGame } from '../composables/useSoupGame.js';
import CluePayModal from './CluePayModal.vue';

const {
  currentSoup,
  isToday,
  chats,
  askCount,
  question,
  answerOpen,
  hintCountText,
  hintNoteText,
  progress,
  progressNote,
  restoreUnlocked,
  restorePassed,
  restoreOpen,
  restoreText,
  restoreResult,
  payOpen,
  ask,
  submitQuestion,
  toggleAnswer,
  useHint,
  confirmPay,
  openRestore,
  cancelRestore,
  judgeRestore,
  swapSoup,
  backToToday,
  scrollTo
} = useSoupGame();

const chatLog = ref(null);
const answerPanel = ref(null);
const restorePanel = ref(null);
const restoreBtn = ref(null);
const restoreInput = ref(null);
const hintBtn = ref(null);

const roleNames = { me: '提问者', hint: '主持人 · 线索', system: '馆规', host: '主持人' };
const whoLabel = role => roleNames[role] || '主持人';

// 新发言后滚到对话底部
watch(() => chats.value.length, async () => {
  await nextTick();
  if (chatLog.value) chatLog.value.scrollTop = chatLog.value.scrollHeight;
});

async function onToggleAnswer() {
  toggleAnswer();
  if (answerOpen.value) {
    await nextTick();
    scrollTo(answerPanel.value);
  }
}

async function onOpenRestore() {
  openRestore();
  if (restoreOpen.value) {
    await nextTick();
    scrollTo(restorePanel.value);
    restoreInput.value?.focus();
  }
}

async function onCancelRestore() {
  cancelRestore();
  await nextTick();
  restoreBtn.value?.focus();
}

async function onClosePay() {
  payOpen.value = false;
  await nextTick();
  hintBtn.value?.focus();
}

async function onPay() {
  confirmPay();
  await nextTick();
  hintBtn.value?.focus();
}
</script>

<template>
  <div class="game-card" v-reveal="100">
    <div class="game-card__head">
      <span class="type-label">{{ currentSoup.id }} · {{ isToday ? '今日' : '往期' }}</span>
      <div class="game-card__switch">
        <button class="ghost-btn ghost-btn--today" type="button" :hidden="isToday" @click="backToToday">回到今日</button>
        <button class="ghost-btn" type="button" @click="swapSoup">换一碗汤 ↻</button>
      </div>
    </div>

    <h3 class="game-card__title">{{ currentSoup.title }}</h3>
    <p class="game-card__prompt">{{ currentSoup.prompt }}</p>

    <div class="progress-zone">
      <div class="progress-zone__head">
        <span class="type-label">DEDUCTION PROGRESS / 推理进度</span>
        <span class="progress-zone__pct">{{ progress }}%</span>
      </div>
      <div
        class="progress-track"
        role="progressbar"
        aria-label="推理进度"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="progress"
      >
        <span class="progress-fill" :style="{ width: `${progress}%` }"></span>
      </div>
      <p class="progress-zone__note">{{ progressNote }}</p>
      <button
        v-if="restoreUnlocked"
        ref="restoreBtn"
        class="restore-btn"
        type="button"
        :disabled="restorePassed"
        @click="onOpenRestore"
      >{{ restorePassed ? '推理成功 ✓' : '开始还原 →' }}</button>
    </div>

    <div class="game-card__divider"><span>提问记录 / QUESTION LOG</span></div>

    <div ref="chatLog" class="chat-log" aria-live="polite" aria-relevant="additions">
      <div v-for="line in chats" :key="line.id" class="chat-line" :class="`chat-line--${line.role}`">
        <span class="chat-line__who">{{ whoLabel(line.role) }}</span>
        <p>{{ line.text }}</p>
      </div>
    </div>

    <form class="ask-form" @submit.prevent="submitQuestion">
      <label class="sr-only" for="askInput">输入你要问的问题</label>
      <input
        id="askInput"
        v-model="question"
        type="text"
        maxlength="80"
        autocomplete="off"
        placeholder="输入你的问题，例如：他认识那个人吗？"
        required
      >
      <button class="btn btn--solid btn--small" type="submit">提问 <span aria-hidden="true">↵</span></button>
    </form>

    <div class="quick-asks" aria-label="推荐提问">
      <span class="type-label">试试这样问</span>
      <button v-for="q in currentSoup.quick" :key="q" class="quick-ask" type="button" @click="ask(q)">{{ q }}</button>
    </div>

    <div class="game-card__foot">
      <span class="ask-counter">已提问 <b>{{ askCount }}</b> 次</span>
      <button
        class="reveal-btn"
        type="button"
        :aria-expanded="String(answerOpen)"
        aria-controls="answerPanel"
        @click="onToggleAnswer"
      >{{ answerOpen ? '收起汤底 ▴' : '掀开汤底 ▾' }}</button>
    </div>

    <div v-if="answerOpen" id="answerPanel" ref="answerPanel" class="answer-panel">
      <span class="type-label">FILE DECLASSIFIED / 汤底</span>
      <p>{{ currentSoup.answer }}</p>
    </div>

    <div class="hint-zone">
      <div class="hint-zone__head">
        <span class="type-label">CLUE / 线索提示</span>
        <span class="hint-count">{{ hintCountText }}</span>
      </div>
      <p class="hint-zone__desc">下面这个问题，主持人会就你此前得到的「是」，随机展开一段详细情况。线索有限，用之前先想清楚。</p>
      <button ref="hintBtn" class="hint-btn" type="button" aria-haspopup="dialog" @click="useHint">获取一条线索 <span aria-hidden="true">✦</span></button>
      <p class="hint-note">{{ hintNoteText }}</p>
    </div>

    <div v-if="restoreOpen" ref="restorePanel" class="restore-panel">
      <span class="type-label">RECONSTRUCTION / 还原真相</span>
      <p class="restore-panel__intro">从故事的开始讲起，写下你认定的完整真相。字数不限——主持人只核对核心要点。</p>
      <label class="sr-only" for="restoreInput">你的完整还原</label>
      <textarea
        id="restoreInput"
        ref="restoreInput"
        v-model="restoreText"
        rows="6"
        placeholder="很多年前，他……"
      ></textarea>
      <div class="restore-panel__actions">
        <button class="btn btn--solid btn--small" type="button" @click="judgeRestore">提交还原</button>
        <button class="btn btn--ghost btn--small" type="button" @click="onCancelRestore">再想想</button>
      </div>
      <p
        v-if="restoreResult"
        class="restore-result"
        :class="restoreResult.type === 'success' ? 'restore-result--success' : 'restore-result--fail'"
        role="status"
      >{{ restoreResult.text }}</p>
    </div>

    <CluePayModal v-if="payOpen" :open="payOpen" @close="onClosePay" @pay="onPay" />
  </div>
</template>

<style scoped>
.game-card {
  background: var(--color-surface); color: var(--color-text);
  border-radius: var(--radius-sm); padding: clamp(24px, 3.4vw, 44px);
  box-shadow: var(--shadow-3); position: relative;
  border: 1px solid #D8C7AE;
}
.game-card::before {
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px;
  background: repeating-linear-gradient(90deg, var(--color-accent) 0 34px, var(--color-ink) 34px 68px);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}
.game-card__head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.game-card__switch { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
.ghost-btn--today { font-size: .78rem; color: var(--color-muted); }
.ghost-btn--today:hover { color: var(--color-accent); }
.ghost-btn--today[hidden] { display: none; }
.ghost-btn {
  background: none; border: 0; cursor: pointer; color: var(--color-accent);
  font-size: var(--text-sm); font-weight: 600; padding: 8px 4px; min-height: 44px;
}
.ghost-btn:hover { color: var(--color-accent-dark); text-decoration: underline; text-underline-offset: 4px; }
.game-card__title { font-size: var(--text-2xl); margin-top: 18px; }
.game-card__prompt {
  margin-top: 14px; font-size: var(--text-base); line-height: 2;
  color: var(--color-text); padding: 18px 20px;
  background: var(--color-bg); border-left: 3px solid var(--color-accent);
  border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
}
.game-card__divider {
  display: flex; align-items: center; gap: 14px; margin: var(--space-5) 0 var(--space-3);
  font-family: var(--font-type); font-size: .64rem; letter-spacing: .1em; color: var(--color-muted);
}
.game-card__divider::after { content: ""; flex: 1; height: 1px; background: var(--color-line); }
.chat-log {
  min-height: 130px; max-height: 250px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 14px; padding: 4px 6px 12px 2px;
  scrollbar-width: thin; scrollbar-color: var(--color-line-strong) transparent;
}
.chat-line { display: flex; gap: 12px; align-items: flex-start; animation: riseIn var(--dur-fast) var(--ease-out) both; }
.chat-line__who {
  flex-shrink: 0; font-family: var(--font-type); font-size: .62rem; letter-spacing: .06em;
  color: var(--color-muted); padding-top: 4px; min-width: 42px;
}
.chat-line p { font-size: var(--text-sm); line-height: 1.8; }
.chat-line--me .chat-line__who { color: var(--color-accent); }
.chat-line--me p { color: var(--color-ink); font-weight: 600; }
.chat-line--host p { color: var(--color-text); }
.chat-verdict {
  display: inline-block; font-family: var(--font-type); font-size: .68rem;
  padding: 1px 8px; margin-right: 6px; border: 1.5px solid currentColor;
  transform: rotate(-3deg); vertical-align: middle;
}
.chat-verdict--yes { color: #4E7A3C; } .chat-verdict--no { color: var(--color-accent); } .chat-verdict--na { color: var(--color-muted); }

.ask-form { display: flex; gap: 10px; margin-top: var(--space-3); }
.ask-form input {
  flex: 1; min-width: 0; min-height: 46px; padding: 10px 14px;
  background: #FFFDF8; border: 1.5px solid var(--color-line-strong); border-radius: var(--radius-sm);
  font-size: var(--text-sm); transition: border-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease;
}
.ask-form input::placeholder { color: #8A7A67; }
.ask-form input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(166, 83, 46, .14); }
.quick-asks { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: var(--space-3); }
.quick-asks :deep(.type-label) { margin-right: 4px; font-size: .62rem; }
.quick-ask {
  background: transparent; border: 1px dashed var(--color-line-strong); border-radius: 99px;
  padding: 10px 14px; min-height: 44px; cursor: pointer;
  font-size: .74rem; color: var(--color-text);
  transition: background var(--dur-fast) ease, border-color var(--dur-fast) ease, color var(--dur-fast) ease;
}
.quick-ask:hover { background: var(--color-accent); border-color: var(--color-accent); color: #FFF9F0; }
.game-card__foot {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  margin-top: var(--space-5); padding-top: var(--space-3); border-top: 1px dashed var(--color-line-strong);
}
.ask-counter { font-family: var(--font-type); font-size: .70rem; color: var(--color-muted); }
.ask-counter b { color: var(--color-accent); font-size: .9rem; }
.reveal-btn {
  background: none; border: 0; cursor: pointer; color: var(--color-accent);
  font-weight: 700; font-size: var(--text-sm); min-height: 44px; padding: 8px 4px;
}
.reveal-btn:hover { color: var(--color-accent-dark); }
.answer-panel {
  margin-top: var(--space-3); padding: 20px 22px;
  background: var(--color-bg-deep); border-left: 3px solid var(--color-seal);
  border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
  animation: riseIn var(--dur-base) var(--ease-out) both;
}
.answer-panel p { margin-top: 10px; font-size: var(--text-sm); line-height: 2; color: var(--color-ink); }

/* ---- 线索提示 ---- */
.hint-zone {
  margin-top: var(--space-4); padding: 20px 22px;
  background: var(--color-bg); border: 1px dashed var(--color-line-strong);
  border-radius: var(--radius-sm);
}
.hint-zone__head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
.hint-count {
  font-family: var(--font-type); font-size: .72rem; letter-spacing: .04em;
  color: var(--color-accent); font-weight: 700;
}
.hint-zone__desc { margin-top: 10px; color: var(--color-muted); font-size: var(--text-sm); line-height: 1.85; }
.hint-btn {
  display: inline-flex; align-items: center; gap: 10px; margin-top: 16px;
  min-height: 46px; padding: 10px 20px; cursor: pointer;
  background: var(--color-ink); color: var(--color-surface);
  border: 1px solid var(--color-ink); border-radius: var(--radius-sm);
  font-size: var(--text-sm); font-weight: 600;
  transition: transform var(--dur-fast) var(--ease-out), background var(--dur-fast) ease;
}
.hint-btn:hover { background: var(--color-accent); border-color: var(--color-accent); transform: translateY(-2px); }
.hint-btn span { color: #E8B48C; }
.hint-btn:hover span { color: #FFF9F0; }
.hint-note { margin-top: 10px; font-family: var(--font-type); font-size: .66rem; color: var(--color-muted); }

/* 线索专用发言：与主持人的三字回答在视觉上严格区分 */
.chat-line--system .chat-line__who { color: var(--color-muted); }
.chat-line--system p { color: var(--color-muted); font-style: italic; font-size: .82rem; }
.chat-line--hint { padding: 10px 14px; background: var(--color-bg-deep); border-left: 3px solid var(--color-accent); border-radius: 0 var(--radius-xs) var(--radius-xs) 0; }
.chat-line--hint .chat-line__who { color: var(--color-accent); }
.chat-line--hint p { color: var(--color-ink); font-size: var(--text-sm); line-height: 1.9; }

/* ---- 推理进度与还原真相 ---- */
.progress-zone {
  margin-top: var(--space-4); padding: 18px 20px;
  background: var(--color-surface-2); border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
}
.progress-zone__head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.progress-zone__pct {
  font-family: var(--font-type); font-size: .95rem; font-weight: 700; color: var(--color-accent);
  font-variant-numeric: tabular-nums;
}
.progress-track {
  height: 7px; margin-top: 12px; border-radius: 99px;
  background: rgba(145, 125, 98, .28); overflow: hidden;
}
.progress-fill {
  display: block; height: 100%; width: 0%; border-radius: 99px;
  background: linear-gradient(90deg, var(--color-accent), #C9834F);
  transition: width var(--dur-slow) var(--ease-out);
}
.progress-zone__note { margin-top: 10px; font-size: .78rem; color: var(--color-muted); line-height: 1.7; }
.restore-btn {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  width: 100%; min-height: 48px; margin-top: 14px;
  background: var(--color-seal); color: #FFF4E8; border: 0; border-radius: var(--radius-sm);
  font-weight: 700; font-size: var(--text-sm); letter-spacing: .05em; cursor: pointer;
  box-shadow: var(--shadow-1);
  animation: riseIn var(--dur-base) var(--ease-out) both;
  transition: transform var(--dur-fast) var(--ease-out), background var(--dur-fast) ease;
}
.restore-btn:hover { background: var(--color-accent); transform: translateY(-2px); }
.restore-btn:disabled { opacity: .7; cursor: default; transform: none; background: #4E7A3C; }
.restore-btn[hidden] { display: none; }

.restore-panel {
  margin-top: var(--space-4); padding: 22px;
  background: var(--color-ink); color: var(--color-dark-text);
  border-radius: var(--radius-sm); box-shadow: var(--shadow-2);
  animation: riseIn var(--dur-base) var(--ease-out) both;
}
.restore-panel :deep(.type-label) { color: #D9A279; }
.restore-panel[hidden] { display: none; }
.restore-panel__intro { margin-top: 10px; font-size: var(--text-sm); line-height: 1.85; color: var(--color-dark-muted); }
.restore-panel textarea {
  width: 100%; margin-top: 16px; padding: 14px 16px; resize: vertical;
  min-height: 130px; background: rgba(255, 252, 245, .06);
  border: 1px solid var(--color-dark-line); border-radius: var(--radius-sm);
  color: var(--color-dark-text); font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.9;
  transition: border-color var(--dur-fast) ease, background var(--dur-fast) ease;
}
.restore-panel textarea::placeholder { color: #9C8A76; }
.restore-panel textarea:focus { outline: none; border-color: #D99562; background: rgba(255, 252, 245, .09); }
.restore-panel__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
.restore-panel__actions :deep(.btn--ghost) { border-color: var(--color-dark-line); color: var(--color-dark-text); }
.restore-panel__actions :deep(.btn--ghost:hover) { border-color: #D99562; color: #D99562; }
.restore-result {
  margin-top: 16px; padding: 14px 16px; border-left: 3px solid currentColor;
  font-size: var(--text-sm); line-height: 1.9;
  animation: riseIn var(--dur-fast) var(--ease-out) both;
}
.restore-result--success { color: #B8D6A4; background: rgba(184, 214, 164, .08); }
.restore-result--fail { color: #E3B48C; background: rgba(227, 180, 140, .08); }
.restore-result[hidden] { display: none; }

@media (max-width: 560px) {
  .game-card { padding: 22px 18px; }
  .game-card__prompt { padding: 14px 16px; }
  .ask-form { flex-direction: column; }
  .ask-form :deep(.btn) { width: 100%; }
  .hint-zone { padding: 16px; }
  .hint-zone__desc { line-height: 1.8; }
  .restore-panel { padding: 16px; }
  .restore-panel__actions :deep(.btn) { flex: 1; }
}
</style>
