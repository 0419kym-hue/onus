import type { Metadata } from 'next';
import AdminReview from '@/components/onus/AdminReview';

export const metadata: Metadata = { title: '운영자 심사' };

export default function AdminPage() {
 return (
  <main id="main" className="on-detail on-narrow">
   <p className="on-eyebrow">ADMIN</p>
   <h1 className="on-page-title">경험 인증 심사</h1>
   <p className="on-detail-sub">서류를 열어 대회·연도·등급이 맞는지 확인하고 승인하거나 반려해요. 결정이 저장되면 서류 파일은 삭제돼요.</p>
   <div className="on-verify-wrap"><AdminReview /></div>
  </main>
 );
}
