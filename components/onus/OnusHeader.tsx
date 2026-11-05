'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function OnusHeader() {
 const pathname = usePathname();
 const inArchive = pathname.startsWith('/onus/archive') || pathname.startsWith('/onus/works');
 const inNews = pathname.startsWith('/onus/news');
 const inContests = pathname.startsWith('/onus/contests');
 const inCommunity = pathname.startsWith('/onus/community');
 return (
  <header className="on-header">
   <div className="on-header-left">
    <Link className="on-brand" href="/onus" aria-label="ON:US 홈">
     <span className="on-brand-mark" aria-hidden="true" />ON<span className="on-brand-colon">:</span>US
    </Link>
    <span className="on-host"><img src="/onus/brand/hywoman-mark.webp" alt="한양여자대학교 로고" width={28} height={28} /><span>한양여자대학교<br />AI 해커톤</span></span>
   </div>
   <nav className="on-nav" aria-label="ON:US 메뉴">
    <Link href="/onus/archive" aria-current={inArchive ? 'page' : undefined}>수상 아카이브</Link>
    <Link href="/onus/contests" aria-current={inContests ? 'page' : undefined}>공모전</Link>
    <Link href="/onus/news" aria-current={inNews ? 'page' : undefined}>소식</Link>
    <Link href="/onus/community" aria-current={inCommunity ? 'page' : undefined}>커뮤니티</Link>
    <Link href="/onus/verify" aria-current={pathname.startsWith('/onus/verify') ? 'page' : undefined}>경험 인증</Link>
   </nav>
  </header>
 );
}
