import type { Metadata } from 'next';
import Link from 'next/link';
import ExternalContests from '@/components/onus/ExternalContests';
import Reveal from '@/components/onus/Reveal';
import { allContests, stats } from '@/lib/onus/data';
import { contestSites, EXTERNAL_CHECKED_AT, externalContests } from '@/lib/onus/external-contests';

export const metadata: Metadata = { title: '공모전 모음', description: '지금 접수 중인 공모전과 우리 아카이브 대회의 성격을 한곳에서 확인합니다.' };
export const dynamic = 'force-dynamic'; // 마감이 지난 공모전을 자동으로 숨기기 위해 요청 시점의 날짜를 사용합니다.

export default function ContestsPage() {
 const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
 const s = stats();
 return (
  <main id="main" className="on-detail">
   <section className="on-contest-head">
    <p className="on-eyebrow">CONTESTS</p>
    <h1>공모전 모음</h1>
    <p className="on-detail-sub">지금 접수 중인 공모전부터, 선배들이 참가한 대회의 성격까지 한곳에서 볼 수 있어요.</p>
   </section>

   <section className="on-section">
    <Reveal>
     <p className="on-eyebrow">01 · 지금 접수 중</p>
     <h2>접수 중인 공모전</h2>
     <p className="on-section-lead">{EXTERNAL_CHECKED_AT}에 공모전 정보 사이트(주로 위비티)의 상세 페이지를 읽어 모은 목록입니다. <strong>실시간 연동이 아니고 전체 공모전도 아닙니다.</strong> 일정과 참가 대상은 바뀔 수 있으니 &ldquo;공식 안내&rdquo; 링크에서 꼭 다시 확인해 주세요. 마감이 지난 항목은 자동으로 숨겨져요.</p>
    </Reveal>
    <ExternalContests items={externalContests} today={today} />
    <Reveal className="on-unknown">
     <h3>더 많은 공모전은 여기서 볼 수 있어요</h3>
     <ul className="on-chips on-site-links">{contestSites.map((x) => <li key={x.url}><a className="on-site" href={x.url} target="_blank" rel="noopener noreferrer">{x.name} ↗</a></li>)}</ul>
     <p className="on-small">외부 사이트의 전체 목록을 자동으로 가져오는 기능은 각 사이트의 이용 허락이 필요해 아직 없어요.</p>
    </Reveal>
   </section>

   <section className="on-section">
    <Reveal>
     <p className="on-eyebrow">02 · 선배들이 참가한 대회</p>
     <h2>대회의 성격 보기</h2>
    </Reveal>
    <ul className="on-contest-grid">
     {allContests.map((c) => {
      const n = s.byContest.find(([k]) => k.slug === c.slug)?.[1] ?? 0;
      return (
       <li key={c.slug}>
        <Link href={`/onus/contests/${c.slug}`} className="on-contest-card">
         <span className="on-contest-count">{n}개의 기록</span>
         <h3>{c.name}</h3>
         <p>{c.tagline}</p>
         <span className="on-more">대회 성격 보기 →</span>
        </Link>
       </li>
      );
     })}
    </ul>
   </section>
  </main>
 );
}
