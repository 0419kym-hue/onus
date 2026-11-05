'use client';
import { useMemo, useState } from 'react';
import type { ExternalContest } from '@/lib/onus/external-contests';

type Group = 'all' | 'univ' | 'open';
const dayDiff = (today: string, d: string) => Math.round((Date.parse(d) - Date.parse(today)) / 86400000);

export default function ExternalContests({ items, today }: { items: ExternalContest[]; today: string }) {
 const [q, setQ] = useState('');
 const [group, setGroup] = useState<Group>('all');
 const live = useMemo(() => items.filter((x) => x.deadline >= today).sort((a, b) => a.deadline.localeCompare(b.deadline)), [items, today]);
 const list = useMemo(() => {
  const term = q.trim().toLowerCase();
  return live.filter((x) => {
   if (group === 'univ' && !/대학/.test(x.eligibility)) return false;
   if (group === 'open' && !/제한\s?없|누구나|일반인/.test(x.eligibility)) return false;
   return !term || [x.title, x.organizer, x.field, x.eligibility].join(' ').toLowerCase().includes(term);
  });
 }, [live, q, group]);

 return (
  <div>
   <div className="on-filter" role="search">
    <label className="on-search"><span className="on-sr">공모전 검색</span>
     <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="공모전 이름, 분야, 주최로 찾기" />
    </label>
    <div className="on-chips" role="group" aria-label="참가 대상">
     <button type="button" aria-pressed={group === 'all'} onClick={() => setGroup('all')}>전체</button>
     <button type="button" aria-pressed={group === 'univ'} onClick={() => setGroup('univ')}>대학생 명시</button>
     <button type="button" aria-pressed={group === 'open'} onClick={() => setGroup('open')}>제한 없음·일반인 포함</button>
    </div>
   </div>
   <p className="on-count" aria-live="polite">마감이 지나지 않은 {live.length}개 중 {list.length}개 · 마감 임박순</p>
   {list.length === 0 ? <div className="on-empty"><strong>조건에 맞는 공모전이 없어요.</strong></div> : (
    <ul className="on-ext-list">
     {list.map((x) => {
      const d = dayDiff(today, x.deadline);
      return (
       <li key={x.url + x.title} className="on-ext">
        <div className="on-ext-dday" data-soon={d <= 7 ? 'true' : undefined}><strong>{d === 0 ? 'D-DAY' : `D-${d}`}</strong><span>{x.deadline}</span></div>
        <div className="on-ext-body">
         <h3>{x.title}</h3>
         <p>{x.organizer}</p>
         <ul className="on-tags"><li>{x.field}</li><li>대상 · {x.eligibility}</li></ul>
        </div>
        <a className="on-btn" href={x.url} target="_blank" rel="noopener noreferrer">공식 안내 ↗</a>
       </li>
      );
     })}
    </ul>
   )}
  </div>
 );
}
