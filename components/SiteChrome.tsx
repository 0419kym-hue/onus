'use client';
import { usePathname } from 'next/navigation';

// ON:US(/onus) 화면은 자체 헤더·푸터를 쓰므로 HY컴퍼니 헤더·푸터만 숨깁니다. 다른 경로는 그대로 보입니다.
export default function SiteChrome({ header, footer, children }: { header: React.ReactNode; footer: React.ReactNode; children: React.ReactNode }) {
 const pathname = usePathname();
 const own = pathname === '/onus' || pathname.startsWith('/onus/');
 return <>{!own && header}{children}{!own && footer}</>;
}
