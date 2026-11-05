'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authorBadge, type Comment } from '@/lib/onus/community-types';
import { useMyVerifs } from '@/lib/onus/badges';
import { forgetKey, getKey, newId, newKey, rememberKey, saveIdentity, useIdentity, useOwnedKeys } from '@/lib/onus/anon';
import { getBrowserClient } from '@/lib/onus/supabase-browser';
import IdentityFields from './IdentityFields';

const when = (iso: string) => new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
const errText = (code?: string) => code === 'P0001' ? '잠깐 글이 몰리고 있어요. 1분 뒤에 다시 남겨 주세요.' : code === 'P0002' || code === 'P0003' ? '인증이 확인되지 않아 이 유형으로는 남길 수 없어요. 인증 승인 상태를 확인해 주세요.' : code === '42703' || code === 'PGRST205' ? '댓글 기능이 아직 DB에 준비되지 않았어요.' : '남기지 못했어요. 닉네임과 유형, 내용을 확인해 주세요.';

function Composer({ targetType, targetId, parentId, allowMaker, placeholder, onDone }: { targetType: 'work' | 'post'; targetId: string; parentId: string | null; allowMaker: boolean; placeholder: string; onDone: () => void }) {
 const router = useRouter();
 const { identity } = useIdentity();
 const { items: badges } = useMyVerifs();
 const [nickname, setNickname] = useState('');
 const [type, setType] = useState('');
 const [body, setBody] = useState('');
 const [busy, setBusy] = useState(false);
 const [msg, setMsg] = useState<string | null>(null);
 useEffect(() => { if (identity) { setNickname(identity.nickname); setType(identity.type.startsWith('v:') && !badges.some((b) => 'v:' + b.id === identity.type && b.status === 'approved') ? '' : identity.type); } }, [identity, badges]);

 async function submit(e: React.FormEvent) {
  e.preventDefault(); setMsg(null);
  const sb = getBrowserClient();
  if (!sb) { setMsg('Supabase 연결 설정이 없어 남길 수 없어요.'); return; }
  if (!type) { setMsg('나는 어떤 사람인지 유형을 골라 주세요.'); return; }
  let authorType = type; let verification: { verification_id: string; verification_key: string } | null = null;
  if (type.startsWith('v:')) {
   const b = badges.find((x) => 'v:' + x.id === type && x.status === 'approved');
   if (!b) { setMsg('승인된 인증을 찾지 못했어요.'); return; }
   authorType = b.type; verification = { verification_id: b.id, verification_key: b.key };
  }
  setBusy(true);
  const id = newId(); const key = newKey();
  const { error } = await sb.from('onus_comments').insert({ id, target_type: targetType, target_id: targetId, parent_id: parentId, body: body.trim(), nickname: nickname.trim(), author_type: authorType, edit_key: key, ...(verification ?? {}) });
  setBusy(false);
  if (error) { setMsg(errText(error.code)); return; }
  rememberKey(id, key); saveIdentity({ nickname: nickname.trim(), type });
  setBody(''); onDone(); router.refresh();
 }
 return (
  <form className="on-form on-cform" onSubmit={submit}>
   <IdentityFields nickname={nickname} type={type} onNickname={setNickname} onType={setType} allowMaker={allowMaker} badges={badges} />
   <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} rows={3} required placeholder={placeholder} aria-label={placeholder} />
   <div className="on-cta"><button className="on-btn on-btn-primary" disabled={busy || !body.trim()}>{busy ? '남기는 중…' : '남기기'}</button></div>
   {msg && <p className="on-msg" role="alert">{msg}</p>}
  </form>
 );
}

export default function CommentThread({ targetType, targetId, comments, allowMaker = false, title }: { targetType: 'work' | 'post'; targetId: string; comments: Comment[]; allowMaker?: boolean; title: string }) {
 const router = useRouter();
 const [replyTo, setReplyTo] = useState<string | null>(null);
 const owned = useOwnedKeys(comments.map((c) => c.id));
 const roots = comments.filter((c) => c.parent_id === null);
 const replies = (id: string) => comments.filter((c) => c.parent_id === id);

 async function remove(id: string) {
  if (!window.confirm('이 글을 삭제할까요? 달린 답글도 함께 삭제돼요.')) return;
  const key = getKey(id); if (!key) return;
  const { data } = await getBrowserClient()!.rpc('onus_delete_comment', { p_id: id, p_key: key });
  if (data === true) forgetKey(id);
  router.refresh();
 }
 const badge = (c: Comment) => authorBadge(c.author_type, c.verified_label);
 const renderItem = (c: Comment, root: boolean) => (
  <li key={c.id} className={root ? 'on-comment' : 'on-comment on-reply'}>
   <div className="on-comment-head">
    <strong>{c.nickname ?? '알 수 없음'}</strong>
    {badge(c) && <span className={badge(c)!.verified ? 'on-pill on-pill-verified' : 'on-pill on-pill-soft'}>{badge(c)!.verified ? '✓ ' : ''}{badge(c)!.text}</span>}
    <span>{when(c.created_at)}</span>
   </div>
   <p>{c.body}</p>
   <div className="on-comment-actions">
    {root && <button type="button" onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}>{replyTo === c.id ? '답글 닫기' : '답글'}</button>}
    {owned.has(c.id) && <button type="button" onClick={() => remove(c.id)}>삭제</button>}
   </div>
   {root && replyTo === c.id && <Composer targetType={targetType} targetId={targetId} parentId={c.id} allowMaker={allowMaker} placeholder="이 코멘트에 답글을 남겨요" onDone={() => setReplyTo(null)} />}
   {root && replies(c.id).length > 0 && <ul className="on-replies">{replies(c.id).map((r) => renderItem(r, false))}</ul>}
  </li>
 );

 return (
  <div className="on-comments">
   <h3>{title} <span className="on-count-inline">{comments.length}</span></h3>
   {roots.length === 0 ? <p className="on-small">아직 코멘트가 없어요. 첫 코멘트를 남겨 보세요.</p> : <ul>{roots.map((c) => renderItem(c, true))}</ul>}
   <Composer targetType={targetType} targetId={targetId} parentId={null} allowMaker={allowMaker} placeholder="코멘트를 남겨요 (로그인 없이 바로)" onDone={() => undefined} />
  </div>
 );
}
