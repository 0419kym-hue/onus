import Link from 'next/link';
import { durationLabel } from '@/lib/onus/journey';
import type { Work } from '@/lib/onus/types';

/** 아카이브 한눈에 보기: 클릭하지 않아도 연도·대회·수상·분야·준비 기록 여부를 한 표에서 비교합니다. */
export default function ArchiveOverview({ works }: { works: Work[] }) {
 return (
  <div className="on-overview">
   <table>
    <caption className="on-sr">수상 아카이브 전체 작품 비교표</caption>
    <thead><tr><th scope="col">작품</th><th scope="col">대회</th><th scope="col">수상</th><th scope="col">분야</th><th scope="col">준비 기록</th></tr></thead>
    <tbody>
     {works.map((w) => (
      <tr key={w.slug}>
       <td>
        <Link href={`/onus/works/${w.slug}`} className="on-ov-thumb">
         {w.cover ? <img src={w.cover} alt="" width={38} height={48} loading="lazy" /> : null}
         <span>{w.title}</span>
        </Link>
       </td>
       <td><Link href={`/onus/contests/${w.contestSlug}`}>{w.contestName}</Link></td>
       <td><span className="on-chip">{w.award}</span></td>
       <td>{w.fields.slice(0, 3).join(' · ')}</td>
       <td className="on-ov-rec">
        {w.journey ? <><b>{durationLabel(w.journey) ?? '기록 있음'}</b>{w.journey.team ? ` · ${w.journey.team}` : ''}{w.journey.steps ? ` · ${w.journey.steps.length}단계` : ''}</> : '아직 없음'}
       </td>
      </tr>
     ))}
    </tbody>
   </table>
  </div>
 );
}
