// 한양여자대학교(한양여대)의 공모전·대회와 관련된 기사 목록입니다.
// 검색으로 찾은 공개 기사를 모은 "수집 시점 기준" 목록이며, 제목과 링크는 원문 그대로이고 요약은 한 문장으로 다시 쓴 것입니다.
// 기사 본문은 옮기지 않고 원문 링크로 연결합니다. verified=true 는 기사 페이지를 열어 한양여자대학교 기사임을 확인한 항목입니다. 기사에 실린 학생 실명은 옮기지 않았습니다.
export type NewsTopic = '수상' | '개최' | '해커톤' | '성과' | '기타';
export type NewsItem = { title: string; outlet: string; date: string | null; url: string; summary: string; topic: NewsTopic; verified: boolean };

export const NEWS_CHECKED_AT = '2026-11-05';
export const NEWS_TOPICS: NewsTopic[] = ['수상', '개최', '해커톤', '성과', '기타'];

export const news: NewsItem[] = [
 {
  title: "한양여대, 교수학습혁신센터 학습지원 프로그램 우수 학생 통합 시상식",
  outlet: "한국대학신문",
  date: "2026-09-15",
  url: "https://news.unn.net/news/articleView.html?idxno=597477",
  summary: "교수학습혁신센터가 1학기 동안 활동한 학생 24개 팀·개인에게 시상했고, 경진대회 참가 9개 팀도 포함됐다.",
  topic: "개최",
  verified: true
 },
 {
  title: "한양여대, 멀티 AI 플랫폼 활용 공모전 수상 사례 숏폼으로 공개",
  outlet: "전자신문",
  date: "2026-08-03",
  url: "https://www.etnews.com/20260803000430",
  summary: "AI융합혁신센터가 공모전 수상 학생들의 생성형 AI 활용 경험을 짧은 영상으로 만들어 공유했다.",
  topic: "기타",
  verified: true
 },
 {
  title: "한양여대 혁신지원사업단, '2026학년도 숏폼 영상 콘텐츠 공모전' 시상식 개최",
  outlet: "전자신문",
  date: "2026-06-29",
  url: "https://www.etnews.com/20260629000412",
  summary: "혁신지원사업단이 숏폼 영상 콘텐츠 공모전 시상식을 열었고, 항공과 팀이 대상을 받았다.",
  topic: "개최",
  verified: true
 },
 {
  title: "한양여대 AI융합혁신센터, '멀티 AI 플랫폼 활용 공모전' 시상식 개최",
  outlet: "전자신문",
  date: "2026-06-16",
  url: "https://www.etnews.com/20260616000020",
  summary: "재학생 33명이 참여한 생성형 AI 활용 공모전에서 7명이 수상했다.",
  topic: "개최",
  verified: true
 },
 {
  title: "한양여대 인테리어디자인학과, 제13회 대학생 전시디자인공모전 대상 수상",
  outlet: "전자신문",
  date: "2026-04-28",
  url: "https://www.etnews.com/20260428000217",
  summary: "인테리어디자인학과 학생이 생성형 AI를 활용한 작품으로 산업통상자원부장관상(대상)을 받았다.",
  topic: "수상",
  verified: true
 },
 {
  title: "한양여대 재학생, 서초구 주최 디자인 공모전 '우수상' 수상",
  outlet: "에듀플러스",
  date: "2025-07-31",
  url: "https://www.eduplusnews.com/news/articleView.html?idxno=15516",
  summary: "산업디자인과 3학년 두 학생이 서초구 주최 공사장 가설울타리 상상디자인 공모전에서 우수상을 받았다.",
  topic: "수상",
  verified: true
 },
 {
  title: "한양여대 웹툰과, 전통 기록문화 활용 대학생 콘텐츠 공모전 대상 수상",
  outlet: "한국대학신문",
  date: "2024-11-12",
  url: "https://news.unn.net/news/articleView.html?idxno=570941",
  summary: "웹툰과 1학년 팀이 웹툰 기획안으로 문화체육관광부 장관상(대상)을 받았다.",
  topic: "수상",
  verified: true
 },
 {
  title: "한양여대 호텔관광학과, 한국관광레저학회 공모전 대상",
  outlet: "한국대학신문",
  date: "2021-09-06",
  url: "https://news.unn.net/news/articleView.html?idxno=515322",
  summary: "호텔관광학과 3학년 팀이 학회 대학생 아이디어 공모전에서 지역관광 게임 앱 제안으로 대상을 받았다.",
  topic: "수상",
  verified: true
 }
];

export function sortedNews(): NewsItem[] {
 return [...news].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}
