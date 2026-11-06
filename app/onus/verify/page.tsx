import type { Metadata } from 'next';
import Link from 'next/link';
import VerifyForm from '@/components/onus/VerifyForm';

export const metadata: Metadata = { title: '경험 인증', description: '수상 증명서나 출품 확인서를 올려 수상·출품 경험을 인증합니다.' };

export default function VerifyPage() {
 return (
  <main id="main" className="on-detail on-narrow">
   <p className="on-eyebrow">VERIFY</p>
   <h1 className="on-page-title">수상·출품 경험 인증</h1>
   <p className="on-detail-sub">서류를 올리면 운영자가 확인하고 승인해요. 승인되면 댓글과 글에 &ldquo;인증됨&rdquo; 표시와 함께 수상 경험자·출품 경험자로 남길 수 있어요. 확인 절차와 한계는 <Link className="on-inline-link" href="/onus/policy">운영·인증 정책</Link>에 적었어요.</p>
   <div className="on-verify-wrap"><VerifyForm /></div>
  </main>
 );
}
