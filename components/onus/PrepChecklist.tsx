'use client';
import { useEffect, useState } from 'react';

/** 대회별 출품 준비 체크리스트(규칙 기반, AI 아님). 대회 정보의 "확인할 점"과 규격 항목을 체크하며 진행률을 보여 주고, 체크 상태는 이 기기(브라우저)에만 저장합니다. */
export default function PrepChecklist({ slug, items, typical }: { slug: string; items: string[]; typical?: string }) {
 const key = `onus-prep-${slug}`;
 const [done, setDone] = useState<string[]>([]);
 useEffect(() => {
  try { const s = JSON.parse(localStorage.getItem(key) ?? '[]'); if (Array.isArray(s)) setDone(s.filter((x) => typeof x === 'string')); } catch { /* 저장된 값이 없거나 깨졌으면 무시 */ }
 }, [key]);
 const toggle = (t: string) => {
  const next = done.includes(t) ? done.filter((x) => x !== t) : [...done, t];
  setDone(next);
  try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* 저장 불가 환경 */ }
 };
 const n = items.filter((t) => done.includes(t)).length;
 const pct = items.length ? Math.round((n / items.length) * 100) : 0;
 return (
  <div className="on-prep">
   <div className="on-prep-head">
    <strong>{n}/{items.length} 완료</strong>
    <span className="on-prep-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="준비 진행률"><i style={{ width: `${pct}%` }} /></span>
    {typical && <em>선배는 보통 {typical} 준비했어요</em>}
   </div>
   <ul>
    {items.map((t) => (
     <li key={t}>
      <label className="on-check"><input type="checkbox" checked={done.includes(t)} onChange={() => toggle(t)} /><span data-done={done.includes(t) ? 'true' : undefined}>{t}</span></label>
     </li>
    ))}
   </ul>
   <p className="on-small">체크 상태는 이 기기에만 저장돼요. 항목은 공식 요강을 대신하지 않으니 마감 전에 원문을 다시 확인해 주세요.</p>
  </div>
 );
}
