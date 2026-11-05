import { createClient } from '@supabase/supabase-js';
import { getJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

const MAX_BODY = 20_000;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const PHONE = /^[0-9+\-()\s]{7,20}$/;

function bad(status: number, error: string) { return Response.json({ ok: false, error }, { status }); }
// 구글 시트에서 수식으로 해석되지 않도록 앞에 작은따옴표를 붙입니다. (DB 원본은 그대로 저장)
function sheetSafe(v: string) { return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v; }

export async function POST(req: Request) {
 // 같은 사이트에서 보낸 요청만 허용합니다.
 const origin = req.headers.get('origin');
 if (origin) { try { if (new URL(origin).host !== req.headers.get('host')) return bad(403, '허용되지 않은 요청이에요.'); } catch { return bad(403, '허용되지 않은 요청이에요.'); } }

 const raw = await req.text();
 if (raw.length > MAX_BODY) return bad(413, '내용이 너무 길어요.');
 let b: Record<string, unknown>;
 try { b = JSON.parse(raw); if (typeof b !== 'object' || b === null || Array.isArray(b)) throw new Error('shape'); } catch { return bad(400, '요청 형식이 올바르지 않아요.'); }

 // 봇이 채우는 숨김 칸이 채워져 있으면 저장하지 않고 성공처럼 응답합니다.
 if (typeof b.website === 'string' && b.website.trim()) return Response.json({ ok: true, synced: false });

 const str = (k: string, max: number) => (typeof b[k] === 'string' ? (b[k] as string).trim().slice(0, max) : '');
 const jobId = str('jobId', 100), name = str('name', 100), email = str('email', 200), phone = str('phone', 50), message = str('message', 5000);
 if (!jobId || !name || !email || !phone || !message) return bad(400, '필수 항목을 모두 입력해 주세요.');
 if (!EMAIL.test(email)) return bad(400, '이메일 형식을 확인해 주세요.');
 if (!PHONE.test(phone)) return bad(400, '연락처 형식을 확인해 주세요.');
 if (b.consent !== true) return bad(400, '개인정보 수집·이용에 동의해 주세요.');

 const url = process.env.SUPABASE_URL?.trim(), key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(), sheetUrl = process.env.GOOGLE_SCRIPT_URL?.trim();
 if (!url || !key) return bad(503, '지원서 저장 설정이 아직 완성되지 않았어요.');

 // 지원 직무는 서버가 공고 목록에서 직접 찾아 사용합니다.
 const jobs = await getJobs();
 if (jobs.source === 'error') return bad(503, '공고를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.');
 const job = jobs.jobs.find(j => j.id === jobId);
 if (!job) return bad(404, '존재하지 않는 공고예요.');

 const row = { position: job.title.slice(0, 100), name, email, phone, message };
 const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
 const { data, error } = await db.from('applications').insert(row).select('id').single();
 if (error || !data) return bad(500, '지원서를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');

 let synced = false;
 if (sheetUrl) {
  try {
   const r = await fetch(sheetUrl, { method: 'POST', body: new URLSearchParams({ position: sheetSafe(row.position), name: sheetSafe(name), email: sheetSafe(email), phone: sheetSafe(phone), message: sheetSafe(message) }), redirect: 'follow', signal: AbortSignal.timeout(10000) });
   synced = r.ok && (await r.text()).trim() === 'ok';
  } catch { synced = false; }
 }
 if (synced) await db.from('applications').update({ sheet_synced: true }).eq('id', data.id);
 return Response.json({ ok: true, synced });
}
