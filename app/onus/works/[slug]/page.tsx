import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import AwardBadge from '@/components/onus/AwardBadge';
import Reveal from '@/components/onus/Reveal';
import CommentThread from '@/components/onus/CommentThread';
import { awardKind } from '@/lib/onus/awards';
import { getComments, STATE_MESSAGE } from '@/lib/onus/community';
import { durationLabel } from '@/lib/onus/journey';
import { getContest, getWork, sortedWorks, worksOfContest } from '@/lib/onus/data';

export const dynamic = 'force-dynamic'; // 코멘트가 바로 보이도록 요청 때마다 불러옵니다.

export function generateStaticParams() {
 return sortedWorks().map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
 const { slug } = await params;
 const work = getWork(slug);
 return work ? { title: work.title, description: work.description } : { title: '작품을 찾을 수 없어요' };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const work = getWork(slug);
 if (!work) notFound();
 const contest = getContest(work.contestSlug);
 const others = worksOfContest(work.contestSlug).filter((x) => x.slug !== work.slug);
 const comments = await getComments('work', work.slug);

 return (
  <main id="main" className="on-detail">
   <Link className="on-back" href="/onus/archive">← 수상 아카이브</Link>

   <section className="on-detail-top">
    <ViewTransition name={`work-${work.slug}`}>
     <div className="on-detail-cover">
      {work.cover ? <img src={work.cover} alt={`${work.title} 작품 보드`} width={900} height={1125} />
       : <div className="on-card-type" aria-hidden="true"><span>PDF</span><strong>{work.title}</strong></div>}
     </div>
    </ViewTransition>
    <div className="on-detail-info">
     <p className="on-eyebrow">{work.year} · {awardKind(work.award)}</p>
     <AwardBadge award={work.award} large />
     <h1>{work.title}</h1>
     {work.subtitle && <p className="on-detail-sub">{work.subtitle}</p>}
     <p className="on-detail-desc">{work.description}</p>
     <ul className="on-tags on-tags-lg">{work.fields.map((f) => <li key={f}>{f}</li>)}</ul>
     <dl className="on-meta">
      <div><dt>공모전</dt><dd>{contest ? <Link href={`/onus/contests/${contest.slug}`}>{work.contestName}</Link> : work.contestName}</dd></div>
      {work.organizer && <div><dt>주최</dt><dd>{work.organizer}</dd></div>}
      {work.slogan && <div><dt>공모 슬로건</dt><dd>{work.slogan}</dd></div>}
      {work.officialTitle && <div><dt>공식 작품명</dt><dd>{work.officialTitle}</dd></div>}
      <div><dt>{awardKind(work.award)} 표기</dt><dd>{work.award}</dd></div>
     </dl>
     {work.awardNote && <p className="on-note-inline">{work.awardNote}</p>}
    </div>
   </section>

   {contest && (
    <section className="on-section on-section-tight" aria-label="한눈 요약">
     <Reveal><p className="on-eyebrow">한눈 요약 · 이 페이지에서 바로 확인</p></Reveal>
     <div className="on-glance">
      <div><span className="k">대회와 수상</span><p>{work.contestName}<br />{work.award}</p></div>
      {contest.facts.filter((f) => {
       if (!/접수 일정|시상|규격|개요/.test(f.label)) return false;
       // 회차가 적힌 정보는 이 작품의 연도와 같은 회차일 때만 보여 줍니다(2025 작품에 2026 일정을 보여 주지 않기 위해).
       const hint = /제35회|\(2026\)|2026/.test(f.label) ? 2026 : /제34회|\(2025\)|2025/.test(f.label) ? 2025 : null;
       return hint === null || hint === work.year;
      }).slice(0, 3).map((f) => (
       <div key={f.label}><span className="k">{f.label}</span><p>{f.value}</p></div>
      ))}
      <div><span className="k">다음에 나갈 때 확인할 점 <small>(최근 회차 기준)</small></span><ul>{contest.checkpoints.slice(0, 4).map((c) => <li key={c}>{c}</li>)}</ul></div>
      <div><span className="k">준비 기록</span><p>{work.journey ? `${durationLabel(work.journey) ? `${durationLabel(work.journey)} 준비` : '기록 있음'}${work.journey.team ? ` · ${work.journey.team}` : ''}${work.journey.steps ? ` · ${work.journey.steps.length}단계` : ''}` : '아직 기록되지 않았어요'}</p></div>
     </div>
    </section>
   )}

   {contest && (
    <section className="on-section on-two">
     <Reveal className="on-panel">
      <p className="on-eyebrow">이 대회는</p>
      <h2>{contest.name}</h2>
      <p>{contest.character}</p>
      <p className="on-small">검색 요약을 바탕으로 한 정리입니다. 지원 전에는 공식 요강에서 다시 확인해 주세요.</p>
      <Link className="on-more" href={`/onus/contests/${contest.slug}`}>대회 성격과 확인할 점 전체 보기 →</Link>
     </Reveal>
     <Reveal className="on-panel on-panel-accent" delay={80}>
      <p className="on-eyebrow">대회 성격과 이 작품의 연결 <span className="on-pill">초안 · 작성자 확인 필요</span></p>
      <h2>이 작품은 대회와 어떻게 맞닿아 있을까</h2>
      <p>{work.contestFit}</p>
      <p className="on-small">작품 설명과 공개된 대회 안내를 비교한 정리이며, 입상 이유를 말하는 것이 아닙니다. 심사평이 공개되지 않았다면 이유는 알 수 없어요.</p>
     </Reveal>
    </section>
   )}

   <section className="on-section">
    <Reveal>
     <p className="on-eyebrow">작품 보드</p>
     <h2>실제 출품한 보드를 그대로 봅니다</h2>
    </Reveal>
    <div className="on-boards">
     {work.images.map((im, i) => (
      <Reveal key={im.src}>
       <img src={im.src} alt={`${work.title} 작품 보드 ${i + 1}`} width={1600} height={Math.round(1600 * im.ratio)} loading={i === 0 ? 'eager' : 'lazy'} />
      </Reveal>
     ))}
     {work.pdf && (
      <Reveal>
       {work.images.length === 0 && <iframe className="on-pdf" src={`${work.pdf}#view=FitH`} title={`${work.title} 작품 PDF`} />}
       <p className="on-small">제출한 원본 PDF는 <a href={work.pdf} target="_blank" rel="noopener noreferrer">새 창에서 열기 ↗</a> (약 15MB)</p>
      </Reveal>
     )}
    </div>
   </section>

   <section className="on-section on-two">
    {work.journey ? (
     <Reveal className="on-panel">
      <p className="on-eyebrow">준비 과정과 경험 <span className="on-pill">작성자 기록</span></p>
      <h2>어떻게 준비했을까</h2>
      <div className="on-journey">
       <ul className="on-journey-meta">
        {durationLabel(work.journey) && <li>준비 {durationLabel(work.journey)}</li>}
        {work.journey.hours && <li>{work.journey.hours}</li>}
        {work.journey.team && <li>{work.journey.team}</li>}
        {work.journey.tools?.map((t) => <li key={t}>{t}</li>)}
       </ul>
       {work.journey.steps && (
        <ol className="on-journey-steps">
         {work.journey.steps.map((s) => (
          <li key={s.title}><strong>{s.title}</strong>{s.days ? <em>{s.days}일</em> : null}{s.detail && <p>{s.detail}</p>}</li>
         ))}
        </ol>
       )}
       {work.journey.note && <p className="on-small">{work.journey.note}</p>}
       {work.journey.tries && <p><b>시도하고 바꾼 것</b><br />{work.journey.tries}</p>}
       {work.journey.tip && <p><b>후배에게</b><br />{work.journey.tip}</p>}
      </div>
     </Reveal>
    ) : (
     <Reveal className="on-panel on-panel-empty">
      <p className="on-eyebrow">준비 과정과 경험 <span className="on-pill">아직 없음</span></p>
      <h2>작성자가 아직 기록하지 않았어요</h2>
      <p>어떤 방법으로, 어떤 시도를 하며, 얼마나 걸렸는지는 후배에게 가장 도움이 되는 정보예요. 작성자만 알 수 있는 내용이라 추측해서 채우지 않았어요. 기록이 들어오면 실행 순서와 소요 기간이 이 자리에 보여요.</p>
     </Reveal>
    )}
    <Reveal className="on-panel on-panel-empty" delay={80}>
     <p className="on-eyebrow">인증된 경험자에게 피드백 요청 <span className="on-pill">아직 없음</span></p>
     <h2>경험자 인증과 피드백 요청</h2>
     <p>수상·출품 경험을 확인하고 경험자에게 피드백을 요청하는 기능은 아직 만들지 않았어요. 지금은 아래 코멘트와 댓글로 이야기할 수 있어요.</p>
    </Reveal>
   </section>

   <section className="on-section">
    <Reveal>
     <p className="on-eyebrow">코멘트와 댓글</p>
     <h2>선배의 코멘트, 그리고 댓글</h2>
     <p className="on-section-lead">이 작품을 보고 든 생각이나 준비 과정, 질문을 코멘트로 남기고 코멘트마다 댓글로 이야기를 이어 갈 수 있어요. 보는 것은 누구나 할 수 있어요.</p>
    </Reveal>
    {comments.status === 'ok'
     ? <CommentThread targetType="work" targetId={work.slug} comments={comments.data} allowMaker title="코멘트" />
     : <div className="on-empty" role="status"><strong>코멘트를 불러오지 못했어요</strong><p>{STATE_MESSAGE[comments.status]}</p></div>}
   </section>

   {others.length > 0 && (
    <section className="on-section">
     <Reveal><p className="on-eyebrow">같은 대회</p><h2>{contest?.name}의 다른 기록</h2></Reveal>
     <ul className="on-mini-grid">
      {others.map((x) => (
       <li key={x.slug}>
        <Link href={`/onus/works/${x.slug}`} className="on-mini">
         {x.cover ? <img src={x.cover} alt="" width={900} height={1125} loading="lazy" /> : <div className="on-card-type" aria-hidden="true"><span>PDF</span></div>}
         <span className="on-mini-body"><AwardBadge award={x.award} /><strong>{x.title}</strong><em>{x.year}</em></span>
        </Link>
       </li>
      ))}
     </ul>
    </section>
   )}
  </main>
 );
}
