export const clamp01 = n => Math.min(1, Math.max(0, n));

// 0 when the element's top reaches a line at `line` × viewport height, 1 when its bottom does.
export function progressAt(el, line) {
  const r = el.getBoundingClientRect();
  return clamp01((innerHeight * line - r.top) / r.height);
}
