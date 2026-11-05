'use client';
import { useEffect, useState } from 'react';
import { getBrowserClient } from './supabase-browser';

// 내가 신청한 인증은 이 브라우저에 id와 비밀 키로 저장합니다. 키를 아는 브라우저에서만 상태 확인과 사용이 가능합니다.
const KEY = 'onus:verifs';
export type MyVerif = { id: string; key: string; type: 'award' | 'entry' };
export type VerifStatus = MyVerif & { status: 'pending' | 'approved' | 'rejected' | 'unknown'; reason: string | null; label: string | null };

export function loadVerifs(): MyVerif[] { try { const v = JSON.parse(localStorage.getItem(KEY) ?? '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
export function addVerif(v: MyVerif) { try { localStorage.setItem(KEY, JSON.stringify([...loadVerifs().filter((x) => x.id !== v.id), v])); } catch { /* 저장이 막힌 브라우저에서는 건너뜀 */ } }
export function removeVerif(id: string) { try { localStorage.setItem(KEY, JSON.stringify(loadVerifs().filter((x) => x.id !== id))); } catch { /* 건너뜀 */ } }

export async function fetchStatuses(items: MyVerif[]): Promise<VerifStatus[]> {
 const sb = getBrowserClient();
 return Promise.all(items.map(async (v) => {
  if (!sb) return { ...v, status: 'unknown' as const, reason: null, label: null };
  const { data, error } = await sb.rpc('onus_verification_status', { p_id: v.id, p_key: v.key });
  const row = Array.isArray(data) ? data[0] : null;
  if (error || !row) return { ...v, status: 'unknown' as const, reason: null, label: null };
  return { ...v, status: row.status, reason: row.reject_reason ?? null, label: row.public_label ?? null };
 }));
}

export function useMyVerifs() {
 const [items, setItems] = useState<VerifStatus[]>([]);
 const [ready, setReady] = useState(false);
 const [tick, setTick] = useState(0);
 useEffect(() => { let on = true; fetchStatuses(loadVerifs()).then((r) => { if (on) { setItems(r); setReady(true); } }); return () => { on = false; }; }, [tick]);
 return { items, ready, reload: () => setTick((t) => t + 1) };
}
