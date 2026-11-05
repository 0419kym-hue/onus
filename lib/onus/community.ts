import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { CategoryKey, Comment, Post } from './community-types';

// 읽기는 로그인 없이 공개 키로 합니다. 쓰기는 브라우저에서 로그인한 사용자의 권한(RLS)으로만 합니다.
// 연결 설정이 없거나 테이블이 없을 때 예시 글로 대신 채우지 않고 상태를 그대로 알려 줍니다.
export type Result<T> = { status: 'ok'; data: T } | { status: 'unconfigured' } | { status: 'missing-table' } | { status: 'error' };

function client() {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
 if (!url || !key) return null;
 return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store', signal: AbortSignal.timeout(10000) }) } });
}

type Row = Record<string, unknown> & { onus_verifications?: { public_label?: string | null } | { public_label?: string | null }[] | null };
const vlabel = (r: Row) => (Array.isArray(r.onus_verifications) ? r.onus_verifications[0]?.public_label : r.onus_verifications?.public_label) ?? null;
const missing = (e: { code?: string } | null) => e?.code === 'PGRST205' || e?.code === '42P01' || e?.code === '42703';

export async function getPosts(category: CategoryKey): Promise<Result<Post[]>> {
 const sb = client(); if (!sb) return { status: 'unconfigured' };
 const { data, error } = await sb.from('onus_posts').select('id,category,title,body,contest_title,place,contact_url,status,nickname,author_type,created_at,onus_verifications(public_label)').eq('category', category).order('created_at', { ascending: false }).limit(60);
 if (error) return missing(error) ? { status: 'missing-table' } : { status: 'error' };
 return { status: 'ok', data: (data as unknown as Row[]).map((r) => ({ ...(r as unknown as Post), verified_label: vlabel(r) })) };
}

export async function getPost(id: string): Promise<Result<Post | null>> {
 const sb = client(); if (!sb) return { status: 'unconfigured' };
 if (!/^[0-9a-f-]{36}$/i.test(id)) return { status: 'ok', data: null };
 const { data, error } = await sb.from('onus_posts').select('id,category,title,body,contest_title,place,contact_url,status,nickname,author_type,created_at,onus_verifications(public_label)').eq('id', id).maybeSingle();
 if (error) return missing(error) ? { status: 'missing-table' } : { status: 'error' };
 return { status: 'ok', data: data ? { ...(data as unknown as Post), verified_label: vlabel(data as unknown as Row) } : null };
}

export async function getComments(targetType: 'work' | 'post', targetId: string): Promise<Result<Comment[]>> {
 const sb = client(); if (!sb) return { status: 'unconfigured' };
 const { data, error } = await sb.from('onus_comments').select('id,parent_id,body,claims_maker,nickname,author_type,created_at,onus_verifications(public_label)').eq('target_type', targetType).eq('target_id', targetId).order('created_at', { ascending: true }).limit(300);
 if (error) return missing(error) ? { status: 'missing-table' } : { status: 'error' };
 return { status: 'ok', data: (data as unknown as Row[]).map((r) => ({ ...(r as unknown as Comment), verified_label: vlabel(r) })) };
}

export const STATE_MESSAGE: Record<'unconfigured' | 'missing-table' | 'error', string> = {
 unconfigured: 'Supabase 연결 설정(URL과 Publishable key)이 없어 커뮤니티를 불러올 수 없어요.',
 'missing-table': '커뮤니티 DB 마이그레이션(20261105180000, 20261105190000, 20261105200000)이 아직 모두 적용되지 않았어요. 적용하면 열려요.',
 error: '불러오지 못했어요. 잠시 뒤 다시 시도해 주세요. 연결 오류를 예시 글로 대신 보여 주지 않아요.',
};
