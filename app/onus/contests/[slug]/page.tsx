import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AwardBadge from '@/components/onus/AwardBadge';
import Reveal from '@/components/onus/Reveal';
import { allContests, getContest, worksOfContest } from '@/lib/onus/data';

export function generateStaticParams() {
 return allContests.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
 const { slug } = await params;
 const c = getContest(slug);
 return c ? { title: `${c.name} 대회 성격`, description: c.tagline } : { title: '대회를 찾을 수 없어요' };
}

export default async function ContestPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const contest = getContest(slug);
 if (!contest) notFound();
 const list = worksOfContest(contest.slug);

 return (
  <main id="main" className="on-detail">
   <Link className="on-back" href="/onus/contests">← 공모전</Link>

   <section className="on-contest-head">
    <p className="on-eyebrow">CONTEST · {contest.editions.map((e) => e.year).join(' · ')}</p>
    <h1>{contest.name}</h1>
    <p className="on-detail-sub">{contest.tagline}</p>
    <ul className="on-editions">{contest.editions.map((e) => <li key={e.name}>{e.name}</li>)}</ul>
   </section>

   <section className="on-section on-two">
    <Reveal className="on-panel">
     <p className="on-eyebrow">대회의 성격</p>
     <h2>어떤 대회인가요</h2>
     <p>{contest.character}</p>
    </Reveal>
    <Reveal className="on-panel on-panel-accent" delay={80}>
     <p className="on-eyebrow">지원 전에 공식 요강에서 확인할 것</p>
     <h2>체크해 둘 점</h2>
     <ul className="on-list">{contest.checkpoints.map((c) => <li key={c}>{c}</li>)}</ul>
    </Reveal>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">확인된 정보</p><h2>자료에서 확인한 내용</h2></Reveal>
    <dl className="on-facts">
     {contest.facts.map((f) => (
      <Reveal key={f.label} className="on-fact">
       <dt>{f.label}</dt>
       <dd>{f.value}<span className="on-basis">{f.basis}</span></dd>
      </Reveal>
     ))}
    </dl>
    <Reveal className="on-unknown">
     <h3>확인하지 못한 것</h3>
     <ul className="on-list">{contest.unknown.map((u) => <li key={u}>{u}</li>)}</ul>
    </Reveal>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">이 대회의 기록</p><h2>선배의 출품작 {list.length}개</h2></Reveal>
    <ul className="on-mini-grid">
     {list.map((x) => (
      <li key={x.slug}>
       <Link href={`/onus/works/${x.slug}`} className="on-mini">
        {x.cover ? <img src={x.cover} alt="" width={900} height={1125} loading="lazy" /> : <div className="on-card-type" aria-hidden="true"><span>PDF</span></div>}
        <span className="on-mini-body"><AwardBadge award={x.award} /><strong>{x.title}</strong><em>{x.contestName.match(/^\d{4}/)?.[0]}</em></span>
       </Link>
      </li>
     ))}
    </ul>
   </section>

   <section className="on-section">
    <Reveal>
     <p className="on-eyebrow">출처</p>
     <h2>이 정보를 확인한 곳</h2>
     <ul className="on-list on-sources">
      {contest.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a></li>)}
     </ul>
     <p className="on-small">웹 검색 요약을 바탕으로 정리했고 원문 페이지를 모두 열어 본 것은 아닙니다. 접수 일정, 규격, 상금은 반드시 공식 요강에서 다시 확인해 주세요.</p>
    </Reveal>
   </section>
  </main>
 );
}
