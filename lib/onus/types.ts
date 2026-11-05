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
 major?: string; // 작성자(선배)의 학과. 기록된 작품만 "같은 학과" 비교에 쓰입니다.
 journey?: Journey; // 준비 과정 기록. 작성자가 직접 채운 것만 화면에 보입니다.
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

// 선배의 준비 과정 기록. 값이 없으면 화면에 "기록 없음"으로 보여 주고, 추측해서 채우지 않습니다.
export type JourneyStep = { title: string; detail?: string; days?: number };
export type Journey = {
 weeks?: number; // 준비에 걸린 기간(주)
 days?: number; // 준비에 걸린 기간(일). 주 단위보다 우선
 approx?: boolean; // 대략적인 기간이면 true(화면에 "약"을 붙임)
 note?: string; // 기록의 출처·한계(예: 작성자가 구두로 알려 준 대략적 기간)
 hours?: string; // 예: "주 10시간 안팎"
 team?: string; // 예: "개인" / "2인 팀"
 steps?: JourneyStep[]; // 실행 순서
 tools?: string[]; // 사용한 도구
 tries?: string; // 시도하고 바꾼 것
 tip?: string; // 후배에게 한마디
};
