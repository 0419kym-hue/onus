import 'server-only';
import { createClient } from '@supabase/supabase-js';

// 학생이 올린 수상작 중 "운영자가 승인한 것"만 읽습니다(공개 키 + RLS). 연결이 없거나 테이블이 없으면 상태를 그대로 알려 주고 예시로 대체하지 않습니다.
export type Submission = {
 id: string; title: string; contest_title: string; contest_year: number; award: string; fields: string | null;
 description: string; prep_note: string | null; major: string | null; nickname: string; image_path: string | null; created_at: string;
};
export type SubmissionResult = { status: 'ok'; data: Submission[] } | { status: 'unconfigured' } | { status: 'missing-table' } | { status: 'error' };

const COLS = 'id,title,contest_title,contest_year,award,fields,description,prep_note,major,nickname,image_path,created_at';

export async function getApprovedSubmissions(): Promise<SubmissionResult> {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
 if (!url || !key) return { status: 'unconfigured' };
 const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store', signal: AbortSignal.timeout(10000) }) } });
 const { data, error } = await sb.from('onus_work_submissions').select(COLS).order('created_at', { ascending: false }).limit(24);
 if (error) return error.code === 'PGRST205' || error.code === '42P01' || error.code === '42703' ? { status: 'missing-table' } : { status: 'error' };
 return { status: 'ok', data: (data ?? []) as Submission[] };
}

/** 저장소(공개 버킷)의 이미지 주소 */
export function submissionImageUrl(path: string | null): string | null {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
 return url && path ? `${url}/storage/v1/object/public/onus-works/${path}` : null;
}
