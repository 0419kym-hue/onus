'use client';
import Link from 'next/link';
import { ViewTransition, useMemo, useState } from 'react';
import AwardBadge from './AwardBadge';
import type { Award } from '@/lib/onus/types';

export type GalleryWork = {
 slug: string; title: string; subtitle?: string; contestName: string; contestSlug: string; year: number;
 award: Award; rank: number; fields: string[]; description: string; cover?: string; hasPdf: boolean;
};

export default function WorkGallery({ works, awards }: { works: GalleryWork[]; awards: Award[] }) {
 const [q, setQ] = useState('');
 const [award, setAward] = useState<Award | 'all'>('all');
 const [year, setYear] = useState<number | 'all'>('all');
 const [sort, setSort] = useState<'rank' | 'recent'>('rank');
 const years = useMemo(() => [...new Set(works.map((x) => x.year))].sort((a, b) => b - a), [works]);

 const list = useMemo(() => {
  const term = q.trim().toLowerCase();
  const out = works.filter((x) => {
   if (award !== 'all' && x.award !== award) return false;
   if (year !== 'all' && x.year !== year) return false;
   if (!term) return true;
   const hay = [x.title, x.subtitle ?? '', x.contestName, x.description, x.award, ...x.fields].join(' ').toLowerCase();
   return hay.includes(term);
  });
  // works 는 서버에서 이미 등급순으로 정렬되어 넘어옵니다.
  if (sort === 'recent') out.sort((a, b) => b.year - a.year || b.rank - a.rank);
  return out;
 }, [works, q, award, year, sort]);

 const filtering = q.trim() !== '' || award !== 'all' || year !== 'all' || sort !== 'rank';
 const reset = () => { setQ(''); setAward('all'); setYear('all'); setSort('rank'); };

 return (
  <div>
   <div className="on-filter" role="search">
    <label className="on-search">
     <span className="on-sr">작품 검색</span>
     <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="작품명, 분야, 대회 이름으로 찾기" />
    </label>
    <div className="on-chips" role="group" aria-label="수상 등급">
     <button type="button" aria-pressed={award === 'all'} onClick={() => setAward('all')}>전체 등급</button>
     {awards.map((a) => <button type="button" key={a} aria-pressed={award === a} onClick={() => setAward(a)}>{a}</button>)}
    </div>
    <div className="on-chips" role="group" aria-label="연도">
     <button type="button" aria-pressed={year === 'all'} onClick={() => setYear('all')}>전체 연도</button>
     {years.map((y) => <button type="button" key={y} aria-pressed={year === y} onClick={() => setYear(y)}>{y}</button>)}
     <label className="on-sort">
      <span className="on-sr">정렬</span>
      <select value={sort} onChange={(e) => setSort(e.target.value as 'rank' | 'recent')}>
       <option value="rank">수상 등급순</option>
       <option value="recent">최신 연도순</option>
      </select>
     </label>
    </div>
   </div>

   <p className="on-count" aria-live="polite">
    {list.length}개의 기록{filtering && <button type="button" className="on-reset" onClick={reset}>조건 초기화</button>}
   </p>

   {list.length === 0 ? (
    <div className="on-empty"><strong>조건에 맞는 작품이 없어요.</strong><p>검색어를 줄이거나 조건을 초기화해 보세요.</p></div>
   ) : (
    <ul className="on-grid">
     {list.map((x, i) => {
      const featured = !filtering && i < 2;
      return (
       <li key={x.slug} className={featured ? 'on-featured' : undefined}>
        <Link href={`/onus/works/${x.slug}`} className="on-card">
         <ViewTransition name={`work-${x.slug}`}>
          <div className="on-card-img">
           {x.cover ? <img src={x.cover} alt={`${x.title} 작품 보드`} width={900} height={1125} loading={i < 4 ? 'eager' : 'lazy'} />
            : <div className="on-card-type" aria-hidden="true"><span>PDF</span><strong>{x.title}</strong></div>}
          </div>
         </ViewTransition>
         <div className="on-card-badge"><AwardBadge award={x.award} /></div>
         <div className="on-card-body">
          <p className="on-card-meta">{x.year} · {x.contestName.replace(/^\d{4}\s*/, '')}</p>
          <h3>{x.title}</h3>
          {x.subtitle && <p className="on-card-sub">{x.subtitle}</p>}
          <ul className="on-tags">{x.fields.slice(0, 3).map((f) => <li key={f}>{f}</li>)}</ul>
         </div>
        </Link>
       </li>
      );
     })}
    </ul>
   )}
  </div>
 );
}
