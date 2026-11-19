/* ============================================================
   应用入口：创建 Vue 实例、注册指令与路由、加载全局样式
   ============================================================ */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import reveal from './directives/reveal.js';

/* 全局样式只保留令牌、基础与跨组件共享层；
   各栏目的独有样式已内联到对应组件的 <style scoped> 中。 */
import './assets/styles/tokens.css';
import './assets/styles/base.css';
import './assets/styles/shared.css';

createApp(App)
  .use(router)
  .directive('reveal', reveal)
  .mount('#app');
