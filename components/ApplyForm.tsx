'use client';
import { useState } from 'react';

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; synced: boolean } | { kind: 'error'; message: string };

export default function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
 const [open, setOpen] = useState(false);
 const [state, setState] = useState<State>({ kind: 'idle' });

 async function submit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const f = e.currentTarget;
  const d = new FormData(f);
  setState({ kind: 'sending' });
  try {
   const res = await fetch('/api/apply', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId, name: d.get('name'), email: d.get('email'), phone: d.get('phone'), message: d.get('message'), website: d.get('website'), consent: d.get('consent') === 'on' }),
   });
   const json = await res.json().catch(() => ({}));
   if (!res.ok || !json.ok) { setState({ kind: 'error', message: json.error ?? '제출하지 못했어요. 잠시 후 다시 시도해 주세요.' }); return; }
   f.reset();
   setState({ kind: 'done', synced: json.synced === true });
  } catch { setState({ kind: 'error', message: '네트워크 문제로 제출하지 못했어요. 다시 시도해 주세요.' }); }
 }

 if (state.kind === 'done') return <div className="apply-done" role="status"><strong>지원서가 접수되었어요.</strong><p>{state.synced ? '담당자 시트에도 전달되었습니다.' : '접수는 완료되었고, 시트 반영은 조금 늦어질 수 있어요.'}</p></div>;
 if (!open) return <button type="button" className="primary-link" onClick={() => setOpen(true)}>지원서 작성하기 <span aria-hidden="true">↗</span></button>;
 return <form className="apply-form" onSubmit={submit}>
  <p className="apply-job">지원 직무 · <strong>{jobTitle}</strong></p>
  <label>이름<input name="name" required maxLength={100} autoComplete="name" /></label>
  <label>이메일<input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
  <label>연락처<input name="phone" type="tel" required maxLength={20} placeholder="010-0000-0000" autoComplete="tel" /></label>
  <label>자기소개<textarea name="message" required rows={5} maxLength={5000} /></label>
  <input className="apply-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
  <label className="apply-consent"><input name="consent" type="checkbox" required /><span>지원 접수를 위해 이름·이메일·연락처·자기소개를 수집·이용하는 데 동의합니다.</span></label>
  {state.kind === 'error' && <p className="apply-error" role="alert">{state.message}</p>}
  <button type="submit" className="primary-link" disabled={state.kind === 'sending'}>{state.kind === 'sending' ? '제출 중…' : '지원서 제출'}</button>
 </form>;
}
