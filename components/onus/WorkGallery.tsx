'use client';
import Link from 'next/link';
import { ViewTransition, useMemo, useState } from 'react';
import AwardBadge from './AwardBadge';
import type { Award } from '@/lib/onus/types';

export type GalleryWork = {
 slug: string; title: string; subtitle?: string; fields: string[]; description: string;
 award: Award; cover?: string; contestName: string;
};
// 공모전(회차) 하나에 해당하는 묶음
export type GalleryGroup = { key: string; name: string; year: number; contestSlug: string; familyName: string; works: GalleryWork[] };

export default function WorkGallery({ groups }: { groups: GalleryGroup[] }) {
 const [q, setQ] = useState('');
 const [family, setFamily] = useState<string>('all');
 const [year, setYear] = useState<number | 'all'>('all');

 const families = useMemo(() => {
  const seen = new Map<string, string>();
  for (const g of groups) if (!seen.has(g.contestSlug)) seen.set(g.contestSlug, g.familyName);
  return [...seen.entries()];
 }, [groups]);
 const years = useMemo(() => [...new Set(groups.map((g) => g.year))].sort((a, b) => b - a), [groups]);

 const shown = useMemo(() => {
  const term = q.trim().toLowerCase();
  return groups
   .filter((g) => (family === 'all' || g.contestSlug === family) && (year === 'all' || g.year === year))
   .map((g) => ({ ...g, works: g.works.filter((w) => !term || [w.title, w.subtitle ?? '', g.name, w.description, ...w.fields].join(' ').toLowerCase().includes(term)) }))
   .filter((g) => g.works.length > 0);
 }, [groups, q, family, year]);

 const total = shown.reduce((n, g) => n + g.works.length, 0);
 const filtering = q.trim() !== '' || family !== 'all' || year !== 'all';
 const reset = () => { setQ(''); setFamily('all'); setYear('all'); };
 let seq = 0;

 return (
  <div>
   <div className="on-filter" role="search">
    <label className="on-search">
     <span className="on-sr">작품 검색</span>
     <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="작품명, 분야, 공모전 이름으로 찾기" />
    </label>
    <div className="on-chips" role="group" aria-label="공모전">
     <button type="button" aria-pressed={family === 'all'} onClick={() => setFamily('all')}>전체 공모전</button>
     {families.map(([slug, name]) => <button type="button" key={slug} aria-pressed={family === slug} onClick={() => setFamily(slug)}>{name}</button>)}
    </div>
    <div className="on-chips" role="group" aria-label="연도">
     <button type="button" aria-pressed={year === 'all'} onClick={() => setYear('all')}>전체 연도</button>
     {years.map((y) => <button type="button" key={y} aria-pressed={year === y} onClick={() => setYear(y)}>{y}</button>)}
    </div>
   </div>

   <p className="on-count" aria-live="polite">공모전 {shown.length}개 · 작품 {total}개{filtering && <button type="button" className="on-reset" onClick={reset}>조건 초기화</button>}</p>

   {shown.length === 0 ? (
    <div className="on-empty"><strong>조건에 맞는 작품이 없어요.</strong><p>검색어를 줄이거나 조건을 초기화해 보세요.</p></div>
   ) : (
    shown.map((g) => (
     <section key={g.key} className="on-group" aria-labelledby={`g-${g.contestSlug}-${g.year}`}>
      <header className="on-group-head">
       <div>
        <p className="on-group-year">{g.year}</p>
        <h2 id={`g-${g.contestSlug}-${g.year}`}>{g.name}</h2>
       </div>
       <div className="on-group-side">
        <span className="on-group-count">작품 {g.works.length}개</span>
        <Link className="on-more" href={`/onus/contests/${g.contestSlug}`}>대회 성격 보기 →</Link>
       </div>
      </header>
      <ul className="on-grid">
       {g.works.map((x) => {
        const i = seq++;
        return (
         <li key={x.slug}>
          <Link href={`/onus/works/${x.slug}`} className="on-card">
           <ViewTransition name={`work-${x.slug}`}>
            <div className="on-card-img">
             {x.cover ? <img src={x.cover} alt={`${x.title} 작품 보드`} width={900} height={1125} loading={i < 8 ? 'eager' : 'lazy'} />
              : <div className="on-card-type" aria-hidden="true"><span>PDF</span><strong>{x.title}</strong></div>}
            </div>
           </ViewTransition>
           <div className="on-card-badge"><AwardBadge award={x.award} /></div>
           <div className="on-card-body">
            <h3>{x.title}</h3>
            {x.subtitle && <p className="on-card-sub">{x.subtitle}</p>}
            <ul className="on-tags">{x.fields.slice(0, 3).map((f) => <li key={f}>{f}</li>)}</ul>
           </div>
          </Link>
         </li>
        );
       })}
      </ul>
     </section>
    ))
   )}
  </div>
 );
}
