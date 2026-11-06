'use client';
import { useCallback, useEffect, useState } from 'react';
import { getAdminClient } from '@/lib/onus/admin-client';

type Pending = { id: string; title: string; contest_title: string; contest_year: number; award: string; fields: string | null; description: string; prep_note: string | null; major: string | null; nickname: string; image_path: string | null; created_at: string };

function Item({ p, onDone }: { p: Pending; onDone: () => void }) {
 const sb = getAdminClient()!;
 const [reason, setReason] = useState('');
 const [busy, setBusy] = useState(false);
 const [msg, setMsg] = useState<string | null>(null);
 const url = p.image_path ? sb.storage.from('onus-works').getPublicUrl(p.image_path).data.publicUrl : null;

 async function decide(approve: boolean) {
  if (!approve && !reason.trim()) { setMsg('반려 사유를 적어 주세요.'); return; }
  setBusy(true); setMsg(null);
  const { data, error } = await sb.rpc('onus_admin_work_decide', { p_id: p.id, p_approve: approve, p_reason: reason.trim() || null });
  if (error) { setBusy(false); setMsg('처리하지 못했어요. 운영자로 로그인했는지 확인해 주세요.'); return; }
  // 반려하면 업로드된 이미지를 저장소에서 지웁니다.
  if (!approve && typeof data === 'string') {
   const rm = await sb.storage.from('onus-works').remove([data]);
   if (rm.error) setMsg('결정은 저장됐지만 이미지 삭제에 실패했어요. 저장소에서 직접 지워 주세요.');
  }
  setBusy(false); onDone();
 }

 return (
  <li className="on-admin-item on-admin-work">
   {url && <a href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={`${p.title} 업로드 이미지`} width={160} height={200} /></a>}
   <div>
    <div className="on-comment-head"><strong>{p.title}</strong><span className="on-pill on-pill-soft">{p.contest_year} · {p.award}</span></div>
    <p className="on-small">{p.contest_title}{p.fields ? ` · ${p.fields}` : ''}{p.prep_note ? ` · 준비 ${p.prep_note}` : ''}{p.major ? ` · ${p.major}` : ''} · 닉네임 {p.nickname}</p>
    <p>{p.description}</p>
    <p className="on-small">이미지를 열어 개인정보(이름·학번·연락처)가 없는지, 제출한 내용과 맞는지 확인하고 승인하세요.</p>
    <div className="on-cta"><button type="button" className="on-btn on-btn-primary" onClick={() => decide(true)} disabled={busy}>승인</button></div>
    <label className="on-admin-reason">반려 사유<input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} placeholder="예: 이미지에 개인정보가 보여요 / 작품과 무관해요" /></label>
    <button type="button" className="on-btn" onClick={() => decide(false)} disabled={busy}>반려</button>
    {msg && <p className="on-msg" role="alert">{msg}</p>}
   </div>
  </li>
 );
}

/** 운영자 전용: 올라온 수상작 승인 대기 목록. 위 경험 인증 심사에서 운영자로 로그인하면 보입니다. */
export default function AdminWorks() {
 const sb = getAdminClient();
 const [list, setList] = useState<Pending[] | null>(null);
 const [note, setNote] = useState<string | null>(null);

 const load = useCallback(async () => {
  if (!sb) return;
  const { data, error } = await sb.rpc('onus_admin_work_pending');
  if (error) { setList(null); setNote(error.code === '42501' || /admin only/i.test(error.message) ? '운영자로 로그인하면 올라온 작품이 보여요.' : error.code === 'PGRST202' || error.code === 'PGRST205' ? '작품 올리기 기능이 아직 DB에 준비되지 않았어요(마이그레이션 적용 필요).' : '목록을 불러오지 못했어요.'); return; }
  setNote(null); setList((data ?? []) as Pending[]);
 }, [sb]);
 useEffect(() => {
  void load();
  const sub = sb?.auth.onAuthStateChange(() => { void load(); });
  return () => sub?.data.subscription.unsubscribe();
 }, [load, sb]);

 if (!sb) return <p className="on-small">Supabase 연결 설정이 없어요.</p>;
 return (
  <section className="on-admin-works">
   <h2 className="on-page-title" style={{ fontSize: 24 }}>올라온 수상작 승인</h2>
   {note && <p className="on-small">{note}</p>}
   {list && (list.length === 0 ? <p className="on-small">승인을 기다리는 작품이 없어요.</p> : <ul className="on-admin-list">{list.map((p) => <Item key={p.id} p={p} onDone={load} />)}</ul>)}
  </section>
 );
}
