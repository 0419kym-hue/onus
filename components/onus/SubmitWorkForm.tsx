'use client';
import { useEffect, useState } from 'react';
import { newId, newKey } from '@/lib/onus/anon';
import { getBrowserClient } from '@/lib/onus/supabase-browser';
import { FIELD_GROUPS } from '@/lib/onus/fields';

const MAX = 5 * 1024 * 1024;
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const AWARDS = ['대상', '최우수상', '금상', '은상', '동상', '특선', '장려상', '입선', 'TOP TEN OVERALL'];
const PREP = ['', '2일 이내', '약 3~4일', '약 1주', '약 2주', '약 한 달', '한 달 이상'];
const STORE = 'onus:work-subs';
type Mine = { id: string; key: string; title: string };
type Stat = { status: string; reject_reason: string | null; title: string };
const STAT_TEXT: Record<string, string> = { pending: '운영자 확인 대기 중', approved: '승인됨 · 아카이브에 보여요', rejected: '반려됨' };

function readMine(): Mine[] { try { const v = JSON.parse(localStorage.getItem(STORE) ?? '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }

export default function SubmitWorkForm() {
 const [title, setTitle] = useState('');
 const [contest, setContest] = useState('');
 const [year, setYear] = useState(String(new Date().getFullYear()));
 const [award, setAward] = useState('');
 const [fields, setFields] = useState<string[]>([]);
 const [desc, setDesc] = useState('');
 const [prep, setPrep] = useState('');
 const [major, setMajor] = useState('');
 const [nick, setNick] = useState('');
 const [file, setFile] = useState<File | null>(null);
 const [agree, setAgree] = useState(false);
 const [busy, setBusy] = useState(false);
 const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
 const [stats, setStats] = useState<Record<string, Stat>>({});
 const [mine, setMine] = useState<Mine[]>([]);

 // 내가 올린 작품의 처리 상태(이 브라우저에 저장된 id·비밀 키로만 조회)
 useEffect(() => {
  const list = readMine(); setMine(list);
  const sb = getBrowserClient(); if (!sb) return;
  list.forEach(async (m) => {
   const { data } = await sb.rpc('onus_work_status', { p_id: m.id, p_key: m.key });
   const row = Array.isArray(data) ? data[0] : null;
   if (row) setStats((s) => ({ ...s, [m.id]: row as Stat }));
  });
 }, []);

 const toggle = (l: string) => setFields((f) => (f.includes(l) ? f.filter((x) => x !== l) : [...f, l]));

 async function submit(e: React.FormEvent) {
  e.preventDefault(); setMsg(null);
  const sb = getBrowserClient();
  if (!sb) { setMsg({ ok: false, text: 'Supabase 연결 설정이 없어 올릴 수 없어요.' }); return; }
  if (!file || !EXT[file.type]) { setMsg({ ok: false, text: '작품 이미지는 JPG·PNG·WEBP만 올릴 수 있어요.' }); return; }
  if (file.size > MAX) { setMsg({ ok: false, text: '이미지는 5MB 이하여야 해요.' }); return; }
  setBusy(true);
  const id = newId(); const key = newKey();
  const path = `${id}/${newKey().slice(0, 12)}.${EXT[file.type]}`;
  const up = await sb.storage.from('onus-works').upload(path, file, { contentType: file.type, upsert: false });
  if (up.error) {
   setBusy(false);
   setMsg({ ok: false, text: /not found|bucket/i.test(up.error.message) ? '작품 저장소가 아직 준비되지 않았어요(DB 마이그레이션 적용 필요).' : '이미지를 올리지 못했어요. 잠시 뒤 다시 시도해 주세요.' });
   return;
  }
  const ins = await sb.from('onus_work_submissions').insert({
   id, title: title.trim(), contest_title: contest.trim(), contest_year: Number(year), award: award.trim(), fields: fields.join(', ') || null,
   description: desc.trim(), prep_note: prep || null, major: major.trim() || null, nickname: nick.trim(), image_path: path, consent: agree, claim_key: key,
  });
  setBusy(false);
  if (ins.error) {
   setMsg({ ok: false, text: ins.error.code === 'P0001' ? '잠깐 신청이 몰리고 있어요. 1분 뒤에 다시 해 주세요.' : ins.error.code === 'PGRST205' || ins.error.code === '42703' ? '작품 올리기 기능이 아직 DB에 준비되지 않았어요(마이그레이션 적용 필요).' : '저장하지 못했어요. 입력한 내용(글자 수·연도)을 확인해 주세요.' });
   return;
  }
  const next = [{ id, key, title: title.trim() }, ...readMine()].slice(0, 20);
  try { localStorage.setItem(STORE, JSON.stringify(next)); } catch { /* 저장이 막힌 브라우저에서는 건너뜀 */ }
  setMine(next); setStats((s) => ({ ...s, [id]: { status: 'pending', reject_reason: null, title: title.trim() } }));
  setTitle(''); setContest(''); setAward(''); setFields([]); setDesc(''); setPrep(''); setMajor(''); setFile(null); setAgree(false);
  const el = document.getElementById('onus-work-img') as HTMLInputElement | null; if (el) el.value = '';
  setMsg({ ok: true, text: '올렸어요! 운영자가 확인하고 승인하면 수상 아카이브에 보여요. 이 브라우저에서 아래 "내가 올린 작품"으로 상태를 볼 수 있어요.' });
 }

 return (
  <div>
   <div className="on-panel on-panel-accent on-verify-info">
    <h2>내 수상작을 올려요</h2>
    <ul className="on-list">
     <li>본인이 만든 <strong>수상·출품작</strong>의 보드나 대표 이미지를 올려 주세요.</li>
     <li>운영자가 확인해서 승인한 작품만 수상 아카이브에 보여요.</li>
     <li><strong>이름·학번·연락처</strong>는 적지 말고, 이미지 안에 있다면 가려 주세요.</li>
    </ul>
   </div>

   <form className="on-form on-compose" onSubmit={submit}>
    <h3>작품 정보</h3>
    <label>작품명<input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={2} maxLength={80} placeholder="예: PULSE FIELD" /></label>
    <label>공모전 이름<input value={contest} onChange={(e) => setContest(e.target.value)} required minLength={2} maxLength={100} placeholder="예: 2026 제35회 대전디자인어워드" /></label>
    <div className="on-identity">
     <label>연도<input type="number" value={year} onChange={(e) => setYear(e.target.value)} required min={2000} max={2100} /></label>
     <label>수상 등급<input list="onus-awards" value={award} onChange={(e) => setAward(e.target.value)} required maxLength={40} placeholder="상장에 적힌 표기 그대로" /></label>
     <datalist id="onus-awards">{AWARDS.map((a) => <option key={a} value={a} />)}</datalist>
    </div>
    <div className="on-field-chips">
     <span className="on-field-label">분야 (여러 개 선택)</span>
     <div className="on-chips" role="group" aria-label="분야">
      {FIELD_GROUPS.map((g) => <button type="button" key={g.key} aria-pressed={fields.includes(g.label)} onClick={() => toggle(g.label)}>{g.label}</button>)}
     </div>
    </div>
    <label>작품 설명 (10~600자)<textarea value={desc} onChange={(e) => setDesc(e.target.value)} required minLength={10} maxLength={600} rows={4} placeholder="어떤 작품인지, 무엇을 담았는지 적어 주세요." /></label>
    <div className="on-identity">
     <label>준비 기간 (선택)<select value={prep} onChange={(e) => setPrep(e.target.value)}>{PREP.map((p) => <option key={p} value={p}>{p || '선택 안 함'}</option>)}</select></label>
     <label>학과 (선택)<input value={major} onChange={(e) => setMajor(e.target.value)} maxLength={40} placeholder="예: 산업디자인" /></label>
    </div>
    <label>닉네임 (2~20자, 화면에 보여요)<input value={nick} onChange={(e) => setNick(e.target.value)} required minLength={2} maxLength={20} placeholder="실명 대신 쓸 이름" /></label>
    <label>작품 이미지 (JPG·PNG·WEBP, 5MB 이하)<input id="onus-work-img" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required /></label>
    <label className="on-check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> 제가 만든 작품이고, 이 작품과 위 내용을 ON:US 수상 아카이브에 공개하는 데 동의해요. 이름·학번·연락처는 포함하지 않았어요.</label>
    <div className="on-cta"><button className="on-btn on-btn-primary" disabled={busy || !agree || !file}>{busy ? '올리는 중…' : '작품 올리기'}</button></div>
    {msg && <p className={msg.ok ? 'on-msg on-msg-ok' : 'on-msg'} role="status">{msg.text}</p>}
   </form>

   {mine.length > 0 && (
    <section className="on-mine" aria-label="내가 올린 작품">
     <h3>내가 올린 작품</h3>
     <ul>
      {mine.map((m) => {
       const s = stats[m.id];
       return (
        <li key={m.id} className="on-mine-item">
         <strong>{m.title}</strong>
         <span className="on-pill on-pill-soft" data-s={s?.status}>{s ? STAT_TEXT[s.status] ?? s.status : '상태 확인 중…'}</span>
         {s?.status === 'rejected' && s.reject_reason && <em>사유: {s.reject_reason}</em>}
        </li>
       );
      })}
     </ul>
     <p className="on-small">상태는 이 브라우저에 저장된 정보로만 확인할 수 있어요. 브라우저 데이터를 지우면 볼 수 없어요.</p>
    </section>
   )}
  </div>
 );
}
