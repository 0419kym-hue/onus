'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SaveButton from './SaveButton';

type Senior = { slug: string; title: string; contestName: string; award: string; cover?: string; why: string; sameMajor: boolean; duration?: string };
type Pick = {
 title: string; organizer: string; deadline: string; field: string; eligibility: string; url: string; daysLeft: number;
 reason: string; score: number; pace: string; roadmap: { when: string; todo: string }[]; seniors: Senior[];
};
type Result = { summary: string; insight: string; tags: string[]; seniors: Senior[]; picks: Pick[] };

const EXAMPLES = [
 { major: '시각디자인', courses: '타이포그래피, 영상편집 기초, 브랜드 디자인', profile: '숏폼 영상 만드는 걸 좋아해요' },
 { major: '산업디자인', courses: '제품디자인 스튜디오, 3D 모델링, 사용자 경험', profile: 'AI 도구를 써 보고 싶어요' },
 { major: '경영', courses: '마케팅 원론, 창업론, 프레젠테이션', profile: '아이디어 기획과 발표를 잘해요, 팀 공모전이 좋아요' },
];
const STORE = 'onus-ai-profile';
const GRADES = ['', '1학년', '2학년', '3학년', '4학년', '졸업생'];

export default function AiRecommend({ today }: { today: string }) {
 const [major, setMajor] = useState('');
 const [grade, setGrade] = useState('');
 const [courses, setCourses] = useState('');
 const [text, setText] = useState('');
 const [remember, setRemember] = useState(false);
 const [busy, setBusy] = useState(false);
 const [err, setErr] = useState('');
 const [result, setResult] = useState<Result | null>(null);
 const dday = (d: string) => Math.round((Date.parse(d) - Date.parse(today)) / 86400000);
 const filled = (major + courses + text).trim().length >= 5;

 // 이 기기(브라우저)에만 저장합니다. 서버로 보내 저장하지 않아요.
 useEffect(() => {
  try {
   const s = JSON.parse(localStorage.getItem(STORE) ?? 'null');
   if (s) { setMajor(s.major ?? ''); setGrade(s.grade ?? ''); setCourses(s.courses ?? ''); setText(s.text ?? ''); setRemember(true); }
  } catch { /* 저장된 값이 없거나 깨졌으면 무시 */ }
 }, []);

 async function submit(e: React.FormEvent) {
  e.preventDefault();
  if (busy || !filled) return;
  try { if (remember) localStorage.setItem(STORE, JSON.stringify({ major, grade, courses, text })); else localStorage.removeItem(STORE); } catch { /* 저장 불가 환경 */ }
  setBusy(true); setErr(''); setResult(null);
  try {
   const r = await fetch('/api/onus/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ major, grade, courses, profile: text }) });
   const j = await r.json().catch(() => null);
   if (!r.ok || !j?.ok) setErr(j?.error ?? '추천을 불러오지 못했어요.');
   else setResult(j as Result);
  } catch { setErr('네트워크 연결을 확인하고 다시 시도해 주세요.'); }
  setBusy(false);
 }

 return (
  <div className="on-ai">
   <form className="on-ai-form" onSubmit={submit}>
    <p className="on-ai-label"><img className="on-nari on-nari-lg" src="/onus/brand/hywu-nari.webp" alt="한양여대 마스코트 나리" width={52} height={58} />나를 알려 주세요 <span className="on-ai-badge">AI 도우미 나리</span></p>
    <div className="on-ai-grid">
     <label className="on-ai-field"><span>학과·전공</span>
      <input value={major} maxLength={60} onChange={(e) => setMajor(e.target.value)} placeholder="예: 시각디자인" />
     </label>
     <label className="on-ai-field"><span>학년</span>
      <select value={grade} onChange={(e) => setGrade(e.target.value)}>{GRADES.map((g) => <option key={g} value={g}>{g || '선택 안 함'}</option>)}</select>
     </label>
    </div>
    <label className="on-ai-field"><span>수강 중·수강한 수업 <em>시간표를 복사해 붙여넣어도 돼요</em></span>
     <textarea value={courses} maxLength={900} rows={3} onChange={(e) => setCourses(e.target.value)} placeholder="예: 타이포그래피, 영상편집 기초, 브랜드 디자인 (쉼표나 줄바꿈으로 구분)" />
    </label>
    <label className="on-ai-field"><span>하고 싶은 것·관심사</span>
     <textarea value={text} maxLength={500} rows={2} onChange={(e) => setText(e.target.value)} placeholder="원하는 공모전 스타일, 해 본 경험, 팀·개인 선호 등을 편하게 적어 주세요." />
    </label>
    <div className="on-ai-row">
     <div className="on-chips" role="group" aria-label="예시 불러오기">
      {EXAMPLES.map((x) => <button type="button" key={x.major} onClick={() => { setMajor(x.major); setCourses(x.courses); setText(x.profile); }}>예시: {x.major}</button>)}
     </div>
     <button className="on-btn on-btn-primary" type="submit" disabled={busy || !filled}>{busy ? 'AI가 분석하는 중…' : 'AI 맞춤 추천 받기'}</button>
    </div>
    <label className="on-check on-ai-remember"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> 이 기기에 입력 내용 기억하기 (서버에는 저장하지 않아요)</label>
    <p className="on-small">학교 시스템과 연동돼 있지 않아 수업은 직접 적거나 붙여넣어야 해요. 이름·학번·연락처는 적지 마세요.</p>
   </form>

   <div aria-live="polite">
    {err && <p className="on-ai-err" role="alert">{err}</p>}
    {busy && <><p className="on-ai-busy" role="status"><img className="on-nari on-nari-bounce" src="/onus/brand/hywu-nari.webp" alt="" width={40} height={45} />나리가 어울리는 공모전을 찾고 있어요…</p><div className="on-ai-skel" aria-hidden="true"><i /><i /><i /></div></>}
    {result && (
     <div className="on-ai-out">
      <div className="on-ai-sumbox">
       <img className="on-nari on-nari-side" src="/onus/brand/hywu-nari.webp" alt="" width={56} height={63} />
       <p className="on-ai-sum">{result.summary}</p>
       {result.insight && <p className="on-ai-insight"><b>수업에서 읽은 역량</b>{result.insight}</p>}
       {result.tags.length > 0 && <ul className="on-tags">{result.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
      </div>

      {result.seniors.length === 0 && result.tags.length > 0 && (
       <p className="on-small">{result.tags.join('·')} 분야로 수상한 선배 작품은 아직 아카이브에 없어요. 선배가 더 모이면 이 자리에 보여 드릴게요.</p>
      )}

      {result.seniors.length > 0 && (
       <section className="on-ai-seniors" aria-label="닮은 선배의 길">
        <h3>닮은 선배의 길 <span>선배도 이 분야로 수상했어요</span></h3>
        <ul>
         {result.seniors.map((s) => (
          <li key={s.slug}>
           <Link href={`/onus/works/${s.slug}`} className="on-ai-senior">
            {s.cover ? <img src={s.cover} alt="" width={90} height={112} loading="lazy" /> : <span className="on-finder-ph" aria-hidden="true">PDF</span>}
            <span>
             <strong>{s.title}</strong>
             <em>{s.why}</em>
             {s.duration && <b className="on-ai-dur">준비 {s.duration}</b>}
             <i>{s.sameMajor ? '같은 학과라면 너도 해볼 만해요 →' : '같은 분야라면 너도 해볼 만해요 →'}</i>
            </span>
           </Link>
          </li>
         ))}
        </ul>
       </section>
      )}

      {result.picks.length === 0 ? <p className="on-small">지금 접수 중인 공모전 중에 딱 맞는 것을 찾지 못했어요. 학과나 수업을 조금 더 구체적으로 적어 보세요.</p> : (
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
          {p.roadmap.length > 0 && (
           <div className="on-ai-road">
            <b>AI 제안 준비 일정 <em>마감까지 {p.daysLeft}일</em></b>
            {p.pace && <p className="on-ai-pace">{p.pace}</p>}
            <ol>{p.roadmap.map((r, i) => <li key={i}><span>{r.when}</span>{r.todo}</li>)}</ol>
           </div>
          )}
          {p.seniors.length > 0 && (
           <p className="on-ai-pick-seniors">
            {p.seniors.map((s) => <Link key={s.slug} href={`/onus/works/${s.slug}`}>{s.title} · {s.award}</Link>)}
            <span>같은 분야 선배 작품</span>
           </p>
          )}
          <span className="on-soon-meta">대상: {p.eligibility}</span>
          <div className="on-cta"><a className="on-btn on-btn-primary" href={p.url} target="_blank" rel="noopener noreferrer">공식 안내 ↗</a><SaveButton c={{ url: p.url, title: p.title, organizer: p.organizer, deadline: p.deadline }} /></div>
         </li>
        ))}
       </ul>
      )}
      <p className="on-small">AI가 만든 추천이라 틀릴 수 있어요. 준비 일정은 마감일에서 거꾸로 계산한 제안이고, 선배의 실제 소요 기간은 아니에요. 참가 자격과 일정은 공식 안내에서 꼭 다시 확인해 주세요.</p>
     </div>
    )}
   </div>
  </div>
 );
}
