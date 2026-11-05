'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import SaveButton from './SaveButton';

// 관심 분야를 고르면 키워드가 겹치는 "접수 중인 공모전"과 "선배 작품"을 보여 줍니다. (AI가 아니라 키워드 일치 규칙 기반)
const GROUPS = [
 { key: 'space', label: '건축·공간', kw: ['건축', '공간', '도시', '수변', '환경', '조경'] },
 { key: 'product', label: '제품·시스템', kw: ['제품', '시스템', '모빌리티', '유니버설', '앱', 'IT'] },
 { key: 'visual', label: '영상·콘텐츠', kw: ['영상', '콘텐츠', '숏폼', '미디어', '웹툰', '캐릭터', '디카시', '광고'] },
 { key: 'ai', label: 'AI·데이터', kw: ['AI', '데이터', '게임'] },
 { key: 'idea', label: '아이디어·기획', kw: ['아이디어', '창업', '공공', '네이밍', '논문', '마케팅'] },
 { key: 'color', label: '색채·조형', kw: ['색채', '조형', '파빌리온', '미술', '공예'] },
] as const;

export type FinderContest = { url: string; title: string; organizer: string; deadline: string; field: string };
export type FinderWork = { slug: string; title: string; subtitle?: string; fields: string[]; award: string; rank: number; cover?: string; contestName: string };

const score = (text: string, keys: readonly string[]) => keys.reduce((n, k) => (text.toLowerCase().includes(k.toLowerCase()) ? n + 1 : n), 0);

export default function ChallengeFinder({ contests, works, today }: { contests: FinderContest[]; works: FinderWork[]; today: string }) {
 const [picked, setPicked] = useState<string[]>([]);
 const keys = useMemo(() => GROUPS.filter((g) => picked.includes(g.key)).flatMap((g) => g.kw), [picked]);
 const dday = (d: string) => Math.round((Date.parse(d) - Date.parse(today)) / 86400000);

 const hitContests = useMemo(() => keys.length === 0 ? [] : contests
  .map((c) => ({ c, s: score(`${c.title} ${c.field}`, keys) })).filter((x) => x.s > 0)
  .sort((a, b) => a.c.deadline.localeCompare(b.c.deadline)).slice(0, 3).map((x) => x.c), [contests, keys]);
 const hitWorks = useMemo(() => keys.length === 0 ? [] : works
  .map((w) => ({ w, s: score(`${w.fields.join(' ')} ${w.subtitle ?? ''} ${w.title}`, keys) })).filter((x) => x.s > 0)
  .sort((a, b) => b.s - a.s || b.w.rank - a.w.rank).slice(0, 3).map((x) => x.w), [works, keys]);

 const toggle = (k: string) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

 return (
  <div className="on-finder">
   <div className="on-chips on-finder-chips" role="group" aria-label="관심 분야">
    {GROUPS.map((g) => <button type="button" key={g.key} aria-pressed={picked.includes(g.key)} onClick={() => toggle(g.key)}>{g.label}</button>)}
   </div>

   {picked.length === 0 ? (
    <p className="on-finder-hint">끌리는 분야를 하나 이상 골라 보세요. 지금 접수 중인 공모전과 같은 분야의 선배 작품을 바로 보여 드려요.</p>
   ) : (
    <div className="on-finder-out">
     <div>
      <h3>지금 도전해 볼 공모전</h3>
      {hitContests.length === 0 ? <p className="on-small">지금 접수 중인 공모전 중에는 맞는 게 없어요.</p> : (
       <ul className="on-finder-list">
        {hitContests.map((c) => (
         <li key={c.url} className="on-finder-card">
          <span className="on-soon-d" data-soon={dday(c.deadline) <= 7 ? 'true' : undefined}>{dday(c.deadline) === 0 ? 'D-DAY' : `D-${dday(c.deadline)}`}</span>
          <strong>{c.title}</strong>
          <span className="on-soon-meta">{c.organizer} · {c.field}</span>
          <div className="on-cta"><a className="on-btn" href={c.url} target="_blank" rel="noopener noreferrer">공식 안내 ↗</a><SaveButton c={{ url: c.url, title: c.title, organizer: c.organizer, deadline: c.deadline }} /></div>
         </li>
        ))}
       </ul>
      )}
     </div>
     <div>
      <h3>같은 분야의 선배 작품</h3>
      {hitWorks.length === 0 ? <p className="on-small">같은 분야의 선배 작품은 아직 없어요.</p> : (
       <ul className="on-finder-list">
        {hitWorks.map((w) => (
         <li key={w.slug}>
          <Link href={`/onus/works/${w.slug}`} className="on-finder-work">
           {w.cover ? <img src={w.cover} alt="" width={900} height={1125} loading="lazy" /> : <span className="on-finder-ph" aria-hidden="true">PDF</span>}
           <span><strong>{w.title}</strong><em>{w.contestName}</em><i>{w.award}</i></span>
          </Link>
         </li>
        ))}
       </ul>
      )}
     </div>
    </div>
   )}
   <p className="on-small">분야 키워드가 겹치는 것을 찾는 간단한 규칙 기반 추천이에요. AI가 판단하는 것이 아니고, 대상 조건은 공식 안내에서 꼭 확인해 주세요.</p>
  </div>
 );
}
