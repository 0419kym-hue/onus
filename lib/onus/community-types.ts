export type CategoryKey = 'team' | 'space' | 'participants' | 'talk';

export const CATEGORIES: { key: CategoryKey; label: string; short: string; desc: string; cta: string }[] = [
 { key: 'team', label: '같이 할 사람 구해요', short: '팀원 모집', desc: '함께 공모전에 나갈 팀원을 찾거나, 팀에 합류하고 싶다는 글을 남겨요.', cta: '팀원 모집 글쓰기' },
 { key: 'space', label: '모임 공간 구해요', short: '모임 공간', desc: '공모전 준비 모임을 할 공간(스터디룸, 작업실, 교내 공간 등)을 구하거나 나눠요.', cta: '모임 공간 글쓰기' },
 { key: 'participants', label: '참가하는 학생들', short: '참가 학생', desc: '지금 준비하거나 참가한 공모전을 알려 주고, 같은 대회를 준비하는 사람을 만나요.', cta: '참가 중이라고 알리기' },
 { key: 'talk', label: '이야기·질문', short: '이야기', desc: '공모전 준비 과정, 후기, 궁금한 점을 자유롭게 나눠요.', cta: '이야기 남기기' },
];

export const isCategory = (v: string | undefined): v is CategoryKey => CATEGORIES.some((c) => c.key === v);

export type Post = {
 id: string; category: CategoryKey; title: string; body: string;
 contest_title: string | null; place: string | null; contact_url: string | null;
 status: 'open' | 'closed'; nickname: string | null; author_type: string | null; verified_label: string | null; created_at: string;
};

export type Comment = {
 id: string; parent_id: string | null; body: string; claims_maker: boolean;
 nickname: string | null; author_type: string | null; verified_label: string | null; created_at: string;
};

// 댓글자가 스스로 고르는 유형입니다. 인증된 정보가 아닙니다.
export type AuthorType = 'maker' | 'award' | 'entry' | 'senior' | 'junior' | 'general';
export const AUTHOR_TYPES: { key: AuthorType; label: string; hint: string; self: boolean }[] = [
 { key: 'maker', label: '이 작품을 만든 사람', hint: '작품 제작자', self: true },
 { key: 'senior', label: '전공 선배', hint: '같은 분야를 먼저 공부했어요', self: true },
 { key: 'junior', label: '준비 중인 후배', hint: '공모전을 준비하거나 알아보는 중이에요', self: true },
 { key: 'general', label: '일반 학생', hint: '그 밖의 학생이에요', self: true },
 // 아래 둘은 스스로 고를 수 없고, 서류를 올려 운영자가 승인한 인증으로만 쓸 수 있어요.
 { key: 'award', label: '수상 경험자', hint: '수상 증명서 확인', self: false },
 { key: 'entry', label: '출품·참가 경험자', hint: '접수 완료 확인서 확인', self: false },
];
export const typeLabel = (k: string | null | undefined) => AUTHOR_TYPES.find((t) => t.key === k)?.label ?? null;

// 화면에 보여 줄 유형 표시. 인증된 것과 스스로 고른 것을 분명히 구분합니다.
export function authorBadge(type: string | null, verifiedLabel: string | null): { text: string; verified: boolean } | null {
 const label = typeLabel(type);
 if (!label) return null;
 if (type === 'award' || type === 'entry') return verifiedLabel ? { text: verifiedLabel, verified: true } : { text: label + ' · 인증 취소됨', verified: false };
 return { text: label + ' · 스스로 선택, 미인증', verified: false };
}
