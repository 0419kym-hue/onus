import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// 브라우저에서 쓰는 클라이언트(공개 Publishable key만 사용, 로그인 세션은 쓰지 않음). 비밀 키는 절대 쓰지 않습니다.
let cached: SupabaseClient | null | undefined;
export function getBrowserClient(): SupabaseClient | null {
 if (cached !== undefined) return cached;
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
 cached = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }) : null;
 return cached;
}
