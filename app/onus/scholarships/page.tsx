import type { Metadata } from 'next';
import PageHead from '@/components/onus/PageHead';
import ScholarshipBoard from '@/components/onus/ScholarshipBoard';
import { SCHOLARSHIP_CHECKED_AT } from '@/lib/onus/scholarships';

export const metadata: Metadata = { title: '장학금', description: '한양여자대학교 교내 장학금과 교외 장학금을 구분해서 보고, 자가 진단으로 내가 신청해 볼 수 있는 장학금을 확인해요.' };
export const dynamic = 'force-dynamic'; // 접수 중/마감 표시를 오늘 날짜(한국 시간) 기준으로 계산합니다.

export default function ScholarshipsPage() {
 const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
 return (
  <main id="main">
   <PageHead eyebrow="SCHOLARSHIP" title="교내·교외 장학금, 한눈에 구분해서 확인해요" lead={`${SCHOLARSHIP_CHECKED_AT}에 학교와 재단의 공개 자료에서 확인한 정보예요. 누가 받을 수 있는지, 신청 기간과 방법, 확인하지 못한 점까지 함께 적었어요.`} icon="cap" />
   <section className="on-section on-section-tight">
    <ScholarshipBoard today={today} />
   </section>
  </main>
 );
}
