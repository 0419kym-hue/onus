'use client';
import Link from 'next/link';
import { AUTHOR_TYPES, type AuthorType } from '@/lib/onus/community-types';
import type { VerifStatus } from '@/lib/onus/badges';

// 닉네임과 유형. 스스로 고르는 유형은 미인증이고, 서류 승인을 받은 "인증 유형"은 따로 모아 보여 줘요.
export default function IdentityFields({ nickname, type, onNickname, onType, allowMaker, badges }: { nickname: string; type: string; onNickname: (v: string) => void; onType: (v: string) => void; allowMaker: boolean; badges: VerifStatus[] }) {
 const selfOptions = AUTHOR_TYPES.filter((t) => t.self && (allowMaker || t.key !== 'maker'));
 const approved = badges.filter((b) => b.status === 'approved');
 const pending = badges.filter((b) => b.status === 'pending').length;
 return (
  <div className="on-identity">
   <label>닉네임 (2~20자)<input value={nickname} onChange={(e) => onNickname(e.target.value)} maxLength={20} minLength={2} required placeholder="예: 공모전준비중" autoComplete="nickname" /></label>
   <label>나는
    <select value={type} onChange={(e) => onType(e.target.value as AuthorType | string)} required>
     <option value="" disabled>유형을 골라 주세요</option>
     {approved.length > 0 && <optgroup label="서류로 인증된 유형">{approved.map((b) => <option key={b.id} value={`v:${b.id}`}>{b.label ?? (b.type === 'award' ? '수상 경험 인증' : '출품 경험 인증')} ✓ 인증됨</option>)}</optgroup>}
     <optgroup label="스스로 선택 (미인증)">{selfOptions.map((t) => <option key={t.key} value={t.key}>{t.label} — {t.hint}</option>)}</optgroup>
    </select>
   </label>
   <p className="on-small">
    스스로 고르는 유형은 확인하지 않아요. 수상·출품 경험은 <Link href="/onus/verify">서류로 인증</Link>하면 &ldquo;인증됨&rdquo; 표시와 함께 쓸 수 있어요{pending > 0 ? ` (심사 중인 신청 ${pending}건)` : ''}. 실명·학번은 쓰지 마세요.
   </p>
  </div>
 );
}
