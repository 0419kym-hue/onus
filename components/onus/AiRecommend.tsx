'use client';
import { useState } from 'react';
import SaveButton from './SaveButton';

type Pick = { title: string; organizer: string; deadline: string; field: string; eligibility: string; url: string; reason: string; score: number };
type Result = { summary: string; picks: Pick[] };

const EXAMPLES = ['영상 편집이 좋고 숏폼 제작 경험이 있어요', '제품 디자인 전공이고 AI 도구를 써 보고 싶어요', '아이디어 기획과 발표를 잘해요, 팀 공모전이 좋아요'];

export default function AiRecommend({ today }: { today: string }) {
 const [text, setText] = useState('');
 const [busy, setBusy] = useState(false);
 const [err, setErr] = useState('');
 const [result, setResult] = useState<Result | null>(null);
 const dday = (d: string) => Math.round((Date.parse(d) - Date.parse(today)) / 86400000);

 async function submit(e: React.FormEvent) {
  e.preventDefault();
  if (busy) return;
  setBusy(true); setErr(''); setResult(null);
  try {
   const r = await fetch('/api/onus/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile: text }) });
   const j = await r.json().catch(() => null);
   if (!r.ok || !j?.ok) setErr(j?.error ?? '추천을 불러오지 못했어요.');
   else setResult({ summary: j.summary, picks: j.picks });
  } catch { setErr('네트워크 연결을 확인하고 다시 시도해 주세요.'); }
  setBusy(false);
 }

 return (
  <div className="on-ai">
   <form className="on-ai-form" onSubmit={submit}>
    <label htmlFor="on-ai-text" className="on-ai-label"><span className="on-ai-spark" aria-hidden="true">✦</span>나를 소개해 주세요</label>
    <textarea id="on-ai-text" value={text} maxLength={500} rows={3} onChange={(e) => setText(e.target.value)} placeholder="전공, 관심 분야, 해 본 경험, 원하는 공모전 스타일을 편하게 적어 주세요." />
    <div className="on-ai-row">
     <div className="on-chips" role="group" aria-label="예시 문장">
      {EXAMPLES.map((x) => <button type="button" key={x} onClick={() => setText(x)}>{x}</button>)}
     </div>
     <button className="on-btn on-btn-primary" type="submit" disabled={busy || text.trim().length < 5}>{busy ? 'AI가 찾는 중…' : 'AI 맞춤 추천 받기'}</button>
    </div>
    <p className="on-small">입력한 내용은 추천을 만드는 데에만 쓰이고 저장되지 않아요. 개인정보(이름·연락처)는 적지 마세요.</p>
   </form>

   <div aria-live="polite">
    {err && <p className="on-ai-err" role="alert">{err}</p>}
    {busy && <div className="on-ai-skel" aria-hidden="true"><i /><i /><i /></div>}
    {result && (
     <div className="on-ai-out">
      <p className="on-ai-sum">{result.summary}</p>
      {result.picks.length === 0 ? <p className="on-small">지금 접수 중인 공모전 중에 딱 맞는 것을 찾지 못했어요. 소개를 조금 더 구체적으로 적어 보세요.</p> : (
       <ul className="on-ai-list">
        {result.picks.map((p) => (
         <li key={p.url + p.title} className="on-ai-card">
          <div className="on-ai-top">
           <span className="on-ai-score" aria-label={`적합도 ${p.score}점`}><b>{p.score}</b>%</span>
           <span className="on-soon-d" data-soon={dday(p.deadline) <= 7 ? 'true' : undefined}>{dday(p.deadline) === 0 ? 'D-DAY' : `D-${dday(p.deadline)}`}</span>
          </div>
          <strong>{p.title}</strong>
          <span className="on-soon-meta">{p.organizer} · {p.field}</span>
          <p className="on-ai-reason">{p.reason}</p>
          <span className="on-soon-meta">대상: {p.eligibility}</span>
          <div className="on-cta"><a className="on-btn on-btn-primary" href={p.url} target="_blank" rel="noopener noreferrer">공식 안내 ↗</a><SaveButton c={{ url: p.url, title: p.title, organizer: p.organizer, deadline: p.deadline }} /></div>
         </li>
        ))}
       </ul>
      )}
      <p className="on-small">AI가 만든 추천이라 틀릴 수 있어요. 참가 자격과 일정은 공식 안내에서 꼭 다시 확인해 주세요.</p>
     </div>
    )}
   </div>
  </div>
 );
}
