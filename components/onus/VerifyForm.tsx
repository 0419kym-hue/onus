'use client';
import { useState } from 'react';
import { addVerif, removeVerif, useMyVerifs } from '@/lib/onus/badges';
import { newId, newKey } from '@/lib/onus/anon';
import { getBrowserClient } from '@/lib/onus/supabase-browser';

const MAX = 5 * 1024 * 1024;
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' };

export default function VerifyForm() {
 const mine = useMyVerifs();
 const [claim, setClaim] = useState<'award' | 'entry'>('award');
 const [contest, setContest] = useState('');
 const [year, setYear] = useState(String(new Date().getFullYear()));
 const [level, setLevel] = useState('');
 const [show, setShow] = useState<'none' | 'contest' | 'contest_award'>('none');
 const [file, setFile] = useState<File | null>(null);
 const [agree, setAgree] = useState(false);
 const [busy, setBusy] = useState(false);
 const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

 async function submit(e: React.FormEvent) {
  e.preventDefault(); setMsg(null);
  const sb = getBrowserClient();
  if (!sb) { setMsg({ ok: false, text: 'Supabase 연결 설정이 없어 신청할 수 없어요.' }); return; }
  if (!file || !EXT[file.type]) { setMsg({ ok: false, text: '서류는 JPG·PNG·WEBP 이미지 또는 PDF만 올릴 수 있어요.' }); return; }
  if (file.size > MAX) { setMsg({ ok: false, text: '서류 파일은 5MB 이하여야 해요.' }); return; }
  setBusy(true);
  const id = newId(); const key = newKey();
  const path = `${id}/${newKey().slice(0, 12)}.${EXT[file.type]}`;
  const up = await sb.storage.from('onus-evidence').upload(path, file, { contentType: file.type, upsert: false });
  if (up.error) { setBusy(false); setMsg({ ok: false, text: /not found|bucket/i.test(up.error.message) ? '서류 저장소가 아직 준비되지 않았어요(DB 마이그레이션 적용 필요).' : '서류를 올리지 못했어요. 잠시 뒤 다시 시도해 주세요.' }); return; }
  const ins = await sb.from('onus_verifications').insert({ id, claim_type: claim, contest_title: contest.trim(), contest_year: Number(year), award_level: claim === 'award' ? level.trim() || null : null, show_detail: show, doc_path: path, claim_key: key });
  setBusy(false);
  if (ins.error) { setMsg({ ok: false, text: ins.error.code === 'P0001' ? '잠깐 신청이 몰리고 있어요. 1분 뒤에 다시 해 주세요.' : ins.error.code === 'PGRST205' || ins.error.code === '42703' ? '인증 기능이 아직 DB에 준비되지 않았어요.' : '신청하지 못했어요. 입력한 내용을 확인해 주세요.' }); return; }
  addVerif({ id, key, type: claim });
  setContest(''); setLevel(''); setFile(null); setAgree(false); const el = document.getElementById('onus-doc') as HTMLInputElement | null; if (el) el.value = '';
  setMsg({ ok: true, text: '신청했어요. 운영자가 서류를 확인하면 아래에서 상태가 바뀌어요. 이 브라우저에 신청 정보가 저장돼요.' });
  mine.reload();
 }

 return (
  <div>
   <div className="on-panel on-panel-accent on-verify-info">
    <h2>어떤 서류를 올리나요</h2>
    <ul className="on-list">
     <li><strong>수상 경험</strong>: 수상 증명서, 상장, 수상 확인서</li>
     <li><strong>출품·참가 경험</strong>: 출품 접수 완료 확인서, 공식 결과 발표 자료(참가가 확인되는 것)</li>
     <li>출품 <strong>신청서만</strong> 쓴 것은 참가 경험으로 인정하지 않아요.</li>
    </ul>
    <p className="on-small">올리기 전에 <strong>주민등록번호·연락처·주소는 가려 주세요.</strong> 서류는 비공개 저장소에 보관되고 운영자만 볼 수 있으며, 확인이 끝나면 파일은 삭제돼요. 운영자는 서류가 그럴듯한지와 대회·연도·등급이 맞는지만 보고, 올린 분이 본인인지는 확인하지 못해요. 위조 여부도 판별하지 않아요.</p>
   </div>

   <form className="on-form on-compose" onSubmit={submit}>
    <h3>인증 신청</h3>
    <div className="on-chips" role="radiogroup" aria-label="경험 종류">
     <button type="button" role="radio" aria-checked={claim === 'award'} aria-pressed={claim === 'award'} onClick={() => setClaim('award')}>수상 경험 인증</button>
     <button type="button" role="radio" aria-checked={claim === 'entry'} aria-pressed={claim === 'entry'} onClick={() => setClaim('entry')}>출품·참가 경험 인증</button>
    </div>
    <label>공모전 이름<input value={contest} onChange={(e) => setContest(e.target.value)} required minLength={2} maxLength={100} placeholder="예: 2026 제35회 대전디자인어워드" /></label>
    <div className="on-identity">
     <label>연도<input type="number" value={year} onChange={(e) => setYear(e.target.value)} required min={2000} max={2100} /></label>
     {claim === 'award' && <label>수상 등급<input value={level} onChange={(e) => setLevel(e.target.value)} maxLength={40} placeholder="예: 입선, 장려상 (서류에 적힌 표기 그대로)" /></label>}
    </div>
    <label>인증 표시에 보여 줄 범위 (작은 학과에서는 이력만으로 누구인지 알 수 있어요)
     <select value={show} onChange={(e) => setShow(e.target.value as typeof show)}>
      <option value="none">&ldquo;{claim === 'award' ? '수상 경험' : '출품 경험'} 인증&rdquo;만 보여 주기 (권장)</option>
      <option value="contest">대회 이름과 연도도 보여 주기</option>
      {claim === 'award' && <option value="contest_award">대회 이름, 연도, 수상 등급까지 보여 주기</option>}
     </select>
    </label>
    <label>서류 파일 (JPG·PNG·WEBP·PDF, 5MB 이하)<input id="onus-doc" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required /></label>
    <label className="on-check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> 개인정보를 가렸고, 서류가 확인 목적으로만 쓰이고 심사 뒤 삭제된다는 것을 이해했어요.</label>
    <div className="on-cta"><button className="on-btn on-btn-primary" disabled={busy || !agree || !file}>{busy ? '올리는 중…' : '신청하기'}</button></div>
    {msg && <p className={msg.ok ? 'on-msg on-msg-ok' : 'on-msg'} role="status">{msg.text}</p>}
   </form>

   <section className="on-verif-list">
    <h3>내 신청</h3>
    {!mine.ready ? <p className="on-small">불러오는 중…</p> : mine.items.length === 0 ? <p className="on-small">이 브라우저에서 신청한 내역이 없어요.</p> : (
     <ul>
      {mine.items.map((v) => (
       <li key={v.id} className="on-verif-item">
        <strong>{v.type === 'award' ? '수상 경험' : '출품·참가 경험'}</strong>
        <span className={`on-pill ${v.status === 'approved' ? 'on-pill-verified' : 'on-pill-soft'}`}>{v.status === 'approved' ? '✓ 승인됨' : v.status === 'pending' ? '심사 중' : v.status === 'rejected' ? '반려됨' : '상태를 확인하지 못했어요'}</span>
        {v.status === 'approved' && <p>댓글과 글을 쓸 때 &ldquo;나는&rdquo; 목록에서 <strong>{v.label}</strong>을 고를 수 있어요.</p>}
        {v.status === 'rejected' && <p>{v.reason ? `사유: ${v.reason}` : '사유가 적히지 않았어요.'} 서류를 확인해 다시 신청해 주세요.</p>}
        <button type="button" className="on-link-btn" onClick={() => { removeVerif(v.id); mine.reload(); }}>이 목록에서 지우기</button>
       </li>
      ))}
     </ul>
    )}
   </section>
  </div>
 );
}
