// 서비스 아이콘(직접 그린 단순한 선 아이콘). 장식용이라 스크린리더에서는 숨깁니다.
const base = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export type IconName = 'archive' | 'trophy' | 'news' | 'chat' | 'badge' | 'spark' | 'board';

export default function Icon({ name }: { name: IconName }) {
 switch (name) {
  case 'archive': return <svg {...base}><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5-5-8 9" /></svg>;
  case 'trophy': return <svg {...base}><path d="M8 4h8v5a4 4 0 0 1-8 0V4z" /><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4" /><path d="M12 13v4M8 21h8M10 17h4" /></svg>;
  case 'news': return <svg {...base}><rect x="4" y="4" width="14" height="16" rx="2.5" /><path d="M18 9h2v9a2 2 0 0 1-2 2M8 8h6M8 12h6M8 16h4" /></svg>;
  case 'spark': return <svg {...base}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></svg>;
  case 'board': return <svg {...base}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9l2 2 3-3M8 15h8" /></svg>;
  case 'chat': return <svg {...base}><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-7z" /><path d="M8.5 9h7M8.5 12h4" /></svg>;
  case 'badge': return <svg {...base}><path d="M12 3l2.4 1.4 2.8.1 1.4 2.4 2.4 1.4-.1 2.8L22 13l-1.4 2.4-.1 2.8-2.4 1.4-1.4 2.4-2.8-.1L12 23l-2.4-1.4-2.8.1-1.4-2.4L3 18.2l.1-2.8L2 13l1.4-2.4.1-2.8L5.9 6.4 7.3 4l2.8.1L12 3z" transform="scale(.9) translate(1.3 -.6)" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></svg>;
 }
}
