import type { Metadata } from 'next';
import PageHead from '@/components/onus/PageHead';
import BoardView from '@/components/onus/BoardView';

export const metadata: Metadata = { title: '나의 도전 보드', description: '담아 둔 공모전의 마감일과 준비 단계를 한곳에서 챙겨요.' };

export default function BoardPage() {
 return (
  <main id="main">
   <PageHead eyebrow="MY BOARD" title="나의 도전 보드" lead="마음에 드는 공모전을 담아 두고, 마감일과 준비 단계를 한눈에 챙기세요. 바로 쓸 수 있어요." icon="board" />
   <section className="on-section on-section-tight"><BoardView /></section>
  </main>
 );
}
