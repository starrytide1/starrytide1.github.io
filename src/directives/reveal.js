/* ============================================================
   全局指令 v-reveal：元素进入视口时补上 .in 触发入场动画
   用法：<section v-reveal> 或 <article v-reveal="90">
   数字为错峰延迟（毫秒）
   ============================================================ */

let observer = null;

function sharedObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  return observer;
}

export default {
  mounted(el, binding) {
    el.classList.add('reveal');
    if (typeof binding.value === 'number') {
      el.style.setProperty('--d', `${binding.value}ms`);
    }
    const ob = sharedObserver();
    if (ob) ob.observe(el);
    else el.classList.add('in');
  },
  unmounted(el) {
    if (observer) observer.unobserve(el);
  }
};
