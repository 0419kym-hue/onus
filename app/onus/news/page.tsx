import type { Metadata } from 'next';
import PageHead from '@/components/onus/PageHead';
import NewsList from '@/components/onus/NewsList';
import { NEWS_CHECKED_AT, NEWS_TOPICS, sortedNews } from '@/lib/onus/news';

export const metadata: Metadata = { title: '한양여대 소식', description: '한양여자대학교의 공모전·대회와 관련된 기사를 모아 봅니다.' };

export default function NewsPage() {
 const items = sortedNews();
 return (
  <main id="main">
   <PageHead eyebrow="NEWS" title="한양여대 소식" lead="한양여자대학교의 공모전·대회와 관련된 기사를 모았어요. 제목을 누르면 원문 기사로 이동해요." icon="news" />
   <section className="on-section on-section-tight">
    {items.length === 0
     ? <div className="on-empty"><strong>아직 모은 기사가 없어요.</strong><p>기사를 찾는 대로 이곳에 채워질 예정이에요.</p></div>
     : <NewsList items={items} topics={NEWS_TOPICS} />}
    <p className="on-small on-news-note">{NEWS_CHECKED_AT} 기준으로 검색해 모은 목록이며 실시간으로 갱신되지 않아요. 요약은 읽고 다시 쓴 한 문장이고, 자세한 내용은 반드시 원문을 확인해 주세요. &lsquo;원문 미확인&rsquo;은 기사 페이지를 직접 열어 보지 못한 항목이에요.</p>
   </section>
  </main>
 );
}
