'use client';
import Link from 'next/link';
import { downloadIcs, removeFromBoard, STEPS, toggleStep, useBoard } from '@/lib/onus/board';

const todayKST = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
const dayDiff = (today: string, d: string) => Math.round((Date.parse(d) - Date.parse(today)) / 86400000);

export default function BoardView() {
 const { items, ready } = useBoard();
 if (!ready) return <p className="on-small">불러오는 중…</p>;
 const today = todayKST();
 const sorted = [...items].sort((a, b) => a.deadline.localeCompare(b.deadline));
 const upcoming = sorted.find((x) => x.deadline >= today);

 if (items.length === 0) {
  return (
   <div className="on-empty">
    <strong>아직 담은 공모전이 없어요.</strong>
    <p>공모전 모음에서 &ldquo;도전 보드에 담기&rdquo;를 누르면 마감일과 준비 단계를 여기서 챙길 수 있어요.</p>
    <p><Link className="on-btn on-btn-primary" href="/onus/contests">공모전 보러 가기</Link></p>
   </div>
  );
 }

 return (
  <div>
   {upcoming && (
    <div className="on-board-next">
     <span>가장 가까운 마감</span>
     <strong>D-{dayDiff(today, upcoming.deadline) || 'DAY'}</strong>
     <p>{upcoming.title}</p>
    </div>
   )}
   <ul className="on-board-list">
    {sorted.map((x) => {
     const d = dayDiff(today, x.deadline);
     const done = x.steps.filter(Boolean).length;
     const expired = d < 0;
     return (
      <li key={x.id} className={expired ? 'on-board-item on-board-expired' : 'on-board-item'}>
       <div className="on-board-top">
        <span className="on-soon-d" data-soon={!expired && d <= 7 ? 'true' : undefined}>{expired ? '마감 지남' : d === 0 ? 'D-DAY' : `D-${d}`}</span>
        <span className="on-small-inline">{x.deadline.replaceAll('-', '.')} 마감</span>
       </div>
       <h3>{x.title}</h3>
       <p className="on-board-org">{x.organizer}</p>
       <div className="on-progress" role="progressbar" aria-valuemin={0} aria-valuemax={STEPS.length} aria-valuenow={done} aria-label="준비 진행도"><span style={{ width: `${(done / STEPS.length) * 100}%` }} /></div>
       <ul className="on-steps">
        {STEPS.map((s, i) => (
         <li key={s}><label><input type="checkbox" checked={Boolean(x.steps[i])} onChange={() => toggleStep(x.id, i)} /> {s}</label></li>
        ))}
       </ul>
       <div className="on-cta">
        <a className="on-btn" href={x.url} target="_blank" rel="noopener noreferrer">공식 안내 ↗</a>
        {!expired && <button type="button" className="on-btn" onClick={() => downloadIcs(x)}>캘린더에 넣기 (.ics)</button>}
        <button type="button" className="on-btn" onClick={() => removeFromBoard(x.id)}>보드에서 빼기</button>
       </div>
      </li>
     );
    })}
   </ul>
   <p className="on-small">이 보드는 <strong>이 브라우저에만 저장</strong>돼요. 개인정보를 받지 않고, 다른 기기와는 공유되지 않아요. 캘린더 파일은 마감일 종일 일정과 3일 전 알림이 들어 있어요.</p>
  </div>
 );
}
