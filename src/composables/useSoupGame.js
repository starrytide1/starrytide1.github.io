/* ============================================================
   海龟汤游戏状态与规则
   —— 主持人在常规问答中严格只回答「是 / 否 / 与此无关」，
      详细说明只走线索通道；推理进度由「是」命中的关键线索推进。
   ============================================================ */
import { computed, ref } from 'vue';
import { SOUP_LIBRARY } from '../data/soups.js';
import { scrollBehavior, todayIndex } from '../utils/date.js';

export function useSoupGame() {
  const soups = SOUP_LIBRARY;
  const today = todayIndex(soups.length);

  /* ---------- 状态 ---------- */
  const currentIndex = ref(today);
  const currentSoup = computed(() => soups[currentIndex.value]);
  const isToday = computed(() => currentIndex.value === today);

  const chats = ref([]);
  const askCount = ref(0);
  const question = ref('');
  const answerOpen = ref(false);
  const freeHints = ref(3);
  const bonusHints = ref(0);
  const yesRules = ref([]);
  const hitPoints = ref([]);

  const restoreUnlocked = ref(false);
  const restorePassed = ref(false);
  const restoreOpen = ref(false);
  const restoreText = ref('');
  const restoreResult = ref(null); // { type: 'success' | 'fail', text }

  const payOpen = ref(false);
  let lineId = 0;

  /* ---------- 派生数据 ---------- */
  const progress = computed(() => {
    const total = currentSoup.value.keyPoints.length;
    return Math.round((hitPoints.value.length / total) * 100);
  });

  const progressNote = computed(() => (restoreUnlocked.value
    ? '关键线索已经足够——可以开始还原真相了。'
    : '问出关键线索，进度才会推进。'));

  const hintCountText = computed(() => {
    if (freeHints.value > 0) return `剩余 ${freeHints.value} 次免费线索`;
    if (bonusHints.value > 0) return `额外线索剩余 ${bonusHints.value} 条`;
    return '线索已用完';
  });

  const hintNoteText = computed(() => {
    if (freeHints.value > 0) return '三次免费线索用完后，额外线索需付费解锁。';
    if (bonusHints.value > 0) return '额外线索已解锁，用完可再次购买。';
    return '额外线索需付费解锁。';
  });

  /* ---------- 内部方法 ---------- */
  function pushChat(role, text) {
    chats.value.push({ id: ++lineId, role, text });
  }

  // 每个 groups 子组至少命中一个词，全部子组通过才算该要点正确
  function matchesGroups(text, groups) {
    return groups.every(group => group.some(word => text.includes(word)));
  }

  function collectKeyPoints(questionText) {
    currentSoup.value.keyPoints.forEach((point, idx) => {
      if (hitPoints.value.includes(idx)) return;
      if (point.keys.some(key => questionText.includes(key))) {
        hitPoints.value.push(idx);
      }
    });
  }

  /* ---------- 对外操作 ---------- */
  function resetRound() {
    const soup = currentSoup.value;
    askCount.value = 0;
    answerOpen.value = false;
    yesRules.value = [];
    hitPoints.value = [];
    restoreUnlocked.value = false;
    restorePassed.value = false;
    restoreOpen.value = false;
    restoreText.value = '';
    restoreResult.value = null;
    chats.value = [];
    pushChat('system', '本桌规矩：主持人的回答只有「是」「否」「与此无关」三种。');
  }

  function ask(rawQuestion) {
    const q = String(rawQuestion || '').trim();
    if (!q) return;

    askCount.value += 1;
    pushChat('me', q);

    const rules = currentSoup.value.rules;
    const matched = rules.find(rule => rule.keys.some(key => q.includes(key)))
      || { v: '与此无关', keys: [], clue: '' };

    // 主持人只输出三个词本身，不附加任何解释
    pushChat('host', matched.v);

    if (matched.v === '是') {
      if (matched.clue && !yesRules.value.includes(matched)) {
        yesRules.value.push(matched);
      }
      collectKeyPoints(q);
      if (!restoreUnlocked.value && progress.value >= 85 && progress.value <= 100) {
        restoreUnlocked.value = true;
        pushChat('system', '线索已够。你可以尝试还原完整真相了。');
      }
    }
  }

  function submitQuestion() {
    const q = question.value;
    if (!q.trim()) return;
    ask(q);
    question.value = '';
  }

  function toggleAnswer() {
    answerOpen.value = !answerOpen.value;
  }

  function useHint() {
    if (freeHints.value <= 0 && bonusHints.value <= 0) {
      payOpen.value = true;
      return;
    }
    if (!yesRules.value.length) {
      pushChat('system', '还没有「是」的回答可供展开。先问出至少一个「是」吧。');
      return;
    }
    if (freeHints.value > 0) freeHints.value -= 1;
    else bonusHints.value -= 1;

    const pool = yesRules.value;
    const detail = pool[Math.floor(Math.random() * pool.length)].clue;
    pushChat('hint', detail);
  }

  function confirmPay() {
    bonusHints.value += 3;
    payOpen.value = false;
    pushChat('system', '演示支付完成，已解锁 3 条额外线索。本站不产生真实扣费。');
  }

  function openRestore() {
    if (restorePassed.value) return;
    restoreOpen.value = true;
  }

  function cancelRestore() {
    restoreOpen.value = false;
    restoreResult.value = null;
  }

  function judgeRestore() {
    const text = restoreText.value.trim();
    if (!text) {
      restoreResult.value = { type: 'fail', text: '先写下你的还原，哪怕只有几句话。' };
      return;
    }
    const missed = currentSoup.value.answerPoints.filter(point => !matchesGroups(text, point.groups));
    if (!missed.length) {
      restorePassed.value = true;
      restoreResult.value = {
        type: 'success',
        text: '推理成功。你把这条线从头到尾串起来了——这桌的真相，归你。'
      };
      pushChat('system', '推理成功。完整真相已被还原。');
      return;
    }
    const tip = missed[Math.floor(Math.random() * missed.length)].hint;
    restoreResult.value = {
      type: 'fail',
      text: `还差一点。有 ${missed.length} 处关键环节没对上——${tip}`
    };
  }

  function swapSoup() {
    currentIndex.value = (currentIndex.value + 1) % soups.length;
    resetRound();
  }

  function backToToday() {
    currentIndex.value = today;
    resetRound();
  }

  // 首屏卡片需要滚动到答案/还原面板，交给组件处理
  function scrollTo(el) {
    if (el) el.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });
  }

  resetRound();

  return {
    // 数据
    soups,
    currentSoup,
    currentIndex,
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
    // 方法
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
  };
}
