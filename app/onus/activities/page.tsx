import type { Metadata } from 'next';
import PageHead from '@/components/onus/PageHead';
import Reveal from '@/components/onus/Reveal';
import { ACTIVITY_CHECKED_AT, EXAMPLES_URL, activityExamples, activitySites, activityTips, activityTypes } from '@/lib/onus/activities';

export const metadata: Metadata = { title: '대외활동', description: '대외활동을 찾을 수 있는 사이트와 조심할 점, 지금 모집 중인 예시를 한곳에서 확인해요.' };
export const dynamic = 'force-dynamic'; // 마감이 지난 예시는 오늘 날짜(한국 시간) 기준으로 숨깁니다.

export default function ActivitiesPage() {
 const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
 const dday = (d: string) => Math.round((Date.parse(d) - Date.parse(today)) / 86400000);
 const live = activityExamples.filter((x) => x.deadline >= today).sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 6);
 const groups = ['대외활동 플랫폼', '정부·지자체', '한양여대 교내'] as const;
 return (
  <main id="main">
   <PageHead eyebrow="ACTIVITIES" title="대외활동, 어디서 찾고 무엇을 확인할까요" lead={`${ACTIVITY_CHECKED_AT}에 각 사이트의 공개 화면에서 확인한 내용이에요. 어디서 찾을 수 있는지, 활동 유형, 조심할 점, 지금 모집 중인 예시를 모았어요.`} icon="flag" />

   <section className="on-section on-section-tight">
    <Reveal><p className="on-eyebrow">TYPES</p><h2>대외활동에는 이런 유형이 있어요</h2></Reveal>
    <ul className="on-act-types">
     {activityTypes.map((t) => <li key={t.name}><strong>{t.name}</strong><span>{t.desc}</span></li>)}
    </ul>
   </section>

   {live.length > 0 && (
    <section className="on-section">
     <Reveal className="on-sectionhead"><div><p className="on-eyebrow">OPEN · 모집 중 예시</p><h2>지금 모집 중인 대외활동 예시</h2></div><a className="on-more" href={EXAMPLES_URL} target="_blank" rel="noopener noreferrer">링커리어에서 더 보기 ↗</a></Reveal>
     <ul className="on-act-live">
      {live.map((x) => (
       <li key={x.title} className="on-act-live-item">
        <span className="on-soon-d" data-soon={dday(x.deadline) <= 3 ? 'true' : undefined}>{dday(x.deadline) === 0 ? 'D-DAY' : `D-${dday(x.deadline)}`}</span>
        <strong>{x.title}</strong>
        <span className="on-soon-meta">{x.host} · {x.deadline.replaceAll('-', '.')} 마감(추정)</span>
       </li>
      ))}
     </ul>
     <p className="on-small">링커리어 &ldquo;대외활동 실시간 공고&rdquo;에 {ACTIVITY_CHECKED_AT} 표시돼 있던 예시예요. 마감일은 화면의 D-day를 날짜로 계산한 값이라, 지원 전에 공고 원문에서 꼭 다시 확인해 주세요. 마감이 지난 예시는 자동으로 사라져요.</p>
    </section>
   )}

   {groups.map((g) => (
    <section key={g} className="on-section">
     <Reveal><p className="on-eyebrow">{g === '대외활동 플랫폼' ? 'PLATFORMS' : g === '정부·지자체' ? 'PUBLIC' : 'CAMPUS'}</p><h2>{g === '대외활동 플랫폼' ? '대외활동을 모아 보는 사이트' : g === '정부·지자체' ? '정부·지자체 청년 활동·정책' : '한양여대 교내 지원'}</h2></Reveal>
     <ul className="on-act-grid">
      {activitySites.filter((s) => s.kind === g).map((s) => (
       <li key={s.name} className="on-act-card">
        <h3>{s.name}</h3>
        <p>{s.desc}</p>
        <p className="on-act-good"><b>이럴 때 좋아요</b> {s.goodFor}</p>
        <p className="on-small"><b>직접 확인한 것</b> {s.seen}</p>
        <a className="on-btn on-btn-primary" href={s.url} target="_blank" rel="noopener noreferrer">바로가기 ↗</a>
       </li>
      ))}
     </ul>
    </section>
   ))}

   <section className="on-section">
    <Reveal><p className="on-eyebrow">CHECK</p><h2>지원 전에 꼭 확인하세요</h2></Reveal>
    <div className="on-note-card"><ul>{activityTips.map((t) => <li key={t}>{t}</li>)}</ul></div>
   </section>
  </main>
 );
}
