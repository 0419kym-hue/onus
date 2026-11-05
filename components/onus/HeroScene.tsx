'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false });

/** 3D 장면을 브라우저에서만 불러옵니다. 모션 감소 설정이거나 WebGL을 쓸 수 없으면 그라디언트 배경만 보여 줍니다. */
export default function HeroScene() {
 const [mode, setMode] = useState<'off' | 'light' | 'full'>('off');
 useEffect(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gl = false;
  try { gl = !!document.createElement('canvas').getContext('webgl2'); } catch { gl = false; }
  if (reduce || !gl) return;
  const mobile = window.matchMedia('(max-width: 800px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4;
  setMode(mobile ? 'light' : 'full');
 }, []);
 if (mode === 'off') return null;
 return <div className="on-hero3d-canvas" aria-hidden="true"><Hero3D light={mode === 'light'} /></div>;
}
