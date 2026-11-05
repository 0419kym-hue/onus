import { durationDays, durationLabel } from './journey';
import type { Work } from './types';

// 분야 묶음(관심 분야 찾기와 AI 추천이 같은 기준을 씁니다). 키워드가 작품·공모전 분야 글자와 겹치는지로 판단합니다.
export const FIELD_GROUPS = [
 { key: 'space', label: '건축·공간', kw: ['건축', '공간', '도시', '수변', '환경', '조경', '인테리어', '전시'] },
 { key: 'product', label: '제품·시스템', kw: ['제품', '시스템', '모빌리티', '유니버설', '앱', 'IT', '공공시설물'] },
 { key: 'visual', label: '영상·콘텐츠', kw: ['영상', '콘텐츠', '숏폼', '미디어', '웹툰', '캐릭터', '디카시', '광고', '시각'] },
 { key: 'ai', label: 'AI·데이터', kw: ['AI', '데이터', '게임'] },
 { key: 'idea', label: '아이디어·기획', kw: ['아이디어', '창업', '공공 아이디어', '네이밍', '논문', '마케팅', '기획'] },
 { key: 'color', label: '색채·조형', kw: ['색채', '조형', '파빌리온', '미술', '공예', '한옥'] },
] as const;
export type FieldKey = (typeof FIELD_GROUPS)[number]['key'];
export const FIELD_KEYS = FIELD_GROUPS.map((g) => g.key) as FieldKey[];

// 학과·수업 이름에서 분야를 짐작하는 규칙입니다(자동 추정이라 틀릴 수 있어요).
const MAJOR_RULES: { re: RegExp; tags: FieldKey[] }[] = [
 { re: /시각|영상|미디어|웹툰|만화|애니|광고|방송|사진|출판|편집|콘텐츠|브랜딩|그래픽|일러스트/, tags: ['visual'] },
 { re: /산업디자인|제품|패키지|가구|서비스디자인|ux|ui|인터랙션|모빌리티/i, tags: ['product'] },
 { re: /건축|실내|인테리어|환경디자인|조경|공간|도시|전시|디스플레이/, tags: ['space'] },
 { re: /컴퓨터|소프트웨어|ai|인공지능|데이터|코딩|프로그래|정보|it|게임|전산/i, tags: ['ai'] },
 { re: /경영|마케팅|창업|기획|회계|유통|호텔|관광|서비스경영|사회|행정|복지/, tags: ['idea'] },
 { re: /색채|조형|공예|미술|회화|도예|섬유|패션|한복|주얼리/, tags: ['color'] },
];

export function tagsFromText(text: string): FieldKey[] {
 const out = new Set<FieldKey>();
 for (const r of MAJOR_RULES) if (r.re.test(text)) r.tags.forEach((t) => out.add(t));
 return [...out];
}

const hits = (text: string, kws: readonly string[]) => kws.reduce((n, k) => (text.toLowerCase().includes(k.toLowerCase()) ? n + 1 : n), 0);

export function workTags(w: Pick<Work, 'fields' | 'title' | 'subtitle'>): FieldKey[] {
 const t = `${w.fields.join(' ')} ${w.subtitle ?? ''} ${w.title}`;
 return FIELD_GROUPS.filter((g) => hits(t, g.kw) > 0).map((g) => g.key);
}

export function contestTags(text: string): FieldKey[] {
 return FIELD_GROUPS.filter((g) => hits(text, g.kw) > 0).map((g) => g.key);
}

const labelOf = (k: FieldKey) => FIELD_GROUPS.find((g) => g.key === k)?.label ?? k;

export type SimilarSenior = { slug: string; title: string; contestName: string; award: string; cover?: string; why: string; sameMajor: boolean; duration?: string; days?: number };

/** 사용자의 분야 태그·학과와 닮은 선배 작품을 고릅니다. 선배의 학과(major)가 기록돼 있으면 같은 학과를 우선합니다. */
export function similarSeniors(works: Work[], tags: FieldKey[], major: string, limit = 3, only?: FieldKey[]): SimilarSenior[] {
 const m = major.trim().toLowerCase();
 const pool = only && only.length ? only : tags;
 return works
  .map((w) => {
   const wt = workTags(w);
   const shared = pool.filter((t) => wt.includes(t));
   const sameMajor = !!(m && w.major && (w.major.toLowerCase().includes(m) || m.includes(w.major.toLowerCase())));
   return { w, shared, sameMajor, score: shared.length * 10 + (sameMajor ? 25 : 0) };
  })
  .filter((x) => x.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit)
  .map(({ w, shared, sameMajor }) => ({
   slug: w.slug, title: w.title, contestName: w.contestName, award: w.award, cover: w.cover, sameMajor, duration: durationLabel(w.journey), days: durationDays(w.journey),
   why: sameMajor
    ? `같은 학과(${w.major}) 선배가 ${w.contestName}에서 ${w.award}을 받았어요.`
    : `${shared.map(labelOf).join('·')} 분야 선배가 ${w.contestName}에서 ${w.award}을 받았어요.`,
  }));
}
