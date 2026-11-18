/* ============================================================
   MAIN — 交互逻辑
   滚动入场 / 移动导航 / 海龟汤主持人 / 线索与付费解锁 / 谜题翻牌 / 预约反馈
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 滚动入场 ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 2. 移动端导航 ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var open = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ---------- 3. 海龟汤主持人 ---------- */
  /*
   * 规则约束：常规问答中，主持人的每一句回答严格等于
   * 「是」/「否」/「与此无关」三者之一，不附加任何解释。
   * 详细说明只通过「线索提示」通道给出（chat-line--hint）。
   */
  var soups = window.SOUP_LIBRARY || [];
  if (!soups.length) {
    console.warn('[子夜档案馆] 汤库未加载，海龟汤功能不可用。');
  }

  // 以本地日期为种子：同一天任何时刻打开都是同一碗，次日自动更换
  function dayNumber() {
    var d = new Date();
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  }
  var todayIndex = soups.length ? dayNumber() % soups.length : 0;
  var currentSoup = todayIndex;

  var askCount = 0;
  var askCount = 0;
  var freeHints = 3;      // 免费线索：整场共 3 次
  var bonusHints = 0;     // 付费解锁的额外线索
  var yesRules = [];      // 本局得到过的「是」，线索从这里随机抽取
  var hitPoints = [];     // 本局命中的关键线索索引
  var restoreUnlocked = false;
  var restorePassed = false;

  var chatLog = document.getElementById('chatLog');
  var askForm = document.getElementById('askForm');
  var askInput = document.getElementById('askInput');
  var quickAsks = document.getElementById('quickAsks');
  var answerPanel = document.getElementById('answerPanel');
  var answerText = document.getElementById('answerText');
  var revealBtn = document.getElementById('revealBtn');
  var askCountEl = document.getElementById('askCount');
  var hintBtn = document.getElementById('hintBtn');
  var hintCountEl = document.getElementById('hintCount');
  var hintNoteEl = document.getElementById('hintNote');
  var payModal = document.getElementById('payModal');
  var demoPay = document.getElementById('demoPay');
  var closePay = document.getElementById('closePay');
  var payBackdrop = document.getElementById('payBackdrop');
  var progressPct = document.getElementById('progressPct');
  var progressFill = document.getElementById('progressFill');
  var progressBar = document.getElementById('progressBar');
  var progressNote = document.getElementById('progressNote');
  var restoreBtn = document.getElementById('restoreBtn');
  var restorePanel = document.getElementById('restorePanel');
  var restoreInput = document.getElementById('restoreInput');
  var submitRestore = document.getElementById('submitRestore');
  var cancelRestore = document.getElementById('cancelRestore');
  var restoreResult = document.getElementById('restoreResult');

  function verdictClass(v) {
    return v === '是' ? 'yes' : (v === '否' ? 'no' : 'na');
  }

  function addChatLine(role, text, verdict) {
    var line = document.createElement('div');
    line.className = 'chat-line chat-line--' + role;

    var whoEl = document.createElement('span');
    whoEl.className = 'chat-line__who';
    whoEl.textContent = role === 'me' ? '提问者'
      : role === 'hint' ? '主持人 · 线索'
      : role === 'system' ? '馆规' : '主持人';

    var p = document.createElement('p');
    if (verdict) {
      var v = document.createElement('span');
      v.className = 'chat-verdict chat-verdict--' + verdictClass(verdict);
      v.textContent = verdict;
      p.appendChild(v);
    }
    p.appendChild(document.createTextNode(text));

    line.appendChild(whoEl);
    line.appendChild(p);
    chatLog.appendChild(line);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function updateHintUI() {
    if (freeHints > 0) {
      hintCountEl.textContent = '剩余 ' + freeHints + ' 次免费线索';
      hintNoteEl.textContent = '三次免费线索用完后，额外线索需付费解锁。';
    } else if (bonusHints > 0) {
      hintCountEl.textContent = '额外线索剩余 ' + bonusHints + ' 条';
      hintNoteEl.textContent = '额外线索已解锁，用完可再次购买。';
    } else {
      hintCountEl.textContent = '线索已用完';
      hintNoteEl.textContent = '额外线索需付费解锁。';
    }
  }

  // 首屏卡片与当日汤谱同步
  function renderHeroSoup() {
    if (!soups.length) return;
    var soup = soups[todayIndex];
    var snippet = soup.prompt.length > 26 ? soup.prompt.slice(0, 26) + '……' : soup.prompt;
    document.getElementById('heroSoupPrompt').textContent = snippet;
    document.getElementById('heroSoupMeta').textContent = soup.id + ' · 每日更新';
    var d = new Date();
    document.getElementById('heroSoupLabel').textContent = '今日海龟汤 · ' + (d.getMonth() + 1) + '/' + d.getDate();
  }

  // 答案要点比对：每个 groups 子组至少命中一个词，全部子组通过才算该要点正确
  function matchesGroups(text, groups) {
    return groups.every(function (group) {
      return group.some(function (word) { return text.indexOf(word) !== -1; });
    });
  }

  function updateProgress() {
    var soup = soups[currentSoup];
    var pct = Math.round((hitPoints.length / soup.keyPoints.length) * 100);
    progressPct.textContent = pct + '%';
    progressFill.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', String(pct));

    var unlocked = pct >= 85 && pct <= 100;
    if (unlocked && !restoreUnlocked) {
      restoreUnlocked = true;
      restoreBtn.hidden = false;
      progressNote.textContent = '关键线索已经足够——可以开始还原真相了。';
      addChatLine('system', '线索已够。你可以尝试还原完整真相了。');
    } else if (!unlocked) {
      progressNote.textContent = '问出关键线索，进度才会推进。';
    }
  }

  function collectKeyPoints(question) {
    soups[currentSoup].keyPoints.forEach(function (point, idx) {
      if (hitPoints.indexOf(idx) !== -1) return;
      if (point.keys.some(function (k) { return question.indexOf(k) !== -1; })) {
        hitPoints.push(idx);
      }
    });
  }

  function judgeRestore() {
    var text = restoreInput.value.trim();
    if (!text) {
      restoreResult.hidden = false;
      restoreResult.className = 'restore-result restore-result--fail';
      restoreResult.textContent = '先写下你的还原，哪怕只有几句话。';
      restoreInput.focus();
      return;
    }
    var missed = soups[currentSoup].answerPoints.filter(function (point) {
      return !matchesGroups(text, point.groups);
    });
    restoreResult.hidden = false;
    if (!missed.length) {
      restorePassed = true;
      restoreResult.className = 'restore-result restore-result--success';
      restoreResult.textContent = '推理成功。你把这条线从头到尾串起来了——这桌的真相，归你。';
      restoreBtn.textContent = '推理成功 ✓';
      restoreBtn.disabled = true;
      addChatLine('system', '推理成功。完整真相已被还原。');
    } else {
      restoreResult.className = 'restore-result restore-result--fail';
      var tip = missed[Math.floor(Math.random() * missed.length)].hint;
      restoreResult.textContent = '还差一点。有 ' + missed.length + ' 处关键环节没对上——' + tip;
    }
  }

  function renderSoup(index) {
    if (!soups.length) return;
    var soup = soups[index];
    document.getElementById('soupId').textContent = soup.id + (index === todayIndex ? ' · 今日' : ' · 往期');
    document.getElementById('soupTitle').textContent = soup.title;
    document.getElementById('soupPrompt').textContent = soup.prompt;
    answerText.textContent = soup.answer;
    answerPanel.hidden = true;
    revealBtn.setAttribute('aria-expanded', 'false');
    revealBtn.textContent = '掀开汤底 ▾';
    askCount = 0;
    askCountEl.textContent = '0';
    yesRules = [];
    hitPoints = [];
    restoreUnlocked = false;
    restorePassed = false;
    restoreBtn.hidden = true;
    restoreBtn.disabled = false;
    restoreBtn.innerHTML = '开始还原 <span aria-hidden="true">→</span>';
    restorePanel.hidden = true;
    restoreResult.hidden = true;
    restoreInput.value = '';
    chatLog.textContent = '';
    addChatLine('system', '本桌规矩：主持人的回答只有「是」「否」「与此无关」三种。');
    updateProgress();

    quickAsks.querySelectorAll('.quick-ask').forEach(function (b) { b.remove(); });
    soup.quick.forEach(function (q) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quick-ask';
      btn.textContent = q;
      btn.addEventListener('click', function () { ask(q); });
      quickAsks.appendChild(btn);
    });
    updateHintUI();
  }

  function ask(question) {
    var q = String(question || '').trim();
    if (!q) return;

    askCount += 1;
    askCountEl.textContent = String(askCount);
    addChatLine('me', q);

    var soup = soups[currentSoup];
    var matched = null;
    for (var i = 0; i < soup.rules.length; i += 1) {
      var rule = soup.rules[i];
      var hit = rule.keys.some(function (key) { return q.indexOf(key) !== -1; });
      if (hit) { matched = rule; break; }
    }
    if (!matched) matched = { v: '与此无关' };

    // 主持人只输出三个词本身，不附加任何解释
    addChatLine('host', matched.v);
    if (matched.v === '是') {
      if (matched.clue && yesRules.indexOf(matched) === -1) yesRules.push(matched);
      collectKeyPoints(q);
      updateProgress();
    }
  }

  function useHint() {
    if (freeHints <= 0 && bonusHints <= 0) {
      openPayModal();
      return;
    }
    if (!yesRules.length) {
      addChatLine('system', '还没有「是」的回答可供展开。先问出至少一个「是」吧。');
      return;
    }
    if (freeHints > 0) freeHints -= 1;
    else bonusHints -= 1;

    var detail = yesRules[Math.floor(Math.random() * yesRules.length)].clue;
    addChatLine('hint', detail);
    updateHintUI();
  }

  /* ---------- 4. 付费解锁弹层（演示站点：模拟支付） ---------- */
  function openPayModal() {
    payModal.hidden = false;
    demoPay.focus();
  }
  function closePayModal() {
    payModal.hidden = true;
    hintBtn.focus();
  }

  if (askForm && chatLog) {
    askForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = askInput.value;
      ask(val);
      askInput.value = '';
      askInput.focus();
    });
    revealBtn.addEventListener('click', function () {
      var willOpen = answerPanel.hidden;
      answerPanel.hidden = !willOpen;
      revealBtn.setAttribute('aria-expanded', String(willOpen));
      revealBtn.textContent = willOpen ? '收起汤底 ▴' : '掀开汤底 ▾';
      if (willOpen) {
        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        answerPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
    document.getElementById('swapSoup').addEventListener('click', function () {
      if (!soups.length) return;
      currentSoup = (currentSoup + 1) % soups.length;
      renderSoup(currentSoup);
    });
    document.getElementById('todaySoup').addEventListener('click', function () {
      currentSoup = todayIndex;
      renderSoup(currentSoup);
    });
    renderHeroSoup();

    restoreBtn.addEventListener('click', function () {
      if (restorePassed) return;
      restorePanel.hidden = false;
      restoreInput.focus();
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      restorePanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
    cancelRestore.addEventListener('click', function () {
      restorePanel.hidden = true;
      restoreResult.hidden = true;
      restoreBtn.focus();
    });
    submitRestore.addEventListener('click', judgeRestore);

    hintBtn.addEventListener('click', useHint);
    closePay.addEventListener('click', closePayModal);
    payBackdrop.addEventListener('click', closePayModal);
    payModal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePayModal();
      if (e.key === 'Tab') {
        var focusables = [demoPay, closePay];
        var idx = focusables.indexOf(document.activeElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          focusables[focusables.length - 1].focus();
        } else if (!e.shiftKey && idx === focusables.length - 1) {
          e.preventDefault();
          focusables[0].focus();
        }
      }
    });
    demoPay.addEventListener('click', function () {
      bonusHints += 3;
      updateHintUI();
      closePayModal();
      addChatLine('system', '演示支付完成，已解锁 3 条额外线索。本站不产生真实扣费。');
    });

    renderSoup(currentSoup);
  }

  /* ---------- 5. 每日谜题：按日期换题 ---------- */
  var riddles = [
    { id: '0527', q: '什么东西<br>有头没有脚，<br>有床没有被？', a: '河 流', n: '河有源头、有河床，却从来没有脚，也没有被子。今天你怀疑了吗？' },
    { id: '0528', q: '什么东西<br>越洗越脏？', a: '水', n: '洗东西的是水，变脏的也是水。' },
    { id: '0529', q: '什么门<br>永远关不上？', a: '球 门', n: '因为它存在的意义，就是让人往里踢。' },
    { id: '0530', q: '什么东西<br>有牙不能咬人？', a: '梳 子', n: '它每天与头发为伴，却从不开口。' },
    { id: '0531', q: '什么布<br>剪不断？', a: '瀑 布', n: '你剪的那一刀，只会让水更欢快地流下去。' },
    { id: '0532', q: '什么东西<br>人人都有，<br>别人用得比你多？', a: '名 字', n: '你写出来一次，别人要叫你很多次。' },
    { id: '0533', q: '什么山<br>没有石头？', a: '冰 山', n: '它漂浮着，露出水面的只是很小一部分。' },
    { id: '0534', q: '什么马<br>不会跑？', a: '木 马', n: '它只在游乐场里转圈，从不去任何地方。' },
    { id: '0535', q: '什么东西<br>越热越爱出来？', a: '汗', n: '天气一热，它就藏不住了。' },
    { id: '0536', q: '什么车<br>寸步难行？', a: '风 车', n: '它一整天都在原地打转，靠风活着。' },
    { id: '0537', q: '什么书<br>买不到？', a: '秘 书', n: '这位「书」要打招呼、排日程，还得会泡咖啡。' },
    { id: '0538', q: '什么鱼<br>不能吃？', a: '木 鱼', n: '敲一敲会响，但永远不入味。' },
    { id: '0539', q: '什么楼<br>不能住人？', a: '牌 楼', n: '它只有好看的门面，里面空空如也。' },
    { id: '0540', q: '什么东西<br>越分越多？', a: '快 乐', n: '你分给别人一份，自己不会少，对方还多一份。' }
  ];
  var puzzleEl = document.getElementById('puzzleId');
  if (puzzleEl) {
    var riddle = riddles[dayNumber() % riddles.length];
    puzzleEl.textContent = 'PUZZLE No. ' + riddle.id + ' · 每日更新';
    document.getElementById('puzzleQuestion').innerHTML = riddle.q;
    document.getElementById('puzzleAnswer').textContent = riddle.a;
    document.getElementById('puzzleNote').textContent = riddle.n;
  }

  /* ---------- 6. 每日谜题翻牌交互 ---------- */
  var flipCard = document.getElementById('flipCard');
  var flipBtn = document.getElementById('flipBtn');
  var flipBack = document.getElementById('flipBack');
  if (flipCard) {
    flipBtn.addEventListener('click', function () {
      flipCard.classList.add('is-flipped');
      flipBack.focus();
    });
    flipBack.addEventListener('click', function () {
      flipCard.classList.remove('is-flipped');
      flipBtn.focus();
    });
  }

  /* ---------- 7. 预约表单 ---------- */
  var reserveForm = document.getElementById('reserveForm');
  if (reserveForm) {
    reserveForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('reserveEmail');
      var msg = document.getElementById('reserveMsg');
      var value = input.value.trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!valid) {
        input.setAttribute('aria-invalid', 'true');
        msg.textContent = '请留下一个有效的邮箱地址，我们才好给你寄谜题。';
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      msg.textContent = '座位记下了。周五见——记得带一个相信你的人。';
      input.value = '';
    });
  }

  /* ---------- 8. 当前栏目高亮 ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.primary-nav > a:not(.nav-cta)'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var active = a.getAttribute('href') === '#' + entry.target.id;
          a.style.color = active ? 'var(--color-accent)' : '';
          if (active) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }
})();
