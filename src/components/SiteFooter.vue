<script setup>
/**
 * 页脚：品牌信息、栏目导航与营业时间。
 */
</script>

<template>
  <footer class="site-footer">
    <div class="wrap footer-inner">
      <div class="footer-brand">
        <strong>子夜档案馆</strong>
        <p>一家开在夜里的推理剧本社。<br>灯火与咖啡尚温，真相仍在路上。</p>
        <span class="footer-mark" aria-hidden="true">EST. 2019 · 深夜营业</span>
      </div>
      <nav class="footer-nav" aria-label="页脚导航">
        <div><h3>栏目</h3><router-link to="/">首页</router-link><router-link to="/scripts">剧本杀</router-link><router-link to="/#soup">海龟汤</router-link><router-link to="/#riddle">每日谜题</router-link></div>
        <div><h3>到店</h3><router-link to="/reserve">预约夜场</router-link><router-link to="/how">拼场说明</router-link><router-link to="/notes">玩家手记</router-link></div>
        <div><h3>营业</h3><p>周五 — 周日</p><p>20:00 — 次日 02:00</p><p>旧城区 · 榆树街 7 号</p></div>
      </nav>
    </div>
    <div class="wrap footer-bottom">
      <span>© 2026 子夜档案馆 · MIDNIGHT ARCHIVE</span>
      <span>本页所有剧本与汤面均为虚构，仅供娱乐。</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer { background: var(--color-ink); color: var(--color-dark-text); padding: var(--space-7) 0 var(--space-4); }
.footer-inner { display: grid; grid-template-columns: 1fr 1.3fr; gap: var(--space-6); }
.footer-brand strong { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: -0.02em; }
.footer-brand p { margin-top: 14px; color: var(--color-dark-muted); font-size: var(--text-sm); line-height: 2; }
.footer-mark {
  display: inline-block; margin-top: var(--space-4); font-family: var(--font-type);
  font-size: .66rem; letter-spacing: .12em; color: #D99562; border: 1px solid rgba(217, 149, 98, .5); padding: 5px 10px;
}
.footer-nav { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }
.footer-nav h3 {
  color: #D99562; font-family: var(--font-type); font-size: .7rem; letter-spacing: .12em;
  font-weight: 400; margin-bottom: 16px; text-transform: uppercase;
}
.footer-nav a, .footer-nav p { display: block; color: var(--color-dark-muted); font-size: var(--text-sm); line-height: 2.1; }
.footer-nav a { transition: color var(--dur-fast) ease; }
.footer-nav a:hover { color: var(--color-dark-text); text-decoration: underline; text-underline-offset: 4px; }
.footer-bottom {
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  margin-top: var(--space-6); padding-top: var(--space-4);
  border-top: 1px solid var(--color-dark-line);
  font-family: var(--font-type); font-size: .66rem; letter-spacing: .06em; color: var(--color-dark-muted);
}

@media (max-width: 900px) {
  .footer-inner { grid-template-columns: 1fr; gap: var(--space-5); }
}
@media (max-width: 720px) {
  .footer-nav { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .footer-bottom { flex-direction: column; }
}
</style>
