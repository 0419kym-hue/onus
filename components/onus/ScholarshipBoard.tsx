'use client';
import { useMemo, useState } from 'react';
import { DEFAULT_PROFILE, OVERLAP_NOTE, evaluate, scholarships, type Profile, type Scholarship, type Verdict } from '@/lib/onus/scholarships';

type Opt<T extends string> = { v: T; t: string };
const Q: { key: keyof Profile; label: string; hint?: string; opts: Opt<string>[] }[] = [
 { key: 'nationality', label: '국적', opts: [{ v: 'kr', t: '대한민국 국적' }, { v: 'foreign', t: '외국 국적' }] },
 { key: 'status', label: '학적', opts: [{ v: 'enrolled', t: '재학 중 (복학 예정 포함)' }, { v: 'new', t: '신입생·편입생 (첫 학기)' }, { v: 'leave', t: '휴학 중' }] },
 { key: 'score', label: '직전 학기 성적 (100점 환산)', hint: '4.5 만점 기준 3.5 안팎이 80점, 1.5가 70점이에요', opts: [{ v: 'high', t: '80점 이상' }, { v: 'mid', t: '70~79점' }, { v: 'low', t: '70점 미만' }, { v: 'na', t: '해당 없음 (신입생)' }] },
 { key: 'credits12', label: '직전 학기에 12학점 이상 이수했나요?', opts: [{ v: 'yes', t: '네' }, { v: 'no', t: '아니요' }, { v: 'na', t: '해당 없음 (신입생)' }] },
 { key: 'income', label: '학자금 지원구간 (소득 구간)', hint: '한국장학재단 누리집에서 확인할 수 있어요', opts: [{ v: 'basic', t: '기초·차상위' }, { v: 'b1_3', t: '1~3구간' }, { v: 'b4_8', t: '4~8구간' }, { v: 'b9', t: '9구간' }, { v: 'b10', t: '10구간' }, { v: 'unknown', t: '모르겠어요' }] },
 { key: 'freshman', label: '이번에 정규 등록하는 1학년인가요?', opts: [{ v: 'yes', t: '네' }, { v: 'no', t: '아니요' }] },
 { key: 'workedAfterHS', label: '고등학교 졸업 후 직장에 다닌 적이 있나요? (2년 이상, 중소·중견기업은 1년 이상)', opts: [{ v: 'yes', t: '네' }, { v: 'no', t: '아니요' }] },
 { key: 'lowIncomeFamily', label: '차상위계층 등 가정형편이 어려운 편인가요?', opts: [{ v: 'yes', t: '네' }, { v: 'no', t: '아니요' }] },
 { key: 'disability', label: '장애가 있나요? (장애 학생 감면 대상)', opts: [{ v: 'yes', t: '네' }, { v: 'no', t: '아니요' }] },
 { key: 'multicultural', label: '다문화가족 학생인가요?', opts: [{ v: 'yes', t: '네' }, { v: 'no', t: '아니요' }] },
 { key: 'staffChild', label: '학교 교직원의 직계자녀인가요?', opts: [{ v: 'yes', t: '네' }, { v: 'no', t: '아니요' }] },
];
const VERDICT: Record<Verdict, { label: string; cls: string }> = {
 ok: { label: '신청해 볼 수 있어요', cls: 'ok' },
 check: { label: '조건 확인이 필요해요', cls: 'check' },
 no: { label: '지금은 조건이 맞지 않아요', cls: 'no' },
};
const ORDER: Record<Verdict, number> = { ok: 0, check: 1, no: 2 };

function Card({ s, today, result }: { s: Scholarship; today: string; result?: { verdict: Verdict; headline: string } }) {
 const open = !!s.periodEnd && s.periodEnd >= today;
 return (
  <li className="on-sch-card" data-kind={s.kind}>
   <div className="on-sch-top">
    <span className={`on-sch-kind ${s.kind === '교내' ? 'in' : 'out'}`}>{s.kind} 장학금</span>
    {s.periodEnd ? <span className={`on-sch-state ${open ? 'open' : ''}`}>{open ? '접수 중' : '최근 접수 마감'}</span> : <span className="on-sch-state">일정은 공고 확인</span>}
    {result && <span className={`on-verdict ${VERDICT[result.verdict].cls}`}>{VERDICT[result.verdict].label}</span>}
   </div>
   <h3>{s.name}</h3>
   <p className="on-sch-provider">{s.provider}</p>
   <p className="on-sch-sum">{s.summary}</p>
   <dl className="on-sch-dl">
    <div><dt>누가 받을 수 있나요</dt><dd><ul>{s.who.map((w) => <li key={w}>{w}</li>)}</ul></dd></div>
    <div><dt>지원 내용</dt><dd>{s.amount}</dd></div>
    <div><dt>신청 기간</dt><dd>{s.period}</dd></div>
    <div><dt>신청 방법</dt><dd>{s.apply}</dd></div>
   </dl>
   {s.unknown.length > 0 && <p className="on-sch-unknown"><b>확인하지 못한 것</b> {s.unknown.join(' · ')}</p>}
   <div className="on-sch-foot">
    <a className="on-btn on-btn-primary" href={s.url} target="_blank" rel="noopener noreferrer">{s.urlLabel} ↗</a>
    <span className="on-small">근거: {s.basis}</span>
   </div>
  </li>
 );
}

export default function ScholarshipBoard({ today }: { today: string }) {
 const [p, setP] = useState<Profile>(DEFAULT_PROFILE);
 const [done, setDone] = useState(false);
 const [tab, setTab] = useState<'all' | '교내' | '교외'>('all');
 const results = useMemo(() => evaluate(p), [p]);
 const byId = useMemo(() => new Map(results.map((r) => [r.id, r])), [results]);
 const sorted = useMemo(() => [...results].sort((a, b) => ORDER[a.verdict] - ORDER[b.verdict]), [results]);
 const count = (v: Verdict) => results.filter((r) => r.verdict === v).length;
 const list = scholarships.filter((s) => tab === 'all' || s.kind === tab);
 const inList = list.filter((s) => s.kind === '교내');
 const outList = list.filter((s) => s.kind === '교외');
 const nameOf = (id: string) => scholarships.find((s) => s.id === id)?.name ?? id;
 const kindOf = (id: string) => scholarships.find((s) => s.id === id)?.kind ?? '';

 return (
  <div>
   <section className="on-test" aria-label="장학금 자가 진단">
    <div className="on-test-head">
     <span className="on-test-badge">1분 자가 진단</span>
     <h2>나도 받을 수 있을까?</h2>
     <p className="on-section-lead">몇 가지만 고르면 아래 장학금 중 내가 신청해 볼 수 있는 것을 알려 줘요. AI가 아니라 공고의 조건을 그대로 비교하는 <b>규칙 기반 진단</b>이라, 결과는 참고용이고 최종 자격은 꼭 공식 공고에서 확인해 주세요. 입력한 내용은 저장하지 않아요.</p>
    </div>
    <form className="on-test-form" onSubmit={(e) => { e.preventDefault(); setDone(true); document.getElementById('on-test-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
     {Q.map((q) => (
      <fieldset key={q.key} className="on-q">
       <legend>{q.label}{q.hint && <em>{q.hint}</em>}</legend>
       <div className="on-chips" role="radiogroup" aria-label={q.label}>
        {q.opts.map((o) => <button type="button" key={o.v} role="radio" aria-checked={p[q.key] === o.v} aria-pressed={p[q.key] === o.v} onClick={() => { setP({ ...p, [q.key]: o.v }); setDone(false); }}>{o.t}</button>)}
       </div>
      </fieldset>
     ))}
     <div className="on-cta"><button className="on-btn on-btn-primary" type="submit">결과 보기</button><button className="on-btn" type="button" onClick={() => { setP(DEFAULT_PROFILE); setDone(false); }}>처음부터 다시</button></div>
    </form>

    <div id="on-test-result" aria-live="polite">
     {done && (
      <div className="on-test-out">
       <p className="on-test-sum"><b>신청해 볼 수 있어요 {count('ok')}개</b> · 조건 확인이 필요해요 {count('check')}개 · 지금은 맞지 않아요 {count('no')}개</p>
       <ul className="on-test-list">
        {sorted.map((r) => (
         <li key={r.id} className={`on-test-item ${r.verdict}`}>
          <div className="on-test-item-top"><span className={`on-sch-kind ${kindOf(r.id) === '교내' ? 'in' : 'out'}`}>{kindOf(r.id)}</span><strong>{nameOf(r.id)}</strong><span className={`on-verdict ${VERDICT[r.verdict].cls}`}>{r.headline}</span></div>
          <ul>{r.reasons.map((x, i) => <li key={i} data-ok={x.ok === null ? 'check' : String(x.ok)}><span aria-hidden="true">{x.ok === null ? '!' : x.ok ? '✓' : '✕'}</span>{x.text}</li>)}</ul>
         </li>
        ))}
       </ul>
       <p className="on-small">이 진단은 2026-11-06에 확인한 공개 자료의 조건을 그대로 비교한 것이에요. 학교 선발 기준(점수·인원)처럼 확인하지 못한 조건은 "확인 필요"로 표시했어요.</p>
      </div>
     )}
    </div>
   </section>

   <section className="on-section on-section-tight" aria-label="장학금 목록">
    <div className="on-sch-tabs" role="tablist" aria-label="장학금 구분">
     {([['all', '전체'], ['교내', '교내 장학금'], ['교외', '교외 장학금']] as const).map(([k, t]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{t}</button>)}
    </div>
    <div className="on-kind-note">
     <div><span className="on-sch-kind in">교내</span> 한양여자대학교가 지급하는 장학금 · 학교 장학공지에서 신청</div>
     <div><span className="on-sch-kind out">교외</span> 한국장학재단·지자체·기업 등 학교 밖 기관이 지급하는 장학금 · 해당 기관에 신청</div>
    </div>
    {inList.length > 0 && (<><h2 className="on-sch-h">교내 장학금 <small>한양여자대학교</small></h2><ul className="on-sch-grid">{inList.map((s) => <Card key={s.id} s={s} today={today} result={done ? byId.get(s.id) : undefined} />)}</ul></>)}
    {outList.length > 0 && (<><h2 className="on-sch-h">교외 장학금 <small>학교 밖 기관</small></h2><ul className="on-sch-grid">{outList.map((s) => <Card key={s.id} s={s} today={today} result={done ? byId.get(s.id) : undefined} />)}</ul></>)}
    <p className="on-sch-overlap"><b>중복 수혜</b> {OVERLAP_NOTE}</p>
   </section>
  </div>
 );
}
