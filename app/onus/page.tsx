import Link from 'next/link';
import AiRecommend from '@/components/onus/AiRecommend';
import ChallengeFinder, { type FinderContest, type FinderWork } from '@/components/onus/ChallengeFinder';
import Icon, { type IconName } from '@/components/onus/Icons';
import CountUp from '@/components/onus/CountUp';
import HeroScene from '@/components/onus/HeroScene';
import Reveal from '@/components/onus/Reveal';
import Tilt from '@/components/onus/Tilt';
import { AWARD_RANK } from '@/lib/onus/awards';
import { sortedWorks, stats } from '@/lib/onus/data';
import { externalContests } from '@/lib/onus/external-contests';
import { sortedNews } from '@/lib/onus/news';

export const dynamic = 'force-dynamic'; // 마감이 지난 공모전은 빼고 오늘 기준으로 보여 주기 위해 요청 시점의 날짜를 씁니다.

const TILES: { href: string; icon: IconName; title: string; desc: string }[] = [
 { href: '/onus/archive', icon: 'archive', title: '수상 아카이브', desc: '공모전별로 모은 선배들의 수상작' },
 { href: '/onus/contests', icon: 'trophy', title: '공모전', desc: '지금 접수 중인 공모전과 대회 성격' },
 { href: '/onus/news', icon: 'news', title: '한양여대 소식', desc: '공모전·대회 관련 기사 모음' },
 { href: '/onus/community', icon: 'chat', title: '커뮤니티', desc: '팀원 모집, 모임 공간, 참가 학생' },
 { href: '/onus/verify', icon: 'badge', title: '경험 인증', desc: '서류로 수상·출품 경험 인증' },
];

export default function OnusHome() {
 const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
 const dday = (d: string) => Math.round((Date.parse(d) - Date.parse(today)) / 86400000);
 const live = externalContests.filter((x) => x.deadline >= today).sort((a, b) => a.deadline.localeCompare(b.deadline));
 const soon = live.slice(0, 4);
 const latest = sortedNews().slice(0, 3);
 const st = stats();
 const nearest = live[0] ? dday(live[0].deadline) : null;
 const showWorks = sortedWorks().filter((w) => w.cover).slice(0, 8);
 const finderContests: FinderContest[] = live.map((x) => ({ url: x.url, title: x.title, organizer: x.organizer, deadline: x.deadline, field: x.field }));
 const finderWorks: FinderWork[] = sortedWorks().map((w) => ({ slug: w.slug, title: w.title, subtitle: w.subtitle, fields: w.fields, award: w.award, rank: AWARD_RANK[w.award], cover: w.cover, contestName: w.contestName }));

 return (
  <main id="main">
   <section className="on-hero3d">
    <HeroScene />
    <div className="on-hero3d-inner">
     <p className="on-hero3d-chip"><img src="/onus/brand/hywoman-mark.webp" alt="" width={26} height={26} />한양여자대학교 공모전·대회 플랫폼</p>
     <h1 aria-label="ON:US">ON<span>:</span>US</h1>
     <p className="on-hero3d-line">우리의 도전에 불을 켜다.</p>
     <p className="on-hero3d-sub">선배들의 공모전 출품작과 수상 경험을 공유하고, 한양여대의 소식을 알고 인증된 선배의 피드백으로 새로운 도전을 연결하는 한양여대 전용 플랫폼.</p>
     <div className="on-hero3d-cta">
      <Link className="primary" href="/onus/contests">지금 접수 중인 공모전 →</Link>
      <a className="ghost" href="#about">둘러보기</a>
     </div>
    </div>
   </section>

   <div className="on-statband">
    <ul>
     <li><span className="on-stat-n"><CountUp to={st.total} suffix="점" /></span><span className="on-stat-l">선배들의 수상작</span></li>
     <li><span className="on-stat-n"><CountUp to={live.length} suffix="개" /></span><span className="on-stat-l">지금 접수 중인 공모전</span></li>
     <li><span className="on-stat-n">{nearest === null ? '-' : nearest === 0 ? <em>D-DAY</em> : <><em>D-</em><CountUp to={nearest} /></>}</span><span className="on-stat-l">가장 가까운 마감</span></li>
     <li><span className="on-stat-n"><CountUp to={st.byContest.length} suffix="개" /></span><span className="on-stat-l">수상작이 나온 대회</span></li>
    </ul>
   </div>

   {live.length > 0 && (
    <div className="on-ticker" aria-label="접수 중인 공모전">
     <div className="on-ticker-track">
      {[...live.slice(0, 12), ...live.slice(0, 12)].map((x, i) => (
       <a key={i} href={x.url} target="_blank" rel="noopener noreferrer" aria-hidden={i >= Math.min(live.length, 12) ? true : undefined} tabIndex={i >= Math.min(live.length, 12) ? -1 : undefined}>
        <b data-soon={dday(x.deadline) <= 7 ? 'true' : undefined}>{dday(x.deadline) === 0 ? 'D-DAY' : `D-${dday(x.deadline)}`}</b>{x.title}
       </a>
      ))}
     </div>
    </div>
   )}

   <section id="about" className="on-story">
    <div className="on-story-inner">
     <Reveal>
      <p className="on-eyebrow">ABOUT · 이름의 의미</p>
      <div className="on-story-words" aria-hidden="true">
       <div className="on-word"><span className="on-word-k">ON</span><strong>연결하고 활성화하다</strong></div>
       <span className="on-word-link"><i /><b>:</b><i /></span>
       <div className="on-word"><span className="on-word-k">US</span><strong>우리</strong></div>
      </div>
      <p className="on-story-text">{"ON:US는 'ON(연결하고 활성화하다)'과 'US(우리)'를 결합한 이름입니다."} 선배들의 작품과 경험이 후배의 새로운 도전으로 이어지고, 서로의 지식과 가능성을 연결한다는 의미를 담고 있습니다.</p>
     </Reveal>
    </div>
   </section>

   <section id="top-ai" className="on-section">
    <Reveal>
     <p className="on-eyebrow">AI 맞춤 추천</p>
     <h2>나에게 딱 맞는 공모전, AI가 골라 줘요</h2>
     <p className="on-section-lead">전공과 관심사, 경험을 적으면 지금 접수 중인 공모전 중에서 참가 자격까지 따져 추천해 드려요.</p>
    </Reveal>
    <AiRecommend today={today} />
   </section>

   <section className="on-section">
    <Reveal>
     <p className="on-eyebrow">FIND YOUR CHALLENGE</p>
     <h2>나에게 맞는 도전 찾기</h2>
     <p className="on-section-lead">관심 분야를 고르면 지금 접수 중인 공모전과 같은 분야의 선배 작품을 한 번에 보여 줘요. 마음에 드는 공모전은 <Link className="on-inline-link" href="/onus/board">나의 도전 보드</Link>에 담아 마감과 준비 단계를 챙길 수 있어요.</p>
    </Reveal>
    <ChallengeFinder contests={finderContests} works={finderWorks} today={today} />
   </section>

   <section id="services" className="on-section">
    <Reveal>
     <p className="on-eyebrow">SERVICES</p>
     <h2>필요한 곳으로 바로 가요</h2>
    </Reveal>
    <ul className="on-tiles">
     {TILES.map((t, i) => (
      <li key={t.href}>
       <Reveal delay={i * 50}>
        <Tilt>
         <Link href={t.href} className="on-tile">
          <span className="on-tile-ic"><Icon name={t.icon} /></span>
          <strong>{t.title}</strong>
          <span>{t.desc}</span>
         </Link>
        </Tilt>
       </Reveal>
      </li>
     ))}
    </ul>
   </section>

   {showWorks.length > 0 && (
    <section className="on-section">
     <Reveal className="on-sectionhead">
      <div><p className="on-eyebrow">SHOWCASE</p><h2>먼저 도전한 선배들의 수상작</h2></div>
      <Link className="on-more" href="/onus/archive">전체 보기 →</Link>
     </Reveal>
     <div className="on-showcase" tabIndex={0} aria-label="수상작 가로 목록">
      {showWorks.map((w) => (
       <Link key={w.slug} href={`/onus/works/${w.slug}`} className="on-show">
        <img src={w.cover} alt="" width={900} height={1125} loading="lazy" />
        <span className="on-show-award">{w.award}</span>
        <span className="on-show-body"><strong>{w.title}</strong><em>{w.contestName}</em></span>
       </Link>
      ))}
     </div>
    </section>
   )}

   {soon.length > 0 && (
    <section className="on-section">
     <Reveal className="on-sectionhead">
      <div><p className="on-eyebrow">DEADLINE</p><h2>마감이 다가오는 공모전</h2></div>
      <Link className="on-more" href="/onus/contests">전체 보기 →</Link>
     </Reveal>
     <ul className="on-soon-grid">
      {soon.map((x, i) => (
       <li key={x.url + x.title}>
        <Reveal delay={i * 50}>
         <a className="on-soon" href={x.url} target="_blank" rel="noopener noreferrer">
          <span className="on-soon-d" data-soon={dday(x.deadline) <= 7 ? 'true' : undefined}>{dday(x.deadline) === 0 ? 'D-DAY' : `D-${dday(x.deadline)}`}</span>
          <strong>{x.title}</strong>
          <span className="on-soon-meta">{x.organizer}</span>
          <span className="on-soon-meta">{x.field} · {x.deadline.replaceAll('-', '.')} 마감</span>
         </a>
        </Reveal>
       </li>
      ))}
     </ul>
    </section>
   )}

   <section className="on-section on-section-alt">
    <Reveal className="on-sectionhead">
     <div><p className="on-eyebrow">NEWS</p><h2>한양여대 소식</h2></div>
     <Link className="on-more" href="/onus/news">전체 보기 →</Link>
    </Reveal>
    {latest.length === 0 ? (
     <div className="on-empty"><strong>아직 모은 기사가 없어요.</strong></div>
    ) : (
     <ul className="on-news-grid on-news-grid-3">
      {latest.map((x, i) => (
       <li key={x.url}>
        <Reveal delay={i * 50}>
         <a className="on-news" href={x.url} target="_blank" rel="noopener noreferrer">
          <div className="on-news-top"><span className="on-chip">{x.topic}</span><span>{x.outlet} · {x.date ? x.date.replaceAll('-', '.') : '날짜 미확인'}</span></div>
          <h3>{x.title}</h3>
          <p>{x.summary}</p>
          <span className="on-more">원문 보기 ↗</span>
         </a>
        </Reveal>
       </li>
      ))}
     </ul>
    )}
   </section>

   <div className="on-cta-band-wrap">
    <section className="on-cta-band">
     <h2>다음 수상작의 주인공은 당신이에요</h2>
     <p>관심 분야를 적으면 AI가 맞는 공모전을 골라 줘요. 마음에 드는 공모전은 도전 보드에 담고, 선배의 작품에서 힌트를 얻어 보세요.</p>
     <div className="on-hero3d-cta">
      <a className="primary" href="#top-ai">AI 추천 받기 →</a>
      <Link className="ghost" href="/onus/board">나의 도전 보드</Link>
     </div>
    </section>
   </div>
  </main>
 );
}
