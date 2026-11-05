import type { Metadata } from 'next';
import Reveal from '@/components/onus/Reveal';
import WorkGallery, { type GalleryWork } from '@/components/onus/WorkGallery';
import { AWARD_ORDER, AWARD_RANK } from '@/lib/onus/awards';
import { sortedWorks, stats } from '@/lib/onus/data';

export const metadata: Metadata = { title: '수상 아카이브', description: '선배들의 실제 출품작과 수상 기록을 대회의 성격과 함께 봅니다.' };

export default function ArchivePage() {
 const list = sortedWorks();
 const s = stats();
 const gallery: GalleryWork[] = list.map((x) => ({
  slug: x.slug, title: x.title, subtitle: x.subtitle, contestName: x.contestName, contestSlug: x.contestSlug, year: x.year,
  award: x.award, rank: AWARD_RANK[x.award], fields: x.fields, description: x.description, cover: x.cover, hasPdf: Boolean(x.pdf),
 }));
 const awardsPresent = AWARD_ORDER.filter((a) => list.some((x) => x.award === a));

 return (
  <main id="main">
   <header className="on-pagehead">
    <div className="on-pagehead-inner">
     <p className="on-eyebrow">ARCHIVE</p>
     <h1>수상 아카이브</h1>
     <p className="on-pagehead-lead">선배들의 실제 출품작을 대회의 성격과 함께 살펴보세요. 높은 등급부터 보이고, 대회마다 등급 체계가 달라 순서는 임시 기준이에요.</p>
    </div>
   </header>

   <section className="on-stats" aria-label="아카이브 현황">
    <div><strong>{s.total}</strong><span>수상·선정 기록</span></div>
    <div><strong>{s.byContest.length}</strong><span>대회</span></div>
    <div><strong>{s.byYear.map(([y, n]) => `${y}년 ${n}`).join(' · ')}</strong><span>연도별 기록</span></div>
    <ul className="on-stats-awards">{s.byAward.map(([a, n]) => <li key={a}>{a} <b>{n}</b></li>)}</ul>
   </section>

   <section className="on-section on-section-tight">
    <Reveal><p className="on-section-lead">작품을 누르면 실제 출품한 보드와 대회 성격과의 연결, 코멘트를 볼 수 있어요.</p></Reveal>
    <WorkGallery works={gallery} awards={awardsPresent} />
   </section>
  </main>
 );
}
