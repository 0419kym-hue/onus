'use client';
import { useMemo, useState } from 'react';
import type { CareerJob } from '@/lib/careerly-types';

const ALL = '전체';
const NO_REGION = '지역 미기재';
const PAGE_SIZE = 12;
const REGION_CHIPS = 8;
const CHART_ROWS = 8;
const KIND_LABEL: Record<string, string> = { entry: '신입', intern: '인턴', experienced: '경력 포함' };

function kindLabel(j: CareerJob) { return j.kind ? (KIND_LABEL[j.kind] ?? j.kind) : '미확인'; }
function expText(j: CareerJob) {
 const { min_experience_years: a, max_experience_years: b } = j;
 if (a == null && b == null) return '경력 조건 미확인';
 if (b == null) return `${a}년 이상`;
 return `${a ?? 0}~${b}년`;
}
function regionsOf(j: CareerJob) { return j.regions.length ? j.regions : [NO_REGION]; }
function safeUrl(raw: string): string | null {
 try { const u = new URL(raw); return u.protocol === 'https:' || u.protocol === 'http:' ? raw : null; } catch { return null; }
}
function asOf(version: string) {
 const m = version.match(/-(\d{4})(\d{2})(\d{2})-/);
 return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}
function countBy(values: string[]) {
 const m = new Map<string, number>();
 values.forEach(v => m.set(v, (m.get(v) ?? 0) + 1));
 return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'));
}
function initial(company: string) {
 const t = company.replace(/^\(주\)|^주식회사\s*|\(주\)$/g, '').trim();
 return (t.charAt(0) || '·').toUpperCase();
}
function hue(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }
function deadlineText(d: string | null) { return d ? `마감 ${d.slice(0, 10)}` : '마감일은 원문에서 확인'; }

type Chip = { value: string; count: number };

export default function CareerBoard({ jobs, datasetVersion }: { jobs: CareerJob[]; datasetVersion: string }) {
 const [category, setCategory] = useState(ALL);
 const [region, setRegion] = useState(ALL);
 const [kind, setKind] = useState(ALL);
 const [shown, setShown] = useState(PAGE_SIZE);
 const [moreRegions, setMoreRegions] = useState(false);
 const [allBars, setAllBars] = useState(false);

 const matches = (j: CareerJob, c: string, r: string, k: string) =>
  (c === ALL || j.categories.includes(c)) && (r === ALL || regionsOf(j).includes(r)) && (k === ALL || kindLabel(j) === k);

 // 목록·공고 수·차트·요약 타일은 모두 이 filtered(전체 결과) 한 곳에서 계산합니다. 첫 페이지만 세지 않습니다.
 const filtered = useMemo(() => jobs.filter(j => matches(j, category, region, kind)), [jobs, category, region, kind]);

 // 칩의 건수는 "다른 두 조건을 유지한 채 이 칩을 눌렀을 때"의 공고 수입니다.
 const facets = useMemo(() => {
  const mk = (pick: (j: CareerJob) => string[], skip: 'c' | 'r' | 'k'): Chip[] => {
   const base = jobs.filter(j => matches(j, skip === 'c' ? ALL : category, skip === 'r' ? ALL : region, skip === 'k' ? ALL : kind));
   return countBy(base.flatMap(pick)).map(([value, count]) => ({ value, count }));
  };
  const totalOf = (skip: 'c' | 'r' | 'k') => jobs.filter(j => matches(j, skip === 'c' ? ALL : category, skip === 'r' ? ALL : region, skip === 'k' ? ALL : kind)).length;
  return {
   categories: mk(j => j.categories, 'c'), regions: mk(regionsOf, 'r'), kinds: mk(j => [kindLabel(j)], 'k'),
   totals: { c: totalOf('c'), r: totalOf('r'), k: totalOf('k') },
  };
 }, [jobs, category, region, kind]);

 const chart = useMemo(() => countBy(filtered.flatMap(regionsOf)), [filtered]);
 const maxCount = chart[0]?.[1] ?? 1;
 const multiCount = filtered.filter(j => j.regions.length > 1).length;
 const noRegionCount = filtered.filter(j => j.regions.length === 0).length;
 const entryN = filtered.filter(j => kindLabel(j) === '신입').length;
 const internN = filtered.filter(j => kindLabel(j) === '인턴').length;
 const visible = filtered.slice(0, shown);
 const date = asOf(datasetVersion);
 const allEntry = jobs.every(j => j.entry_level === true);

 const regionChips = useMemo(() => {
  const all = facets.regions;
  if (moreRegions) return all;
  const top = all.slice(0, REGION_CHIPS);
  const sel = all.find(c => c.value === region);
  return sel && !top.includes(sel) ? [...top, sel] : top;
 }, [facets.regions, moreRegions, region]);
 const barRows = allBars ? chart : chart.slice(0, CHART_ROWS);

 const pick = (set: (v: string) => void, v: string) => { set(v); setShown(PAGE_SIZE); };
 const reset = () => { setCategory(ALL); setRegion(ALL); setKind(ALL); setShown(PAGE_SIZE); };
 const filtering = category !== ALL || region !== ALL || kind !== ALL;

 const chipGroup = (label: string, current: string, set: (v: string) => void, total: number, chips: Chip[], extra?: React.ReactNode) =>
  <div className="cf-group" role="group" aria-label={label}>
   <span className="cf-label">{label}</span>
   <div className="cf-chips">
    <button type="button" aria-pressed={current === ALL} onClick={() => pick(set, ALL)}>{ALL}<em>{total}</em></button>
    {chips.map(c => <button type="button" key={c.value} aria-pressed={current === c.value} onClick={() => pick(set, c.value)}>{c.value}<em>{c.count}</em></button>)}
    {extra}
   </div>
  </div>;

 return <>
  <p className="cb-meta"><span className="cb-dot" aria-hidden="true" />저장된 공고 <strong>{jobs.length}건</strong> · 기준일 {date ?? '확인 필요'} · {allEntry ? '신입 가능 공고' : '공고별 경력 조건 참고'} · 데이터 버전 <code>{datasetVersion}</code></p>

  <section className="cb-stats" aria-label="현재 조건 요약">
   <div className="cb-stat cb-stat-main"><span>조건에 맞는 공고</span><strong>{filtered.length}<small>건</small></strong><p>전체 {jobs.length}건 중</p></div>
   <div className="cb-stat"><span>가장 많은 지역</span><strong className="cb-stat-text">{chart[0]?.[0] ?? '-'}</strong><p>{chart[0] ? `${chart[0][1]}건` : '해당 없음'}</p></div>
   <div className="cb-stat"><span>신입</span><strong>{entryN}<small>건</small></strong><p>경력 조건 기준</p></div>
   <div className="cb-stat"><span>인턴</span><strong>{internN}<small>건</small></strong><p>경력 조건 기준</p></div>
  </section>

  <section className="cf" aria-label="공고 조건 선택">
   {chipGroup('직군', category, setCategory, facets.totals.c, facets.categories)}
   {chipGroup('지역', region, setRegion, facets.totals.r, regionChips, facets.regions.length > REGION_CHIPS && <button type="button" className="cf-more" onClick={() => setMoreRegions(v => !v)}>{moreRegions ? '지역 접기' : `지역 ${facets.regions.length - REGION_CHIPS}곳 더 보기`}</button>)}
   {chipGroup('경력 조건', kind, setKind, facets.totals.k, facets.kinds)}
   <div className="cf-foot">
    <p className="result-count" aria-live="polite">조건에 맞는 공고 <strong>{filtered.length}</strong>건 (전체 {jobs.length}건 중)</p>
    {filtering && <button type="button" className="cf-reset" onClick={reset}>조건 초기화</button>}
   </div>
  </section>

  <section className="cb-chart" aria-label="지역별 공고 분포">
   <div className="cb-chart-head"><h2>지역별 분포</h2><span>현재 조건 기준 · 전체 결과 집계</span></div>
   {chart.length ? <ul>{barRows.map(([name, n], i) => <li key={name}><span className="bar-label">{name}</span><span className="bar-track"><span className="bar-fill" style={{ width: `${Math.max((n / maxCount) * 100, 2)}%`, animationDelay: `${i * 40}ms` }} /></span><span className="bar-num">{n}</span></li>)}</ul> : <p className="cb-note">표시할 공고가 없어요.</p>}
   {chart.length > CHART_ROWS && <button type="button" className="cf-more" onClick={() => setAllBars(v => !v)}>{allBars ? '상위 지역만 보기' : `전체 ${chart.length}개 지역 보기`}</button>}
   <p className="cb-note">집계 기준: 여러 지역이 적힌 공고는 지역마다 1건씩 세어 막대 합계가 공고 수보다 클 수 있어요(현재 조건에서 {multiCount}건). 지역이 비어 있는 공고는 “{NO_REGION}”으로 묶어요({noRegionCount}건).</p>
  </section>

  {filtered.length === 0
   ? <div className="empty cb-empty" role="status"><strong>선택한 조건에 맞는 공고가 없어요.</strong><p>조건을 바꾸거나 초기화해 보세요.</p><button type="button" className="cf-reset" onClick={reset}>조건 초기화</button></div>
   : <><div className="cc-grid">{visible.map(j => { const href = safeUrl(j.url); const h = hue(j.company); return <article className="cc" key={`${j.dataset_version}-${j.job_id}`}>
    <div className="cc-top"><span className="cc-logo" aria-hidden="true" style={{ background: `hsl(${h} 70% 94%)`, color: `hsl(${h} 45% 36%)` }}>{initial(j.company)}</span><div><p className="cc-company">{j.company}</p><p className="cc-sub">{j.categories.join(' · ') || '직군 미확인'}</p></div><span className={'cc-kind cc-kind-' + (j.kind ?? 'na')}>{kindLabel(j)}</span></div>
    <h3>{j.title}</h3>
    <p className="cc-summary">{j.summary ?? '요약 없음'}</p>
    {j.skills.length > 0 && <div className="cc-tags">{j.skills.slice(0, 6).map(t => <span key={t}>{t}</span>)}</div>}
    <dl className="cc-meta"><div><dt>지역</dt><dd>{j.regions.join(', ') || NO_REGION}</dd></div><div><dt>경력</dt><dd>{expText(j)}</dd></div><div><dt>마감</dt><dd>{deadlineText(j.deadline).replace('마감 ', '')}</dd></div></dl>
    {href ? <a className="cc-link" href={href} target="_blank" rel="noopener noreferrer">공고 원문 보기 <span aria-hidden="true">↗</span></a> : <span className="cb-note">링크 확인 필요</span>}
   </article>; })}</div>
   <p className="cb-note cb-count">{filtered.length}건 중 {visible.length}건 표시</p>
   {visible.length < filtered.length && <button type="button" className="cb-more" onClick={() => setShown(s => s + PAGE_SIZE)}>공고 더 보기</button>}</>}
  <p className="cb-note cb-foot">경력·지역은 정규화된 값이고 요약은 AI 분석입니다. 학력·졸업 시점 같은 최종 지원 조건과 마감은 공고 원문에서 확인해 주세요.</p>
 </>;
}
