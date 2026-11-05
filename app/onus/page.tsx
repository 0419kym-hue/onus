import Link from 'next/link';
import Icon, { type IconName } from '@/components/onus/Icons';
import Reveal from '@/components/onus/Reveal';
import { externalContests } from '@/lib/onus/external-contests';
import { sortedNews } from '@/lib/onus/news';

export const dynamic = 'force-dynamic'; // 마감이 지난 공모전은 빼고 오늘 기준으로 보여 주기 위해 요청 시점의 날짜를 씁니다.

const TILES: { href: string; icon: IconName; title: string; desc: string }[] = [
 { href: '/onus/archive', icon: 'archive', title: '수상 아카이브', desc: '선배들의 수상작과 준비 기록' },
 { href: '/onus/contests', icon: 'trophy', title: '공모전', desc: '지금 접수 중인 공모전과 대회 성격' },
 { href: '/onus/news', icon: 'news', title: '한양여대 소식', desc: '공모전·대회 관련 기사 모음' },
 { href: '/onus/community', icon: 'chat', title: '커뮤니티', desc: '팀원 모집, 모임 공간, 참가 학생' },
 { href: '/onus/verify', icon: 'badge', title: '경험 인증', desc: '서류로 수상·출품 경험 인증' },
];

export default function OnusHome() {
 const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
 const dday = (d: string) => Math.round((Date.parse(d) - Date.parse(today)) / 86400000);
 const soon = externalContests.filter((x) => x.deadline >= today).sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 4);
 const latest = sortedNews().slice(0, 3);

 return (
  <main id="main">
   <section className="on-hero2">
    <div className="on-hero2-bg" aria-hidden="true"><span className="on-orb on-orb-a" /><span className="on-orb on-orb-b" /><span className="on-gridlines" /></div>
    <div className="on-hero2-inner">
     <p className="on-hero2-chip"><img src="/onus/brand/hywoman-mark.webp" alt="" width={26} height={26} />한양여자대학교 공모전·대회 플랫폼</p>
     <h1 className="on-wordmark" aria-label="ON:US">ON<span>:</span>US</h1>
     <p className="on-hero2-line">우리의 도전에 불을 켜다.</p>
     <a className="on-hero2-scroll" href="#services">둘러보기 <span aria-hidden="true">↓</span></a>
    </div>
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
        <Link href={t.href} className="on-tile">
         <span className="on-tile-ic"><Icon name={t.icon} /></span>
         <strong>{t.title}</strong>
         <span>{t.desc}</span>
        </Link>
       </Reveal>
      </li>
     ))}
    </ul>
   </section>

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
  </main>
 );
}
