/* ============================================================
   日期工具：以本地日期为种子，同一天任何时刻索引都稳定
   ============================================================ */

/** 距 1970-01-01 的天数（按本地日历日，避免时区偏移） */
export function dayNumber() {
  const d = new Date();
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}

/** 当日应展示的索引 */
export function todayIndex(length) {
  return length > 0 ? dayNumber() % length : 0;
}

/** 当日日期标签，例如 11/19 */
export function todayLabel() {
  const d = new Date();
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** 优先尊重「减少动效」偏好，供 scrollIntoView 使用 */
export function scrollBehavior() {
  const reduced = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return reduced ? 'auto' : 'smooth';
}
