import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommentThread from '@/components/onus/CommentThread';
import PostActions from '@/components/onus/PostActions';
import { getComments, getPost, STATE_MESSAGE } from '@/lib/onus/community';
import { CATEGORIES, authorBadge } from '@/lib/onus/community-types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '커뮤니티 글' };

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params;
 const res = await getPost(id);
 if (res.status !== 'ok') return <main id="main" className="on-detail"><Link className="on-back" href="/onus/community">← 커뮤니티</Link><div className="on-empty" role="status"><strong>글을 불러오지 못했어요</strong><p>{STATE_MESSAGE[res.status]}</p></div></main>;
 if (!res.data) notFound();
 const post = res.data;
 const cat = CATEGORIES.find((c) => c.key === post.category);
 const cm = await getComments('post', post.id);

 return (
  <main id="main" className="on-detail on-narrow">
   <Link className="on-back" href={`/onus/community?c=${post.category}`}>← {cat?.label ?? '커뮤니티'}</Link>
   <article className="on-article">
    <p className="on-eyebrow">{cat?.short} {post.status === 'closed' && <span className="on-pill on-pill-soft">마감</span>}</p>
    <h1 className="on-page-title">{post.title}</h1>
    <p className="on-post-meta">{post.nickname ?? '알 수 없음'}{authorBadge(post.author_type, post.verified_label) ? ' (' + (authorBadge(post.author_type, post.verified_label)!.verified ? '✓ ' : '') + authorBadge(post.author_type, post.verified_label)!.text + ')' : ''} · {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <ul className="on-tags on-tags-lg">{post.contest_title && <li>{post.contest_title}</li>}{post.place && <li>{post.place}</li>}</ul>
    <p className="on-article-body">{post.body}</p>
    {post.contact_url && <p><a className="on-btn on-btn-primary" href={post.contact_url} target="_blank" rel="noopener noreferrer nofollow">연락 링크 열기 ↗</a></p>}
    <PostActions id={post.id} status={post.status} category={post.category} />
   </article>
   <section className="on-section on-flush">
    {cm.status === 'ok' ? <CommentThread targetType="post" targetId={post.id} comments={cm.data} title="댓글" /> : <div className="on-empty" role="status"><p>{STATE_MESSAGE[cm.status]}</p></div>}
   </section>
  </main>
 );
}
