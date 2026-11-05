'use client';
import { addToBoard, removeFromBoard, useBoard, type BoardInput } from '@/lib/onus/board';

// 공모전을 "나의 도전 보드"에 담거나 뺍니다.
export default function SaveButton({ c }: { c: BoardInput }) {
 const { items, ready } = useBoard();
 const saved = items.some((x) => x.id === c.url);
 return (
  <button type="button" className="on-save" aria-pressed={ready && saved} onClick={() => (saved ? removeFromBoard(c.url) : addToBoard(c))}>
   {ready && saved ? '✓ 보드에 담김' : '＋ 도전 보드에 담기'}
  </button>
 );
}
