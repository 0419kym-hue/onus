'use client';
import { useEffect, useRef } from 'react';

/**
 * 한양여대 마스코트 한 명을 입체처럼 보여 주는 장식입니다.
 * 같은 이미지를 깊이 방향으로 겹쳐 두께를 만들고(CSS 3D), 떠서 흔들리다가 마우스·터치를 따라 기웁니다.
 * 움직임 줄이기 설정을 켠 사용자에게는 고정된 이미지로 보여 줍니다.
 */
export default function Mascot3D({ src, alt, width, height, className = '', layers = 8, style, dur = 5.5, delay = 0, sway = 1 }: {
 src: string; alt: string; width: number; height: number; className?: string; layers?: number; style?: React.CSSProperties; dur?: number; delay?: number; sway?: number;
}) {
 const tilt = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const el = tilt.current;
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = 0;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  const move = (e: PointerEvent) => {
   tx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 ~ 1
   ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  const tick = () => {
   cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07; // 부드럽게 따라가기
   el.style.transform = `rotateY(${(cx * 26 * sway).toFixed(2)}deg) rotateX(${(-cy * 16 * sway).toFixed(2)}deg)`;
   raf = requestAnimationFrame(tick);
  };
  window.addEventListener('pointermove', move, { passive: true });
  raf = requestAnimationFrame(tick);
  return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
 }, [sway]);

 return (
  <div className={`on-m3d ${className}`} role="img" aria-label={alt} style={style}>
   <div className="on-m3d-float" style={{ animationDuration: `${dur}s`, animationDelay: `${-delay}s` }}>
    <div className="on-m3d-tilt" ref={tilt}>
     {Array.from({ length: layers }, (_, i) => {
      const back = layers - 1 - i; // 0 = 맨 앞
      return <img key={i} className={back === 0 ? 'on-m3d-front' : 'on-m3d-back'} src={src} alt="" width={width} height={height} draggable={false} aria-hidden="true" style={{ transform: `translateZ(${-back * 3}px)` }} />;
     })}
    </div>
   </div>
   <span className="on-m3d-shadow" aria-hidden="true" style={{ animationDuration: `${dur}s`, animationDelay: `${-delay}s` }} />
  </div>
 );
}
