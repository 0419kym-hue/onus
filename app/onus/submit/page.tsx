import type { Metadata } from 'next';
import PageHead from '@/components/onus/PageHead';
import SubmitWorkForm from '@/components/onus/SubmitWorkForm';
import { getApprovedSubmissions } from '@/lib/onus/submissions';

export const metadata: Metadata = { title: '수상작 올리기', description: '내가 만든 수상·출품작을 올리면 운영자가 확인한 뒤 수상 아카이브에서 후배들과 공유돼요.' };

export const dynamic = 'force-dynamic';

export default async function SubmitPage() {
 const subs = await getApprovedSubmissions(); // 테이블이 아직 없으면 안내를 보여 줍니다.
 return (
  <main id="main">
   <PageHead eyebrow="SUBMIT" title="내 수상작을 올려 후배의 길잡이가 되어 주세요" lead="작품 이미지와 공모전 정보, 수상증명서를 올리면 운영자가 증명서로 수상을 확인하고, 승인된 작품이 수상 아카이브에 공개돼요. 증명서는 공개되지 않아요." icon="trophy" />
   <section className="on-section on-section-tight on-narrow-wide on-verify-wrap">
    {subs.status === 'missing-table' && <div className="on-empty" role="status"><strong>작품 올리기를 준비하고 있어요</strong><p>데이터베이스 준비가 끝나면 열려요. 그때까지 입력창은 저장되지 않아요.</p></div>}
    <SubmitWorkForm />
   </section>
  </main>
 );
}
