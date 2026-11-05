'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { forgetKey, getKey } from '@/lib/onus/anon';
import { getBrowserClient } from '@/lib/onus/supabase-browser';

// 이 브라우저에서 쓴 글에만 보이는 모집 마감·삭제 버튼입니다. (실제 권한은 DB가 비밀 키로 한 번 더 확인합니다.)
export default function PostActions({ id, status, category }: { id: string; status: 'open' | 'closed'; category: string }) {
 const router = useRouter();
 const [mine, setMine] = useState(false);
 useEffect(() => { setMine(Boolean(getKey(id))); }, [id]);
 if (!mine) return null;
 return (
  <div className="on-cta">
   <button type="button" className="on-btn" onClick={async () => { await getBrowserClient()!.rpc('onus_set_post_status', { p_id: id, p_key: getKey(id), p_status: status === 'open' ? 'closed' : 'open' }); router.refresh(); }}>{status === 'open' ? '모집 마감하기' : '다시 모집하기'}</button>
   <button type="button" className="on-btn" onClick={async () => { if (!window.confirm('이 글을 삭제할까요?')) return; const { data } = await getBrowserClient()!.rpc('onus_delete_post', { p_id: id, p_key: getKey(id) }); if (data === true) forgetKey(id); router.push(`/onus/community?c=${category}`); router.refresh(); }}>삭제</button>
  </div>
 );
}
