'use client';
import { useEffect, useRef } from 'react';

// 스크롤하면 부드럽게 나타나는 효과. 움직임 줄이기 설정이나 스크립트가 없으면 처음부터 보입니다(CSS에서 처리).
export default function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
 const ref = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const el = ref.current;
  if (!el) return;
  if (typeof IntersectionObserver === 'undefined') { el.dataset.in = 'true'; return; }
  const io = new IntersectionObserver((entries) => {
   for (const e of entries) if (e.isIntersecting) { (e.target as HTMLElement).dataset.in = 'true'; io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  io.observe(el);
  return () => io.disconnect();
 }, []);
 return <div ref={ref} className={`on-reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}
