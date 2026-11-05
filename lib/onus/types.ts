export type Award = '최우수상' | 'TOP TEN OVERALL' | '은상' | '동상' | '특선' | '장려상' | '입선';

export type WorkImage = { src: string; ratio: number }; // ratio = 세로/가로

export type Work = {
 num: number;
 slug: string;
 title: string;
 subtitle?: string;
 officialTitle?: string;
 contestSlug: string;
 contestName: string; // 사용자가 제공한 공식 명칭 그대로
 year: number;
 award: Award;
 awardNote?: string;
 fields: string[];
 description: string;
 organizer?: string;
 slogan?: string;
 cover?: string; // 이미지가 PDF뿐인 작품은 없음
 images: WorkImage[];
 pdf?: string;
 contestFit: string; // 대회 성격과 작품의 연결 (초안, 작성자 확인 필요)
};

export type Fact = { label: string; value: string; basis: string };
export type Source = { label: string; url: string };

export type Contest = {
 slug: string;
 name: string;
 tagline: string;
 character: string;
 facts: Fact[];
 unknown: string[];
 checkpoints: string[];
 sources: Source[];
 editions: { year: number; name: string }[];
};
