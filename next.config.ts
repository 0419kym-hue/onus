import type { NextConfig } from 'next';

// 모든 페이지에 붙는 기본 보안 헤더입니다. 인라인 스크립트가 필요한 Next.js 특성상 script-src 를 제한하는 CSP 는 쓰지 않고,
// 다른 사이트가 이 사이트를 iframe 으로 감싸거나(frame-ancestors) 플러그인·외부 base 로 악용하는 것만 막습니다.
const securityHeaders = [
 { key: 'X-Content-Type-Options', value: 'nosniff' },
 { key: 'X-Frame-Options', value: 'DENY' },
 { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
 { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
 { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
];

const config: NextConfig = {
 devIndicators: false,
 poweredByHeader: false, // 응답 헤더에 "X-Powered-By: Next.js"를 숨깁니다.
 async headers() {
  return [{ source: '/:path*', headers: securityHeaders }];
 },
};
export default config;
