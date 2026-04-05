import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(end: number, duration = 1200, decimals = 0) {
  const [value, setValue] = useState(0);
  const prevEnd = useRef(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const start = prevEnd.current;
    prevEnd.current = end;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setValue(current);
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    }

    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [end, duration]);

  if (decimals === 0) return Math.round(value);
  return parseFloat(value.toFixed(decimals));
}
