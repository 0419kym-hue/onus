'use client';
import { useEffect, useState } from 'react';

// 로그인이 없으므로 닉네임·유형은 이 브라우저에만 저장하고, 글마다 만든 비밀 키로 "내가 쓴 글"을 구분합니다.
// 비밀 키를 지우거나 다른 브라우저로 가면 그 글은 삭제할 수 없습니다.
const PROFILE = 'onus:profile';
const KEYS = 'onus:keys';

export type Identity = { nickname: string; type: string };

export function loadIdentity(): Identity | null {
 try { const v = JSON.parse(localStorage.getItem(PROFILE) ?? 'null'); return v && typeof v.nickname === 'string' && typeof v.type === 'string' ? v : null; } catch { return null; }
}
export function saveIdentity(i: Identity) { try { localStorage.setItem(PROFILE, JSON.stringify(i)); } catch { /* 저장이 막힌 브라우저에서는 건너뜀 */ } }

function readKeys(): Record<string, string> { try { return JSON.parse(localStorage.getItem(KEYS) ?? '{}') ?? {}; } catch { return {}; } }
export function newId(): string { return crypto.randomUUID(); }
export function newKey(): string { const a = new Uint8Array(24); crypto.getRandomValues(a); return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join(''); }
export function rememberKey(id: string, key: string) { try { const k = readKeys(); k[id] = key; localStorage.setItem(KEYS, JSON.stringify(k)); } catch { /* 건너뜀 */ } }
export function getKey(id: string): string | null { return readKeys()[id] ?? null; }
export function forgetKey(id: string) { try { const k = readKeys(); delete k[id]; localStorage.setItem(KEYS, JSON.stringify(k)); } catch { /* 건너뜀 */ } }

// 서버에서 먼저 그려진 뒤(hydration) 브라우저 저장값을 읽습니다.
export function useIdentity() {
 const [ready, setReady] = useState(false);
 const [identity, setIdentity] = useState<Identity | null>(null);
 useEffect(() => { setIdentity(loadIdentity()); setReady(true); }, []);
 return { ready, identity, setIdentity };
}
export function useOwnedKeys(ids: string[]): Set<string> {
 const [owned, setOwned] = useState<Set<string>>(new Set());
 const sig = ids.join(',');
 useEffect(() => { setOwned(new Set(ids.filter((id) => getKey(id)))); }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps
 return owned;
}
