import type { Award, Work } from './types';

// 갤러리 정렬 기준: 숫자가 클수록 먼저 보입니다. 입선이 맨 뒤입니다.
// 대회마다 등급 체계가 달라 하나의 순위로 비교하는 것은 완전히 정확하지 않습니다.
// 특히 '특선'과 '장려상', 그리고 'TOP TEN OVERALL'(국제 어워드 선정)의 위치는 임시 기준이므로 필요하면 이 표만 고치면 됩니다.
export const AWARD_RANK: Record<Award, number> = {
 '최우수상': 100,
 'TOP TEN OVERALL': 90,
 '은상': 80,
 '동상': 70,
 '특선': 60,
 '장려상': 50,
 '입선': 40,
};

export const AWARD_ORDER: Award[] = ['최우수상', 'TOP TEN OVERALL', '은상', '동상', '특선', '장려상', '입선'];

// 같은 등급이면 최신 연도, 그다음 제공된 번호 순서
export function compareWorks(a: Work, b: Work): number {
 return AWARD_RANK[b.award] - AWARD_RANK[a.award] || b.year - a.year || a.num - b.num;
}

export function awardKind(a: Award): '수상' | '선정' {
 return a === 'TOP TEN OVERALL' ? '선정' : '수상';
}

export function awardTone(a: Award): 'top' | 'mid' | 'base' {
 if (a === '최우수상' || a === 'TOP TEN OVERALL') return 'top';
 if (a === '은상' || a === '동상' || a === '특선') return 'mid';
 return 'base';
}
