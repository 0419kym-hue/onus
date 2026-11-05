'use client';
import { useEffect, useRef, useState } from 'react';

/** 화면에 보이면 0에서 목표 숫자까지 올라가는 카운터. 모션 감소 설정이면 바로 최종 값을 보여 줍니다. */
export default function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
 const ref = useRef<HTMLSpanElement>(null);
 const [n, setN] = useState(to);
 useEffect(() => {
  const el = ref.current;
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
  let raf = 0;
  const io = new IntersectionObserver(([e]) => {
   if (!e.isIntersecting) return;
   io.disconnect();
   const t0 = performance.now();
   const dur = 1100;
   const tick = (t: number) => {
    const p = Math.min((t - t0) / dur, 1);
    setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) raf = requestAnimationFrame(tick);
   };
   setN(0);
   raf = requestAnimationFrame(tick);
  }, { threshold: 0.4 });
  io.observe(el);
  return () => { io.disconnect(); cancelAnimationFrame(raf); };
 }, [to]);
 return <span ref={ref} aria-label={`${to}${suffix}`}>{n}{suffix}</span>;
}
