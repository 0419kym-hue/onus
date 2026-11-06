import type { Metadata } from 'next';
import PageHead from '@/components/onus/PageHead';
import Reveal from '@/components/onus/Reveal';
import WorkGallery, { type GalleryGroup } from '@/components/onus/WorkGallery';
import Link from 'next/link';
import ArchiveOverview from '@/components/onus/ArchiveOverview';
import { getApprovedSubmissions, submissionImageUrl } from '@/lib/onus/submissions';
import { allContests, groupedByEdition, sortedWorks, stats } from '@/lib/onus/data';

export const metadata: Metadata = { title: '수상 아카이브', description: '선배들의 실제 출품작을 공모전별로 모아 봅니다.' };

// 칩에 쓰는 짧은 공모전 이름(전체 이름은 각 섹션 제목과 작품 상세에서 그대로 보여 줍니다)
const SHORT: Record<string, string> = { bada: 'BADA', 'seocho-ai-design': '청년 AI 디자인 공모전' };

export const dynamic = 'force-dynamic'; // 운영자가 승인한 작품이 바로 보이도록 요청 때마다 불러옵니다.

export default async function ArchivePage() {
 const s = stats();
 const subs = await getApprovedSubmissions();
 const groups: GalleryGroup[] = groupedByEdition().map((g) => ({
  key: g.key, name: g.name, year: g.year, contestSlug: g.contestSlug,
  familyName: SHORT[g.contestSlug] ?? allContests.find((c) => c.slug === g.contestSlug)?.name ?? g.name,
  works: g.works.map((x) => ({ slug: x.slug, title: x.title, subtitle: x.subtitle, fields: x.fields, description: x.description, award: x.award, cover: x.cover, contestName: x.contestName })),
 }));

 return (
  <main id="main">
   <PageHead eyebrow="ARCHIVE" title="수상 아카이브" lead="선배들의 실제 출품작을 공모전별로 모았어요. 공모전을 먼저 고르고, 그 대회에 나간 작품을 살펴보세요." icon="archive">{subs.status === 'ok' && <div className="on-ph-actions"><Link className="on-btn on-btn-primary" href="/onus/submit">내 수상작 올리기 →</Link></div>}</PageHead>

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

   {subs.status !== 'missing-table' && subs.status !== 'unconfigured' && (
    <section className="on-section on-section-tight" aria-label="새로 올라온 작품">
     <Reveal>
      <p className="on-eyebrow">NEW · 학생이 올린 작품</p>
      <h2>새로 올라온 수상작</h2>
      <p className="on-section-lead">학생이 직접 올리고 운영자가 확인해 승인한 작품이에요.</p>
     </Reveal>
     {subs.status === 'error' ? (
      <div className="on-empty" role="status"><strong>작품을 불러오지 못했어요</strong><p>잠시 뒤 다시 시도해 주세요.</p></div>
     ) : subs.data.length === 0 ? (
      <div className="on-empty"><strong>아직 올라온 작품이 없어요</strong><p>첫 번째로 내 수상작을 올려 후배의 길잡이가 되어 주세요. <Link className="on-inline-link" href="/onus/submit">작품 올리기 →</Link></p></div>
     ) : (
      <ul className="on-sub-grid">
       {subs.data.map((x) => {
        const img = submissionImageUrl(x.image_path);
        return (
         <li key={x.id} className="on-sub">
          {img && <img src={img} alt={`${x.title} 작품 이미지`} width={600} height={750} loading="lazy" />}
          <div className="on-sub-body">
           <span className="on-chip">{x.award}</span>
           <strong>{x.title}</strong>
           <em>{x.contest_year} · {x.contest_title}</em>
           <p>{x.description}</p>
           <span className="on-small">{[x.fields, x.prep_note ? `준비 ${x.prep_note}` : null, x.major].filter(Boolean).join(' · ')} · {x.nickname}</span>
          </div>
         </li>
        );
       })}
      </ul>
     )}
    </section>
   )}

   <section className="on-section on-section-tight">
    <Reveal><p className="on-eyebrow">BY CONTEST</p><h2>대회별로 모아 보기</h2></Reveal>
    <Reveal><p className="on-section-lead">작품을 누르면 실제 출품한 보드와 대회 성격과의 연결, 코멘트를 볼 수 있어요. 대회 이름 옆의 &ldquo;대회 성격 보기&rdquo;에서는 그 대회가 어떤 곳인지 확인할 수 있어요.</p></Reveal>
    <WorkGallery groups={groups} />
   </section>
  </main>
 );
}
