export default function Loading() {
 return <main id="main" className="career" aria-busy="true">
  <header className="career-hero"><p className="eyebrow"><span /> MY CAREER ANALYSIS</p><h1>나의 채용 분석</h1><p className="career-lead">공고를 불러오는 중이에요…</p></header>
  <div className="cb-skeleton" role="status" aria-label="불러오는 중"><span /><span /><span /><span /></div>
 </main>;
}
