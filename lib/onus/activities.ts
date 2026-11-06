// 대외활동 정보: 어디서 찾고, 무엇을 조심하고, 지금 모집 중인 예시는 무엇인지.
// 2026-11-06에 각 사이트의 공개 화면에서 확인한 내용만 적고, 확인하지 못한 것은 적지 않았습니다.
export const ACTIVITY_CHECKED_AT = '2026-11-06';

export type ActivitySite = {
 name: string; kind: '대외활동 플랫폼' | '정부·지자체' | '한양여대 교내';
 desc: string; goodFor: string; url: string; seen: string; // seen = 직접 확인한 화면·메뉴
};

export const activitySites: ActivitySite[] = [
 { name: '링커리어', kind: '대외활동 플랫폼', desc: '대외활동·공모전·교육·인턴 공고를 모아 보여 주는 대학생 커리어 플랫폼이에요. 서포터즈, 봉사단, 정책 참여단 등이 올라와요.', goodFor: '공고가 많아서 처음 찾아볼 때', url: 'https://linkareer.com/list/activity', seen: '대외활동 실시간 공고 433건(2026-11-06 확인), D-day로 마감 표시' },
 { name: '요즘것들 (올포영)', kind: '대외활동 플랫폼', desc: '대외활동·공모전·교육·팀원모집·이벤트 메뉴가 있고, 대학생활 가이드북 매거진도 함께 있어요.', goodFor: '추천 공고와 가이드를 함께 보고 싶을 때', url: 'https://www.allforyoung.com', seen: '상단 메뉴: 대외활동·공모전·교육·팀원모집·이벤트·매거진' },
 { name: '캠퍼스픽 (에브리커리어)', kind: '대외활동 플랫폼', desc: '동아리·대외활동·공모전·취업 정보와 스터디·학회 모집글을 볼 수 있어요.', goodFor: '동아리·학회·연합 활동을 찾을 때', url: 'https://www.campuspick.com', seen: '사이트 이름만 직접 확인(세부 메뉴는 화면 구성상 확인하지 못함), 서비스 설명은 검색 요약 기준' },
 { name: '위비티', kind: '대외활동 플랫폼', desc: '공모전과 대외활동 정보를 함께 모아 보여 주는 사이트예요. ON:US의 접수 중 공모전 목록도 이곳 공개 페이지를 참고했어요.', goodFor: '공모전과 대외활동을 한곳에서 볼 때', url: 'https://www.wevity.com', seen: '공모전 상세 페이지를 읽어 목록을 만들 때 확인' },
 { name: '온통청년', kind: '정부·지자체', desc: '국무조정실 청년정책조정실과 한국고용정보원이 운영하는 청년정책 포털이에요. 일자리·주거·교육·금융·복지·참여 정책을 검색하고, 청년 참여 프로그램과 상담을 이용할 수 있어요.', goodFor: '나에게 맞는 청년 정책·지원을 찾을 때', url: 'https://www.youthcenter.go.kr', seen: '메인: 정책 검색, 청년소식, 청년상담실(챗봇·전화 1670-1839), 청년참여 프로그램' },
 { name: '서울청년포털', kind: '정부·지자체', desc: '서울시 청년 정책과 활동·참여 정보를 모아 둔 포털이에요.', goodFor: '서울에 사는 청년을 위한 활동·지원을 찾을 때', url: 'https://youth.seoul.go.kr', seen: '주소만 확인(메인 화면이 비어 있어 세부 메뉴는 확인하지 못함)' },
 { name: '한양여대 학생경력개발시스템', kind: '한양여대 교내', desc: '한양여자대학교 학생의 경력 개발을 돕는 교내 시스템이에요.', goodFor: '교내 프로그램과 경력 관리를 할 때', url: 'https://ces.hywoman.ac.kr/', seen: '검색 결과에서 학교 공식 도메인으로 확인, 세부 메뉴는 확인하지 못함' },
 { name: '한양여대 대학일자리플러스센터', kind: '한양여대 교내', desc: '한양여자대학교의 취업·일자리 지원 센터예요.', goodFor: '취업 상담과 일자리 프로그램을 찾을 때', url: 'https://ujc.hywoman.ac.kr/', seen: '검색 결과에서 학교 공식 도메인으로 확인, 세부 메뉴는 확인하지 못함' },
];

// 링커리어 "대외활동 실시간 공고"에 2026-11-06 표시돼 있던 모집 예시. 마감일은 화면의 D-day를 날짜로 계산한 값이라 공고에서 다시 확인해야 해요.
export type ActivityExample = { title: string; host: string; deadline: string; dday: string };
export const activityExamples: ActivityExample[] = [
 { title: '[삼성물산 리조트부문] 에버랜드 마케터스 10기 모집', host: '삼성물산(주)', deadline: '2026-11-15', dday: 'D-9' },
 { title: 'DB그룹 제122회 NEW 대학생 기업경영 체험스쿨 참여자 모집', host: 'DB그룹 인재개발원', deadline: '2026-11-13', dday: 'D-7' },
 { title: '삼성청년SW·AI아카데미 (SSAFY, 싸피) 17기', host: '삼성청년SW·AI아카데미', deadline: '2026-11-09', dday: 'D-3' },
 { title: '제19기 기상청 국민정책기자단', host: '(주)와이위', deadline: '2026-11-19', dday: 'D-13' },
 { title: '한국생활건강연구소 공식 서포터즈 한생건즈 4기 모집', host: '한국생활건강연구소', deadline: '2026-11-08', dday: 'D-2' },
 { title: '[시공간] 픽포미 대학생 서포터즈 1기 모집', host: '시공간', deadline: '2026-11-12', dday: 'D-6' },
 { title: '제1기 완도군 미래혁신위원회 위원 및 읍면 정책 참여단 모집', host: '완도군', deadline: '2026-11-13', dday: 'D-7' },
];
export const EXAMPLES_URL = 'https://linkareer.com/list/activity';

export const activityTypes = [
 { name: '서포터즈·기자단', desc: '기업·기관을 홍보하고 콘텐츠를 만드는 활동' },
 { name: '마케터·체험단', desc: '브랜드를 직접 경험하고 기획·홍보에 참여하는 활동' },
 { name: '정책 참여단', desc: '지자체·정부의 정책에 의견을 내는 청년 참여 활동' },
 { name: '교육·아카데미', desc: '기업·기관이 운영하는 교육과 캠프형 프로그램' },
 { name: '봉사단·동아리', desc: '봉사나 같은 관심사 모임으로 경험을 쌓는 활동' },
];

export const activityTips = [
 '보증금·교육비·물품 구매 비용을 요구하는 활동은 조심하세요. (링커리어 가이드에서도 사기 주의로 안내돼요)',
 '주최가 어디인지, 활동 기간과 혜택(수료증·활동비)이 공고에 적혀 있는지 확인하세요.',
 '마감일이 지났는지 공고 원문에서 다시 확인하세요. 이 페이지의 마감일은 확인 시점 기준이에요.',
 '학교 비교과·교내 프로그램은 학교 홈페이지와 학생경력개발시스템 공지도 함께 보세요.',
];
