import type { Work } from './types';

// 작품명·공모전명·연도·수상 등급은 작품 제공자가 준 표기를 그대로 사용합니다. (임의로 바꾸지 않음)
// 설명은 제공된 원본 내용입니다. contestFit(대회 성격과 작품의 연결)은 제공된 작품 설명과 공개된 대회 안내를 비교해 쓴 초안이며
// 입상 이유(심사평)는 공개 자료에서 확인하지 못했으므로 단정하지 않습니다. 작성자가 확인·수정해야 합니다.
const w = (src: string, ratio: number) => ({ src: `/onus/works/${src}.webp`, ratio });
const cover = (slug: string) => `/onus/works/${slug}-cover.webp`;

export const works: Work[] = [
 {
  num: 1, slug: 'pulse-field', title: 'PULSE FIELD', subtitle: '도시의 이동 신호가 파동처럼 나타나는 반응형 트램 정거장',
  contestSlug: 'daejeon-design-award', contestName: '2026 제35회 대전디자인어워드', year: 2026, award: '입선',
  fields: ['공공시설물', '스마트 모빌리티', '환경디자인'],
  description: '도시 이동 데이터와 기후 변화, 승객 접근 정보를 감지하여 조명과 디지털 안내 시스템이 반응하는 미래형 트램 정거장.',
  cover: cover('pulse-field'), images: [w('pulse-field-1', 1.416), w('pulse-field-2', 1.416)],
  contestFit: '제35회에는 "대전 트램 중심의 미래 이동 시스템 공공디자인"이라는 지정 주제가 있습니다. 이 작품은 트램 정거장을 다루고 있어 지정 주제와 같은 방향입니다. 분야로는 제품·서비스·환경디자인에 걸쳐 있습니다. 심사평은 확인하지 못해 입선 이유는 알 수 없어요.',
 },
 {
  num: 2, slug: 'ripple-beacon', title: 'RIPPLE BEACON', subtitle: '스마트 연결형 구명부표',
  contestSlug: 'daejeon-design-award', contestName: '2026 제35회 대전디자인어워드', year: 2026, award: '입선',
  fields: ['제품디자인', '수변안전', '스마트 구조 시스템'],
  description: '프레넬 렌즈에서 영감을 받은 빛의 확산 구조와 스마트 알림 및 위치 정보 연계를 적용한 수변 구조 지원 제품.',
  cover: cover('ripple-beacon'), images: [w('ripple-beacon-1', 1.416), w('ripple-beacon-2', 1.416)],
  contestFit: '제35회 공모 분야 중 제품·서비스·환경디자인에 해당하는 제품디자인 작품입니다. 트램 지정 주제와는 다른 주제를 다루며, 자유 주제와 지정 주제 중 어느 쪽으로 출품했는지는 기록에 없어요.',
 },
 {
  num: 3, slug: 'step-grip-assist', title: 'STEP GRIP ASSIST 2.0', subtitle: '모두의 안전한 승하차를 위한 스마트 보조 시스템',
  contestSlug: 'daejeon-design-award', contestName: '2026 제35회 대전디자인어워드', year: 2026, award: '입선',
  fields: ['유니버설디자인', '제품디자인', '대중교통'],
  description: '버스 승객의 접근을 감지해 손잡이와 보조 발판을 전개함으로써 고령자, 임산부, 영유아 동반 승객 등의 승하차를 지원하는 디자인.',
  cover: cover('step-grip-assist'), images: [w('step-grip-assist-1', 1.416), w('step-grip-assist-2', 1.416)],
  contestFit: '대중교통 이용 약자를 위한 제품입니다. 지정 주제(대전 트램 중심 미래 이동 시스템 공공디자인)와 "대중교통·이동"이라는 맥락이 이어지지만, 대상은 트램이 아닌 버스입니다.',
 },
 {
  num: 4, slug: 'urban-wetland-archive', title: 'Urban Wetland Archive',
  contestSlug: 'gyeongnam-k-design', contestName: '2026 경남 K-디자인 전람회', year: 2026, award: '동상',
  fields: ['건축', '생태환경', '전시공간', '지속가능디자인'],
  description: '도심 습지의 생태적 가치와 자연환경의 변화를 기록하고, 생태적 경험을 전시·교육 공간으로 연결하는 건축 및 공간디자인.',
  cover: cover('urban-wetland-archive'), images: [w('urban-wetland-archive-1', 2.832)],
  contestFit: '경남 K-디자인 전람회에는 공간·환경·서비스 부문이 있습니다. 이 작품은 건축·생태환경·전시공간을 다뤄 그 부문과 맞닿아 있습니다. 경남의 특별 주제(산업·유산·관광)와의 관계는 기록에 없어요.',
 },
 {
  num: 5, slug: 'thermal-commons', title: 'THERMAL COMMONS',
  contestSlug: 'gyeongnam-k-design', contestName: '2026 경남 K-디자인 전람회', year: 2026, award: '은상',
  fields: ['건축', '도시재생', '친환경 공간', '에너지 활용'],
  description: '산업시설의 열에너지와 기존 건축 자산을 활용하여 시민을 위한 복합 공공공간으로 전환하는 지속가능한 건축 프로젝트.',
  cover: cover('thermal-commons'), images: [w('thermal-commons-1', 1.4125)],
  contestFit: '산업시설을 시민 공간으로 전환하는 건축 프로젝트로, 공간·환경·서비스 부문과 맞닿아 있습니다. 특별 주제 중 "산업" 방향과 이어지는지는 작품 정보만으로는 확인할 수 없어요.',
 },
 {
  num: 6, slug: 'cadence', title: 'CADENCE', subtitle: 'Colors Between Sky and Earth',
  contestSlug: 'international-color', contestName: '2026 제7회 국제 대학생 색채 공모전', year: 2026, award: '특선', organizer: '한국색채학회',
  fields: ['색채디자인', '공간디자인'],
  description: '하늘과 대지의 색, 빛과 재료의 상호작용을 활용하여 색채의 흐름과 리듬을 공간으로 표현한 프로젝트.',
  cover: cover('cadence'), images: [w('cadence-1', 1)],
  contestFit: '대회 자체가 색채를 중심으로 하고, 작품은 색·빛·재료의 상호작용을 공간으로 풀었습니다. 색채디자인과 공간디자인을 함께 다룬 점이 특징입니다. 공모 주제와 심사 기준은 확인하지 못했어요.',
 },
 {
  num: 7, slug: 'woven-time', title: 'WOVEN TIME', subtitle: '시간을 엮다',
  contestSlug: 'bada', contestName: '2026 한국기초조형학회 대학생 국제공모전 BADA (Basic Art & Design Award)', year: 2026, award: '장려상', organizer: '한국기초조형학회',
  fields: ['건축', '조형디자인', '파빌리온'],
  description: '한국 전통 목구조의 반복성과 한옥의 처마 곡선을 현대적인 격자 및 반투명 구조로 재해석한 파빌리온 디자인.',
  cover: cover('woven-time'), images: [w('woven-time-1', 0.7063)],
  contestFit: '확인된 최근 회차의 공모 주제는 "전통을 잇고 미래를 디자인하다"입니다. 한옥의 처마와 전통 목구조를 현대적으로 재해석한 이 작품과 같은 방향입니다. 다만 이 주제가 이 작품의 출품 회차 주제였는지는 공식 공고로 확인이 필요해요.',
 },
 {
  num: 8, slug: 'future-seocho', title: '미래 서초, 기술과 문화가 흐르는 수변 플랫폼', subtitle: '자연·도시·기술이 조화를 이루는 지속가능한 수변 미래도시',
  contestSlug: 'seocho-ai-design', contestName: '2026 청년 AI 디자인 공모전', year: 2026, award: '장려상', organizer: '서울특별시 서초구', slogan: 'NEXT 서초, AI로 미래를 디자인하다',
  fields: ['AI 디자인', '미래도시', '수변공간', '스마트 인프라'],
  description: '서초구의 수변 공간을 중심으로 태양광 캐노피, 드론 배송, 무장애 이동 동선, 스마트 케어, 수상 모빌리티를 통합한 미래도시 공간 제안.',
  images: [], pdf: '/onus/pdf/future-seocho.pdf',
  contestFit: '공모 주제는 서초의 대표 장소나 상징을 포함해 기술과 문화가 융합된 미래 서초를 AI로 구현하는 것입니다. 이 작품은 서초구의 수변 공간을 중심에 두고 있어 장소 조건에 맞는 방향입니다. 보도 수치로는 263점이 접수되어 20점이 시상되었습니다. 이미지 분야 중 어디에 냈는지는 기록에 없어요.',
 },
 {
  num: 9, slug: 'the-last-voice', title: 'THE LAST VOICE', officialTitle: 'THE LAST VOICE — Memorial for The Livonian Language',
  contestSlug: 'ai-architecture-awards', contestName: 'AI Architecture Awards 2026', year: 2026, award: 'TOP TEN OVERALL',
  awardNote: '공식 선정 표기는 Top Ten Overall입니다. Shortlist와 구분되며, 대상이나 최우수상이 아닙니다.',
  fields: ['AI Architecture', '공간디자인', '기념공간'],
  description: '소멸 위기에 놓인 리보니아어를 주제로 언어의 파편화와 사라지는 문화적 기억을 건축적 공간 경험으로 표현한 프로젝트. 공중에 떠 있는 문자와 기호가 점차 해체되고 소멸하는 시퀀스를 통해 언어와 기억의 관계를 전달함.',
  cover: cover('the-last-voice'), images: [w('the-last-voice-1', 4.026)],
  contestFit: 'AI와 건축 환경을 다루는 국제 어워드이며 작업 영역에 건축과 인테리어·공간이 포함됩니다. 작품은 소멸 위기 언어를 기념공간으로 풀었습니다. Top Ten Overall 공식 명단은 확인하지 못해 이 표기는 제공된 기록을 그대로 따랐어요.',
 },
 {
  num: 10, slug: 'bioscape-hanbat', title: 'BIOSCAPE 한밭', subtitle: '생태와 기술의 풍경',
  contestSlug: 'daejeon-design-award', contestName: '2025 제34회 대전디자인어워드', year: 2025, award: '최우수상',
  fields: ['친환경 공간', '공공디자인', 'AI 기반 도시·조경디자인'],
  description: '대전 한밭수목원에 자연 생태와 스마트 기술을 유기적으로 결합한 미래형 수목원 및 시민 휴식 공간을 제안함.',
  cover: cover('bioscape-hanbat'), images: [w('bioscape-hanbat-1', 1.416), w('bioscape-hanbat-2', 1.416)],
  contestFit: '제34회 요강은 확인하지 못했습니다. 이 작품은 대전의 한밭수목원이라는 실제 장소를 대상으로 한 제안이고, 같은 회차의 CHRONOSCAPE(대전 시립미술관)도 대전의 장소를 다뤘습니다. 최우수상의 이유는 심사평을 확인하지 못해 알 수 없어요.',
 },
 {
  num: 11, slug: 'chronoscape', title: 'CHRONOSCAPE — 대전 시립미술관', subtitle: '시간의 미술관',
  contestSlug: 'daejeon-design-award', contestName: '2025 제34회 대전디자인어워드', year: 2025, award: '장려상',
  fields: ['건축', '전시공간', 'AI 기반 공간디자인'],
  description: '시간과 기억을 공간의 형태와 동선으로 해석하고, 미래형 미디어 전시 및 인터랙티브 경험을 결합한 미술관 제안.',
  cover: cover('chronoscape'), images: [w('chronoscape-1', 1.416), w('chronoscape-2', 1.416)],
  contestFit: '대전 시립미술관을 대상으로 한 건축·전시공간 제안입니다. 같은 회차의 BIOSCAPE 한밭(수목원)과 함께 대전의 장소를 다룬 작품입니다. 제34회 요강은 확인하지 못했어요.',
 },
 {
  num: 12, slug: 'mirage', title: 'MIRAGE', subtitle: '군사용 드론 제어의 발전',
  contestSlug: 'daejeon-design-award', contestName: '2025 제34회 대전디자인어워드', year: 2025, award: '입선',
  fields: ['제품디자인', '드론', '첨단기술 시스템'],
  description: '자율비행 드론과 실시간 지형 데이터 분석 및 정찰 지원 인터페이스를 결합한 미래형 군사용 드론 시스템 제안.',
  cover: cover('mirage'), images: [w('mirage-1', 1.4158), w('mirage-2', 1.416)],
  contestFit: '같은 회차의 다른 두 작품이 대전의 장소를 대상으로 한 건축·환경 제안이었던 것과 달리, 이 작품은 제품·시스템 디자인입니다. 한 회차에서 장소 기반 제안과 제품 제안이 함께 출품된 사례입니다.',
 },
];
