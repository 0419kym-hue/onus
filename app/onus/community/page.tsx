import type { Metadata } from 'next';
import Link from 'next/link';
import PostForm from '@/components/onus/PostForm';
import { getPosts, STATE_MESSAGE } from '@/lib/onus/community';
import { CATEGORIES, isCategory, authorBadge } from '@/lib/onus/community-types';

export const metadata: Metadata = { title: '커뮤니티', description: '같이 할 사람, 모임 공간, 참가하는 학생들, 이야기를 나누는 공간입니다.' };
export const dynamic = 'force-dynamic';

const when = (iso: string) => new Date(iso).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
 const { c } = await searchParams;
 const key = isCategory(c) ? c : 'team';
 const meta = CATEGORIES.find((x) => x.key === key)!;
 const res = await getPosts(key);

 return (
  <main id="main" className="on-detail">
   <section className="on-contest-head">
    <p className="on-eyebrow">COMMUNITY</p>
    <h1>커뮤니티</h1>
    <p className="on-detail-sub">공모전을 함께 준비할 사람과 공간, 이야기를 찾아요. 보는 것도, 쓰는 것도 바로 할 수 있어요.</p>
   </section>

   <nav className="on-tabs" aria-label="커뮤니티 카테고리">
    {CATEGORIES.map((x) => <Link key={x.key} href={`/onus/community?c=${x.key}`} aria-current={x.key === key ? 'page' : undefined}>{x.label}</Link>)}
   </nav>

   <section className="on-section on-community">
    <p className="on-section-lead">{meta.desc}</p>
    <PostForm category={key} />
    {res.status !== 'ok' ? (
     <div className="on-empty" role="status"><strong>{res.status === 'missing-table' ? '커뮤니티가 아직 열리지 않았어요' : '불러오지 못했어요'}</strong><p>{STATE_MESSAGE[res.status]}</p></div>
    ) : res.data.length === 0 ? (
     <div className="on-empty"><strong>아직 글이 없어요.</strong><p>첫 글을 남겨 보세요. &ldquo;{meta.cta}&rdquo;를 눌러요.</p></div>
    ) : (
     <ul className="on-posts">
      {res.data.map((p) => (
       <li key={p.id}>
        <Link href={`/onus/community/${p.id}`} className="on-post">
         <div className="on-post-top">
          {p.status === 'closed' && <span className="on-pill on-pill-soft">마감</span>}
          {authorBadge(p.author_type, p.verified_label) && <span className={authorBadge(p.author_type, p.verified_label)!.verified ? 'on-chip on-chip-verified' : 'on-chip'}>{authorBadge(p.author_type, p.verified_label)!.verified ? '✓ ' : ''}{authorBadge(p.author_type, p.verified_label)!.text}</span>}
          {p.contest_title && <span className="on-chip">{p.contest_title}</span>}
          {p.place && <span className="on-chip">{p.place}</span>}
         </div>
         <h3>{p.title}</h3>
         <p>{p.body.length > 120 ? `${p.body.slice(0, 120)}…` : p.body}</p>
         <span className="on-post-meta">{p.nickname ?? '알 수 없음'} · {when(p.created_at)}</span>
        </Link>
       </li>
      ))}
     </ul>
    )}
   </section>
  </main>
 );
}
