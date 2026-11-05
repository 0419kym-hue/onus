export type CareerJob = {
 dataset_version: string; job_id: string; title: string; company: string; url: string;
 role: string | null; categories: string[]; regions: string[];
 min_experience_years: number | null; max_experience_years: number | null;
 entry_level: boolean | null; kind: string | null; employment_type: string | null;
 summary: string | null; responsibilities: string | null; skills: string[];
 deadline: string | null; first_seen_at: string | null;
};
export type CareerResult =
 | { status: 'ok'; datasetVersion: string; jobs: CareerJob[] }
 | { status: 'empty' }
 | { status: 'error'; message: string };
