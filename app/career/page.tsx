import type { Metadata } from 'next';
import CareerBoard from '@/components/CareerBoard';
import { getCareerJobs } from '@/lib/careerly';
export const metadata: Metadata = { title: '나의 채용 분석' };
export const dynamic = 'force-dynamic';
export default async function CareerPage() {
 const result = await getCareerJobs();
 return <main id="main" className="career">
  <header className="career-hero"><p className="eyebrow"><span /> MY CAREER ANALYSIS</p><h1>나의 채용 분석</h1><p className="career-lead">신입이 지원할 수 있는 공고를 <em>지역·직군·경력 조건</em>으로 좁혀 보고, 한눈에 비교해요.</p></header>
  {result.status === 'ok' && <CareerBoard jobs={result.jobs} datasetVersion={result.datasetVersion} />}
  {result.status === 'empty' && <div className="empty" role="status"><h3>저장된 공고 데이터가 아직 없어요.</h3><p>careerly_jobs 테이블에 공고를 저장하면 이곳에 표시됩니다. 가상 공고로 대신 채우지 않습니다.</p></div>}
  {result.status === 'error' && <div className="error-box" role="alert"><h3>공고 연결을 확인해 주세요.</h3><p>{result.message}</p><a href="/career">다시 불러오기 ↗</a></div>}
 </main>;
}
