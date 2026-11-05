'use client';
import { useRef } from 'react';

/** 마우스 위치에 따라 카드가 살짝 기우는 3D 틸트 효과(터치·모션 감소 환경에서는 동작하지 않음). */
export default function Tilt({ children }: { children: React.ReactNode }) {
 const ref = useRef<HTMLDivElement>(null);
 const move = (e: React.PointerEvent) => {
  const el = ref.current;
  if (!el || e.pointerType !== 'mouse') return;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.classList.add('is-active');
  el.style.setProperty('--ry', `${x * 14}deg`);
  el.style.setProperty('--rx', `${-y * 14}deg`);
 };
 const leave = () => {
  const el = ref.current;
  if (!el) return;
  el.classList.remove('is-active');
  el.style.setProperty('--ry', '0deg');
  el.style.setProperty('--rx', '0deg');
 };
 return <div ref={ref} className="on-tilt" onPointerMove={move} onPointerLeave={leave}>{children}</div>;
}
