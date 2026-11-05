'use client';
import { useMemo, useState } from 'react';
import type { NewsItem, NewsTopic } from '@/lib/onus/news';

const fmt = (d: string | null) => (d ? d.replaceAll('-', '.') : '날짜 미확인');

export default function NewsList({ items, topics }: { items: NewsItem[]; topics: NewsTopic[] }) {
 const [q, setQ] = useState('');
 const [topic, setTopic] = useState<NewsTopic | 'all'>('all');
 const present = useMemo(() => topics.filter((t) => items.some((x) => x.topic === t)), [items, topics]);
 const list = useMemo(() => {
  const term = q.trim().toLowerCase();
  return items.filter((x) => (topic === 'all' || x.topic === topic) && (!term || [x.title, x.summary, x.outlet].join(' ').toLowerCase().includes(term)));
 }, [items, q, topic]);

 return (
  <div>
   <div className="on-filter" role="search">
    <label className="on-search"><span className="on-sr">기사 검색</span>
     <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="기사 제목, 매체, 내용으로 찾기" />
    </label>
    <div className="on-chips" role="group" aria-label="기사 주제">
     <button type="button" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>전체</button>
     {present.map((t) => <button type="button" key={t} aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>)}
    </div>
   </div>
   <p className="on-count" aria-live="polite">{list.length}개의 기사 · 최신순</p>
   {list.length === 0 ? <div className="on-empty"><strong>조건에 맞는 기사가 없어요.</strong></div> : (
    <ul className="on-news-grid">
     {list.map((x) => (
      <li key={x.url}>
       <a className="on-news" href={x.url} target="_blank" rel="noopener noreferrer">
        <div className="on-news-top"><span className="on-chip">{x.topic}</span><span>{x.outlet} · {fmt(x.date)}</span></div>
        <h3>{x.title}</h3>
        <p>{x.summary}</p>
        <span className="on-more">원문 보기 ↗{!x.verified && <em className="on-unverified"> · 원문 미확인</em>}</span>
       </a>
      </li>
     ))}
    </ul>
   )}
  </div>
 );
}
