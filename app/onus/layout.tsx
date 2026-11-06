import type { Metadata } from 'next';
import Link from 'next/link';
import OnusHeader from '@/components/onus/OnusHeader';
import './onus.css';
import './onus-redesign.css';
import './onus-toss.css';
import './onus-editorial.css';

export const metadata: Metadata = {
 title: { default: 'ON:US | 우리의 도전에 불을 켜다', template: '%s | ON:US' },
 description: '한양여자대학교 공모전·대회 플랫폼. 선배의 수상작, 접수 중인 공모전, 학교 소식을 한곳에서 만나요.',
};

export default function OnusLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return (
  <div className="onus">
   <OnusHeader />
   {children}
   <footer className="on-footer">
    <div>
     <strong className="on-footer-brand">ON<span>:</span>US</strong>
     <img className="on-footer-logo" src="/onus/brand/hywoman-horizontal.webp" alt="한양여자대학교" width={320} height={68} loading="lazy" />
     <p>한양여자대학교 AI 해커톤 프로젝트입니다. 아카이브의 작품은 제작자 본인이 제공한 수상작이며, 대회 정보는 공개 자료(검색 요약)를 바탕으로 하므로 지원 전에 반드시 공식 요강에서 다시 확인해 주세요. 마스코트 하이유 크루(나리·나래·빛나리) © Hanyang Women&apos;s University.</p>
    </div>
    <span className="on-footer-links"><Link href="/onus/about">서비스 소개</Link><Link href="/onus/policy">운영·인증 정책</Link><Link href="/">HY컴퍼니 홈 ↗</Link></span>
   </footer>
  </div>
 );
}
