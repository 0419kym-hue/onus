'use client';
import { useCallback, useEffect, useState } from 'react';
import { getAdminClient } from '@/lib/onus/admin-client';

type Pending = { id: string; claim_type: 'award' | 'entry'; contest_title: string; contest_year: number; award_level: string | null; show_detail: string; doc_path: string | null; created_at: string };
const SHOW: Record<string, string> = { none: '인증 표시만', contest: '대회명·연도 공개', contest_award: '대회명·연도·등급 공개' };

function Item({ p, onDone }: { p: Pending; onDone: () => void }) {
 const [contest, setContest] = useState(p.contest_title);
 const [year, setYear] = useState(String(p.contest_year));
 const [level, setLevel] = useState(p.award_level ?? '');
 const [reason, setReason] = useState('');
 const [busy, setBusy] = useState(false);
 const [msg, setMsg] = useState<string | null>(null);
 const sb = getAdminClient()!;

 async function open() {
  if (!p.doc_path) return;
  const { data, error } = await sb.storage.from('onus-evidence').createSignedUrl(p.doc_path, 300);
  if (error || !data) { setMsg('서류를 열지 못했어요.'); return; }
  window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
 }
 async function decide(approve: boolean) {
  if (!approve && !reason.trim()) { setMsg('반려 사유를 적어 주세요.'); return; }
  setBusy(true); setMsg(null);
  const { data, error } = await sb.rpc('onus_admin_decide', { p_id: p.id, p_approve: approve, p_reason: reason.trim() || null, p_contest: contest.trim(), p_year: Number(year), p_level: level.trim() });
  if (error) { setBusy(false); setMsg('처리하지 못했어요. 입력한 값을 확인해 주세요.'); return; }
  // 결정이 저장된 뒤 서류 파일을 삭제합니다.
  const path = typeof data === 'string' ? data : p.doc_path;
  if (path) { const rm = await sb.storage.from('onus-evidence').remove([path]); if (rm.error) setMsg('결정은 저장됐지만 서류 파일 삭제에 실패했어요. 저장소에서 직접 지워 주세요.'); }
  setBusy(false); onDone();
 }

 return (
  <li className="on-admin-item">
   <div className="on-comment-head"><strong>{p.claim_type === 'award' ? '수상 경험' : '출품·참가 경험'}</strong><span className="on-pill on-pill-soft">공개 범위: {SHOW[p.show_detail] ?? p.show_detail}</span><span>{new Date(p.created_at).toLocaleString('ko-KR')}</span></div>
   <p className="on-small">신청자가 적은 내용입니다. 서류를 열어 실제와 같은지 확인하고, 다르면 아래에서 고쳐 승인하세요.</p>
   <div className="on-identity">
    <label>공모전 이름<input value={contest} onChange={(e) => setContest(e.target.value)} maxLength={100} /></label>
    <label>연도<input type="number" value={year} onChange={(e) => setYear(e.target.value)} min={2000} max={2100} /></label>
    {p.claim_type === 'award' && <label>수상 등급<input value={level} onChange={(e) => setLevel(e.target.value)} maxLength={40} /></label>}
   </div>
   <div className="on-cta">
    <button type="button" className="on-btn" onClick={open} disabled={!p.doc_path}>서류 열기 (5분간 유효)</button>
    <button type="button" className="on-btn on-btn-primary" onClick={() => decide(true)} disabled={busy}>승인</button>
   </div>
   <label className="on-admin-reason">반려 사유<input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} placeholder="예: 신청서만 있어요 / 대회·연도가 서류와 달라요" /></label>
   <button type="button" className="on-btn" onClick={() => decide(false)} disabled={busy}>반려</button>
   {msg && <p className="on-msg" role="alert">{msg}</p>}
  </li>
 );
}

export default function AdminReview() {
 const sb = getAdminClient();
 const [ready, setReady] = useState(false);
 const [email, setEmail] = useState<string | null>(null);
 const [isAdmin, setIsAdmin] = useState(false);
 const [list, setList] = useState<Pending[]>([]);
 const [form, setForm] = useState({ email: '', password: '' });
 const [msg, setMsg] = useState<string | null>(null);
 const [busy, setBusy] = useState(false);

 const load = useCallback(async () => {
  if (!sb) { setReady(true); return; }
  const { data } = await sb.auth.getSession();
  const em = data.session?.user.email ?? null;
  setEmail(em);
  if (em) {
   const adm = await sb.rpc('onus_is_admin');
   const ok = adm.data === true; setIsAdmin(ok);
   if (ok) { const r = await sb.rpc('onus_admin_pending'); setList(r.error ? [] : (r.data as Pending[])); if (r.error) setMsg('대기 목록을 불러오지 못했어요. 마이그레이션이 적용됐는지 확인해 주세요.'); }
  } else { setIsAdmin(false); setList([]); }
  setReady(true);
 }, [sb]);
 useEffect(() => { load(); }, [load]);

 if (!sb) return <div className="on-empty"><strong>Supabase 연결 설정이 없어요.</strong></div>;
 if (!ready) return <p className="on-small">불러오는 중…</p>;

 async function signIn(kind: 'in' | 'up') {
  setBusy(true); setMsg(null);
  const r = kind === 'in' ? await sb!.auth.signInWithPassword(form) : await sb!.auth.signUp(form);
  setBusy(false);
  if (r.error) { setMsg(kind === 'in' ? '이메일 또는 비밀번호를 확인해 주세요. (가입 직후라면 확인 메일을 먼저 눌러야 해요)' : '가입하지 못했어요. 비밀번호는 6자 이상이어야 해요.'); return; }
  if (kind === 'up' && !r.data.session) { setMsg('확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.'); return; }
  load();
 }

 if (!email) {
  return (
   <form className="on-form on-compose" onSubmit={(e) => { e.preventDefault(); signIn('in'); }}>
    <h3>운영자 로그인</h3>
    <label>이메일<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" /></label>
    <label>비밀번호 (6자 이상)<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} autoComplete="current-password" /></label>
    <div className="on-cta"><button className="on-btn on-btn-primary" disabled={busy}>로그인</button><button type="button" className="on-btn" disabled={busy || !form.email || form.password.length < 6} onClick={() => signIn('up')}>계정 만들기</button></div>
    <p className="on-small">운영자로 등록된 이메일만 서류를 볼 수 있어요. 등록은 DB에서 직접 해요.</p>
    {msg && <p className="on-msg" role="alert">{msg}</p>}
   </form>
  );
 }
 if (!isAdmin) {
  return (
   <div className="on-panel"><h2>운영자로 등록되지 않은 계정이에요</h2><p>로그인한 이메일: <strong>{email}</strong></p>
    <p className="on-small">이 이메일을 운영자로 쓰려면 Supabase 대시보드의 SQL 편집기에서 <code>insert into public.onus_admins(email) values (&apos;{email.toLowerCase()}&apos;);</code> 를 실행해 주세요.</p>
    <div className="on-cta"><button type="button" className="on-btn" onClick={async () => { await sb.auth.signOut(); load(); }}>로그아웃</button></div></div>
  );
 }
 return (
  <div>
   <div className="on-cta"><span className="on-pill">운영자 · {email}</span><button type="button" className="on-btn" onClick={async () => { await sb.auth.signOut(); load(); }}>로그아웃</button><button type="button" className="on-btn" onClick={load}>새로고침</button></div>
   <h3 className="on-admin-title">심사 대기 {list.length}건</h3>
   {msg && <p className="on-msg" role="alert">{msg}</p>}
   {list.length === 0 ? <div className="on-empty"><strong>대기 중인 신청이 없어요.</strong></div> : <ul className="on-admin-list">{list.map((p) => <Item key={p.id} p={p} onDone={load} />)}</ul>}
  </div>
 );
}
