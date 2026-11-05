'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORIES, type CategoryKey } from '@/lib/onus/community-types';
import { useMyVerifs } from '@/lib/onus/badges';
import { newId, newKey, rememberKey, saveIdentity, useIdentity } from '@/lib/onus/anon';
import { getBrowserClient } from '@/lib/onus/supabase-browser';
import IdentityFields from './IdentityFields';

export default function PostForm({ category }: { category: CategoryKey }) {
 const router = useRouter();
 const { identity } = useIdentity();
 const { items: badges } = useMyVerifs();
 const cat = CATEGORIES.find((c) => c.key === category)!;
 const [open, setOpen] = useState(false);
 const [busy, setBusy] = useState(false);
 const [msg, setMsg] = useState<string | null>(null);
 const [nickname, setNickname] = useState('');
 const [type, setType] = useState('');
 const [f, setF] = useState({ title: '', body: '', contest: '', place: '', link: '' });
 useEffect(() => { if (identity) { setNickname(identity.nickname); setType(identity.type.startsWith('v:') && !badges.some((b) => 'v:' + b.id === identity.type && b.status === 'approved') ? '' : identity.type); } }, [identity, badges]);
 const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

 if (!open) return <button type="button" className="on-btn on-btn-primary on-compose-open" onClick={() => setOpen(true)}>＋ {cat.cta} <span className="on-small-inline">로그인 없이 바로</span></button>;

 async function submit(e: React.FormEvent) {
  e.preventDefault(); setMsg(null);
  const sb = getBrowserClient();
  if (!sb) { setMsg('Supabase 연결 설정이 없어 올릴 수 없어요.'); return; }
  if (!type) { setMsg('나는 어떤 사람인지 유형을 골라 주세요.'); return; }
  if (f.link && !/^https:\/\//.test(f.link.trim())) { setMsg('연락 링크는 https:// 로 시작해야 해요. 전화번호와 이메일은 적지 마세요.'); return; }
  let authorType = type; let verification: { verification_id: string; verification_key: string } | null = null;
  if (type.startsWith('v:')) {
   const b = badges.find((x) => 'v:' + x.id === type && x.status === 'approved');
   if (!b) { setMsg('승인된 인증을 찾지 못했어요.'); return; }
   authorType = b.type; verification = { verification_id: b.id, verification_key: b.key };
  }
  setBusy(true);
  const id = newId(); const key = newKey();
  const { error } = await sb.from('onus_posts').insert({
   id, category, title: f.title.trim(), body: f.body.trim(), nickname: nickname.trim(), author_type: authorType, edit_key: key, ...(verification ?? {}),
   contest_title: f.contest.trim() || null, place: f.place.trim() || null, contact_url: f.link.trim() || null,
  });
  setBusy(false);
  if (error) { setMsg(error.code === 'P0001' ? '잠깐 글이 몰리고 있어요. 1분 뒤에 다시 올려 주세요.' : error.code === 'P0002' || error.code === 'P0003' ? '인증이 확인되지 않아 이 유형으로는 올릴 수 없어요.' : error.code === '42703' || error.code === 'PGRST205' ? '커뮤니티가 아직 DB에 준비되지 않았어요.' : '글을 올리지 못했어요. 제목과 내용은 2자 이상이어야 해요.'); return; }
  rememberKey(id, key); saveIdentity({ nickname: nickname.trim(), type });
  setF({ title: '', body: '', contest: '', place: '', link: '' }); setOpen(false); router.refresh();
 }

 return (
  <form className="on-form on-compose" onSubmit={submit}>
   <h3>{cat.cta}</h3>
   <IdentityFields nickname={nickname} type={type} onNickname={setNickname} onType={setType} allowMaker={false} badges={badges} />
   <label>제목<input value={f.title} onChange={set('title')} maxLength={80} required minLength={2} /></label>
   {(category === 'team' || category === 'participants') && <label>공모전 이름<input value={f.contest} onChange={set('contest')} maxLength={100} placeholder="예: 2026 청년 AI 디자인 공모전" /></label>}
   {category === 'space' && <label>지역·장소<input value={f.place} onChange={set('place')} maxLength={80} placeholder="예: 성동구 · 교내 · 온라인" /></label>}
   <label>내용<textarea value={f.body} onChange={set('body')} maxLength={2000} rows={5} required minLength={2} /></label>
   {category !== 'talk' && <label>연락 링크 (선택, https://)<input value={f.link} onChange={set('link')} maxLength={300} placeholder="오픈채팅방 링크 등" inputMode="url" /></label>}
   <p className="on-small">전화번호·이메일·학번 같은 개인정보는 적지 마세요. 연락은 오픈채팅 링크나 댓글로 해요. 이 브라우저에서만 삭제할 수 있어요.</p>
   <div className="on-cta"><button className="on-btn on-btn-primary" disabled={busy}>{busy ? '올리는 중…' : '올리기'}</button><button type="button" className="on-btn" onClick={() => setOpen(false)}>닫기</button></div>
   {msg && <p className="on-msg" role="alert">{msg}</p>}
  </form>
 );
}
