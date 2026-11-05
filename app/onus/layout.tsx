import type { Metadata } from 'next';
import Link from 'next/link';
import OnusHeader from '@/components/onus/OnusHeader';
import './onus.css';

export const metadata: Metadata = {
 title: { default: 'ON:US | 선배의 수상 경험을 후배의 다음 도전으로', template: '%s | ON:US' },
 description: '한양여자대학교 학생을 위한 공모전·대회 경험 아카이브. 선배의 실제 출품작과 대회의 성격을 한곳에서 확인합니다.',
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
     <p>한양여자대학교 AI 해커톤 프로젝트입니다. 아카이브의 작품은 제작자 본인이 제공한 수상작이며, 대회 정보는 공개 자료(검색 요약)를 바탕으로 하므로 지원 전에 반드시 공식 요강에서 다시 확인해 주세요.</p>
    </div>
    <Link href="/">HY컴퍼니 홈 ↗</Link>
   </footer>
  </div>
 );
}
