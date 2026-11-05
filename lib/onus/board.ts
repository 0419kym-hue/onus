'use client';
import { useEffect, useState } from 'react';

// "나의 도전 보드": 담아 둔 공모전과 준비 단계를 이 브라우저(localStorage)에만 저장합니다. 로그인·개인정보 없음.
const KEY = 'onus:board';
const EVT = 'onus-board-change';
export const STEPS = ['자료 조사', '기획·콘셉트', '제작', '제출 준비'] as const;

export type BoardInput = { url: string; title: string; organizer: string; deadline: string };
export type BoardItem = BoardInput & { id: string; steps: boolean[]; addedAt: string };

const valid = (x: unknown): x is BoardItem => {
 const v = x as BoardItem;
 return Boolean(v) && typeof v.id === 'string' && typeof v.title === 'string' && typeof v.deadline === 'string' && Array.isArray(v.steps);
};

export function loadBoard(): BoardItem[] {
 try { const v = JSON.parse(localStorage.getItem(KEY) ?? '[]'); return Array.isArray(v) ? v.filter(valid) : []; } catch { return []; }
}
function write(items: BoardItem[]) {
 try { localStorage.setItem(KEY, JSON.stringify(items)); window.dispatchEvent(new Event(EVT)); } catch { /* 저장이 막힌 브라우저에서는 건너뜀 */ }
}
export function addToBoard(c: BoardInput) {
 const items = loadBoard();
 if (items.some((x) => x.id === c.url)) return;
 write([...items, { ...c, id: c.url, steps: STEPS.map(() => false), addedAt: new Date().toISOString() }]);
}
export function removeFromBoard(id: string) { write(loadBoard().filter((x) => x.id !== id)); }
export function toggleStep(id: string, i: number) {
 write(loadBoard().map((x) => (x.id === id ? { ...x, steps: x.steps.map((s, k) => (k === i ? !s : s)) } : x)));
}

export function useBoard() {
 const [items, setItems] = useState<BoardItem[]>([]);
 const [ready, setReady] = useState(false);
 useEffect(() => {
  const sync = () => { setItems(loadBoard()); setReady(true); };
  sync();
  window.addEventListener(EVT, sync);
  window.addEventListener('storage', sync);
  return () => { window.removeEventListener(EVT, sync); window.removeEventListener('storage', sync); };
 }, []);
 return { items, ready };
}

// ---- 휴대폰·컴퓨터 캘린더에 넣는 일정 파일(.ics): 마감일 종일 일정 + 3일 전 알림 ----
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

export function icsFor(item: BoardInput): string {
 const d = item.deadline.replaceAll('-', '');
 const next = new Date(Date.parse(item.deadline) + 86400000).toISOString().slice(0, 10).replaceAll('-', '');
 const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
 return [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ON:US//KO', 'CALSCALE:GREGORIAN',
  'BEGIN:VEVENT', `UID:${d}-${hash(item.url)}@onus`, `DTSTAMP:${stamp}`,
  `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${next}`,
  `SUMMARY:${esc(`[공모전 마감] ${item.title}`)}`,
  `DESCRIPTION:${esc(`${item.organizer}\n공식 안내: ${item.url}\nON:US 도전 보드에서 담은 공모전`)}`,
  'BEGIN:VALARM', 'TRIGGER:-P3D', 'ACTION:DISPLAY', `DESCRIPTION:${esc('공모전 마감 3일 전이에요')}`, 'END:VALARM',
  'END:VEVENT', 'END:VCALENDAR',
 ].join('\r\n');
}

export function downloadIcs(item: BoardInput) {
 const blob = new Blob([icsFor(item)], { type: 'text/calendar;charset=utf-8' });
 const a = document.createElement('a');
 a.href = URL.createObjectURL(blob);
 a.download = `onus-deadline-${item.deadline}.ics`;
 document.body.appendChild(a); a.click(); a.remove();
 setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
