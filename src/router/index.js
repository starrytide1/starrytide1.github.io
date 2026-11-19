/* ============================================================
   路由表：首页承载完整叙事，各栏目另有可分享的独立地址。
   导航经 history 模式驱动，切换后回到页面顶部。
   ============================================================ */
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import ScriptsPage from '../pages/ScriptsPage.vue';
import NotesPage from '../pages/NotesPage.vue';
import HowPage from '../pages/HowPage.vue';
import ReservePage from '../pages/ReservePage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';

const routes = [
  { path: '/', name: 'home', component: HomePage, meta: { title: '首页' } },
  { path: '/scripts', name: 'scripts', component: ScriptsPage, meta: { title: '剧本杀' } },
  { path: '/notes', name: 'notes', component: NotesPage, meta: { title: '玩家手记' } },
  { path: '/how', name: 'how', component: HowPage, meta: { title: '参与流程' } },
  { path: '/reserve', name: 'reserve', component: ReservePage, meta: { title: '预约夜场' } },
  // 旧栏目地址重定向到首页对应板块，保留既有书签可用性
  { path: '/soup', redirect: '/#soup' },
  { path: '/riddle', redirect: '/#riddle' },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { title: '页面走失了' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' };
    return { top: 0 };
  }
});

router.afterEach((to) => {
  const title = to.meta.title;
  document.title = title && title !== '首页'
    ? `${title} · 子夜档案馆`
    : '子夜档案馆 · 推理剧本社';
});

export default router;
