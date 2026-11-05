import Link from 'next/link';
import Reveal from '@/components/onus/Reveal';
import WorkGallery, { type GalleryWork } from '@/components/onus/WorkGallery';
import { AWARD_ORDER, AWARD_RANK } from '@/lib/onus/awards';
import { allContests, sortedWorks, stats } from '@/lib/onus/data';

export default function OnusHome() {
 const list = sortedWorks();
 const s = stats();
 const gallery: GalleryWork[] = list.map((x) => ({
  slug: x.slug, title: x.title, subtitle: x.subtitle, contestName: x.contestName, contestSlug: x.contestSlug, year: x.year,
  award: x.award, rank: AWARD_RANK[x.award], fields: x.fields, description: x.description, cover: x.cover, hasPdf: Boolean(x.pdf),
 }));
 const awardsPresent = AWARD_ORDER.filter((a) => list.some((x) => x.award === a));
 const hero = list.filter((x) => x.cover).slice(0, 3);

 return (
  <main id="main">
   <section className="on-hero">
    <div className="on-hero-text">
     <p className="on-eyebrow">한양여자대학교 · 공모전·대회 경험 아카이브</p>
     <h1>선배의 <em>수상</em>이<br />후배의 다음<br />도전이 됩니다.</h1>
     <p className="on-lead">공모전을 찾아보는 학생이 선배의 실제 출품작과 대회의 성격을 한곳에서 보고, 나에게 맞는 대회를 준비할 수 있도록 돕는 플랫폼입니다.</p>
     <div className="on-cta">
      <Link className="on-btn on-btn-primary" href="#archive">수상 아카이브 보기 <span aria-hidden="true">↓</span></Link>
      <Link className="on-btn" href="#contests">대회 성격 보기</Link>
     </div>
    </div>
    <div className="on-hero-art" aria-hidden="true">
     {hero.map((x, i) => <img key={x.slug} className={`on-hero-img on-hero-img-${i + 1}`} src={x.cover} alt="" width={900} height={1125} />)}
    </div>
   </section>

   <section className="on-stats" aria-label="아카이브 현황">
    <div><strong>{s.total}</strong><span>수상·선정 기록</span></div>
    <div><strong>{s.byContest.length}</strong><span>대회</span></div>
    <div><strong>{s.byYear.map(([y, n]) => `${y}년 ${n}`).join(' · ')}</strong><span>연도별 기록</span></div>
    <ul className="on-stats-awards">{s.byAward.map(([a, n]) => <li key={a}>{a} <b>{n}</b></li>)}</ul>
   </section>

   <section id="archive" className="on-section">
    <Reveal>
     <p className="on-eyebrow">01 · ARCHIVE</p>
     <h2>수상 아카이브</h2>
     <p className="on-section-lead">높은 등급부터 보여 줍니다. 입선은 뒤쪽에 있어요. 대회마다 등급 체계가 달라 순서는 임시 기준이에요. 작품을 누르면 대회의 성격과 작품의 연결을 볼 수 있습니다.</p>
    </Reveal>
    <WorkGallery works={gallery} awards={awardsPresent} />
   </section>

   <section id="contests" className="on-section on-section-alt">
    <Reveal>
     <p className="on-eyebrow">02 · CONTESTS</p>
     <h2>대회의 성격부터 보세요</h2>
     <p className="on-section-lead">어떤 주제를 다루고 누가 참가할 수 있는지, 아직 확인하지 못한 것은 무엇인지 정리했습니다. 출처가 함께 있고, 지원 전에는 공식 요강에서 다시 확인해야 합니다.</p>
    </Reveal>
    <ul className="on-contest-grid">
     {allContests.map((c, i) => {
      const n = s.byContest.find(([k]) => k.slug === c.slug)?.[1] ?? 0;
      return (
       <li key={c.slug}>
        <Reveal delay={i * 50}>
         <Link href={`/onus/contests/${c.slug}`} className="on-contest-card">
          <span className="on-contest-count">{n}개의 기록</span>
          <h3>{c.name}</h3>
          <p>{c.tagline}</p>
          <span className="on-more">대회 성격 보기 →</span>
         </Link>
        </Reveal>
       </li>
      );
     })}
    </ul>
   </section>

   <section className="on-section">
    <Reveal>
     <p className="on-eyebrow">03 · STATUS</p>
     <h2>지금 되는 것, 준비 중인 것</h2>
    </Reveal>
    <div className="on-status">
     <Reveal className="on-status-box">
      <h3>지금 볼 수 있어요</h3>
      <ul className="on-list">
       <li>선배 수상작과 작품 보드 열람 (로그인 없이)</li>
       <li>등급·연도 필터, 검색</li>
       <li>접수 중인 공모전 모음과 대회 성격</li>
       <li>커뮤니티(팀원 모집·모임 공간·참가 학생·이야기)와 작품 코멘트·댓글, 로그인 없이 쓰기</li>
       <li>서류로 수상·출품 경험 인증 신청(운영자 승인)</li>
       <li>대회 성격과 작품의 연결 코멘트(초안)</li>
      </ul>
     </Reveal>
     <Reveal className="on-status-box on-status-soon" delay={80}>
      <h3>준비 중이에요 <span className="on-pill">아직 없음</span></h3>
      <ul className="on-list">
       <li>내 작품 등록, 준비 과정·경험 기록 쓰기</li>
       <li>인증된 경험자에게 피드백 요청</li>
       <li>학교 구성원 인증, 전공 선배 인증</li>
      </ul>
     </Reveal>
    </div>
   </section>
  </main>
 );
}
