import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { CareerJob, CareerResult } from './careerly-types';

const COLUMNS = 'dataset_version,job_id,title,company,url,role,categories,regions,min_experience_years,max_experience_years,entry_level,kind,employment_type,summary,responsibilities,skills,deadline,first_seen_at';
const PAGE = 1000;

function isStrArr(v: unknown): v is string[] { return Array.isArray(v) && v.every(x => typeof x === 'string'); }

// 저장된 careerly_jobs 중 가장 최근 dataset_version 의 공고 전체를 읽습니다. 가상 공고로 대체하지 않습니다.
export async function getCareerJobs(): Promise<CareerResult> {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
 if (!url || !key) return { status: 'error', message: 'Supabase 연결 설정(URL과 Publishable key)이 없어요. .env.local 또는 Vercel 환경변수를 확인해 주세요.' };
 try {
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store', signal: AbortSignal.timeout(10000) }) } });
  const latest = await client.from('careerly_jobs').select('dataset_version').order('dataset_version', { ascending: false }).limit(1);
  if (latest.error) throw new Error('query');
  const version = latest.data?.[0]?.dataset_version as string | undefined;
  if (!version) return { status: 'empty' };
  const rows: CareerJob[] = [];
  for (let from = 0; ; from += PAGE) {
   const { data, error } = await client.from('careerly_jobs').select(COLUMNS).eq('dataset_version', version).order('first_seen_at', { ascending: false }).order('job_id').range(from, from + PAGE - 1);
   if (error) throw new Error('query');
   const chunk = (data ?? []) as unknown as CareerJob[];
   rows.push(...chunk);
   if (chunk.length < PAGE) break;
  }
  if (!rows.every(r => typeof r.job_id === 'string' && typeof r.title === 'string' && typeof r.company === 'string' && typeof r.url === 'string' && isStrArr(r.regions) && isStrArr(r.categories) && isStrArr(r.skills))) throw new Error('shape');
  return { status: 'ok', datasetVersion: version, jobs: rows };
 } catch {
  return { status: 'error', message: '분석용 공고를 불러오지 못했어요. Supabase 연결 정보, careerly_jobs 테이블과 읽기 권한을 확인해 주세요. 연결 오류를 가상 공고로 대신 표시하지 않습니다.' };
 }
}
