import type { Metadata } from 'next';
import PageHead from '@/components/onus/PageHead';
import Reveal from '@/components/onus/Reveal';
import WorkGallery, { type GalleryGroup } from '@/components/onus/WorkGallery';
import ArchiveOverview from '@/components/onus/ArchiveOverview';
import { allContests, groupedByEdition, sortedWorks, stats } from '@/lib/onus/data';

export const metadata: Metadata = { title: '수상 아카이브', description: '선배들의 실제 출품작을 공모전별로 모아 봅니다.' };

// 칩에 쓰는 짧은 공모전 이름(전체 이름은 각 섹션 제목과 작품 상세에서 그대로 보여 줍니다)
const SHORT: Record<string, string> = { bada: 'BADA', 'seocho-ai-design': '청년 AI 디자인 공모전' };

export default function ArchivePage() {
 const s = stats();
 const groups: GalleryGroup[] = groupedByEdition().map((g) => ({
  key: g.key, name: g.name, year: g.year, contestSlug: g.contestSlug,
  familyName: SHORT[g.contestSlug] ?? allContests.find((c) => c.slug === g.contestSlug)?.name ?? g.name,
  works: g.works.map((x) => ({ slug: x.slug, title: x.title, subtitle: x.subtitle, fields: x.fields, description: x.description, award: x.award, cover: x.cover, contestName: x.contestName })),
 }));

 return (
  <main id="main">
   <PageHead eyebrow="ARCHIVE" title="수상 아카이브" lead="선배들의 실제 출품작을 공모전별로 모았어요. 공모전을 먼저 고르고, 그 대회에 나간 작품을 살펴보세요." icon="archive" />

   <section className="on-stats" aria-label="아카이브 현황">
    <div><strong>{s.total}</strong><span>수상·선정 기록</span></div>
    <div><strong>{groups.length}</strong><span>공모전(회차)</span></div>
    <div><strong>{s.byYear.map(([y, n]) => `${y}년 ${n}`).join(' · ')}</strong><span>연도별 기록</span></div>
   </section>

   <section className="on-section on-section-tight">
    <Reveal>
     <p className="on-eyebrow">AT A GLANCE</p>
     <h2>한눈에 비교해 보기</h2>
     <p className="on-section-lead">작품을 하나씩 열어 보지 않아도 대회·수상·분야·준비 기록을 한 표에서 볼 수 있어요. 이름을 누르면 상세 페이지로 이동해요.</p>
    </Reveal>
    <ArchiveOverview works={sortedWorks()} />
   </section>

   <section className="on-section on-section-tight">
    <Reveal><p className="on-eyebrow">BY CONTEST</p><h2>대회별로 모아 보기</h2></Reveal>
    <Reveal><p className="on-section-lead">작품을 누르면 실제 출품한 보드와 대회 성격과의 연결, 코멘트를 볼 수 있어요. 대회 이름 옆의 &ldquo;대회 성격 보기&rdquo;에서는 그 대회가 어떤 곳인지 확인할 수 있어요.</p></Reveal>
    <WorkGallery groups={groups} />
   </section>
  </main>
 );
}
