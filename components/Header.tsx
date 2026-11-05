'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Header() {
 const pathname = usePathname();
 const onCareer = pathname === '/career' || pathname.startsWith('/career/');
 return <header className="site-header"><Link className="brand" href="/" aria-label="HY컴퍼니 홈"><span className="brand-icon">HY</span><span>HY COMPANY<span className="brand-caption">작은 가능성, 더 큰 시작.</span></span></Link><nav aria-label="주 메뉴"><Link href="/#about">우리가 일하는 방식</Link><Link href="/career" aria-current={onCareer ? 'page' : undefined}>나의 채용 분석</Link><Link className="nav-cta" href="/#positions">함께할 기회 <span aria-hidden="true">↗</span></Link></nav></header>;
}
