import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// 운영자 화면 전용 클라이언트: 로그인 세션을 유지합니다(일반 방문자용 클라이언트와 분리). 공개 Publishable key만 사용합니다.
let cached: SupabaseClient | null | undefined;
export function getAdminClient(): SupabaseClient | null {
 if (cached !== undefined) return cached;
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
 cached = url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'onus-admin-auth' } }) : null;
 return cached;
}
