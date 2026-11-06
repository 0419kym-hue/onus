// 장학금 정보와 "나도 받을 수 있을까?" 자가 진단 규칙.
// 모든 정보는 2026-11-06에 공개 자료(학교·재단 안내, 검색 요약)에서 확인한 내용이며, 확인하지 못한 것은 unknown 에 적고 지어내지 않습니다.
// 자가 진단은 AI가 아니라 아래 조건을 그대로 비교하는 규칙입니다. 최종 자격은 반드시 공식 공고에서 확인해야 합니다.

export const SCHOLARSHIP_CHECKED_AT = '2026-11-06';

export type ScholarshipKind = '교내' | '교외';
export type Scholarship = {
 id: string;
 kind: ScholarshipKind;
 name: string;
 provider: string;
 summary: string;
 who: string[]; // 누가 받을 수 있나요
 amount: string;
 period: string; // 최근 확인된 신청 기간
 periodEnd?: string; // 최근 확인된 신청 마감일(YYYY-MM-DD). 오늘 이후면 "접수 중"으로 표시
 apply: string; // 신청 방법
 url: string;
 urlLabel: string;
 basis: string; // 근거
 unknown: string[]; // 확인하지 못한 것
};

export const scholarships: Scholarship[] = [
 // ---------- 교내 (한양여자대학교가 지급) ----------
 {
  id: 'excellence', kind: '교내', name: '성적우수장학금', provider: '한양여자대학교',
  summary: '입학 성적(신입생) 또는 직전 학기 성적(재학생)이 우수한 학생에게 수업료 일부를 감면해 주는 교내 장학금이에요.',
  who: ['신입생: 입학 성적이 우수하고 품행이 바른 학생', '재학생: 직전 학기 성적이 우수하고 품행이 바른 학생'],
  amount: '신입생은 입학금과 한 학기 수업료 일부, 재학생은 수업료 일부 감면',
  period: '학교 장학일정·장학공지에서 확인 (이번 조사에서 신청 기간은 확인하지 못했어요)',
  apply: '학교 장학 안내(장학금신청안내)에 따라 신청',
  url: 'https://www.hywoman.ac.kr/', urlLabel: '한양여대 홈페이지 → 장학제도',
  basis: '한양여대 장학금 지급 규정(검색 요약, 파일명에 "old"가 붙은 구버전일 수 있음)',
  unknown: ['선발 기준 점수와 인원, 감면 비율', '현재 규정과 같은지(최신 규정 확인 필요)'],
 },
 {
  id: 'aji', kind: '교내', name: '애지실천장학금', provider: '한양여자대학교',
  summary: '입학 성적(신입생) 또는 직전 학기 성적(재학생)이 양호한 학생을 지원하는 교내 장학금이에요.',
  who: ['신입생: 입학 성적이 양호한 학생', '재학생: 직전 학기 성적이 양호한 학생', '그 밖의 조건은 확인하지 못했어요'],
  amount: '확인하지 못했어요',
  period: '학교 장학일정·장학공지에서 확인',
  apply: '학교 장학 안내에 따라 신청',
  url: 'https://www.hywoman.ac.kr/', urlLabel: '한양여대 홈페이지 → 장학제도',
  basis: '한양여대 장학금 지급 규정(검색 요약, 구버전일 수 있음)',
  unknown: ['세부 지급 조건과 금액', '선발 인원'],
 },
 {
  id: 'hope', kind: '교내', name: '한양희망장학금', provider: '한양여자대학교',
  summary: '가정 형편이 어려운 학생을 돕는 교내 장학금이에요.',
  who: ['차상위계층 등 가정형편이 어려운 학생'],
  amount: '확인하지 못했어요',
  period: '학교 장학일정·장학공지에서 확인',
  apply: '증빙 서류가 필요할 수 있어요. 학교 장학 담당 부서에 문의',
  url: 'https://www.hywoman.ac.kr/', urlLabel: '한양여대 홈페이지 → 장학제도',
  basis: '한양여대 장학금 지급 규정(검색 요약, 구버전일 수 있음)',
  unknown: ['지급 금액', '필요한 증빙 서류', '"등"에 포함되는 대상의 범위'],
 },
 {
  id: 'dove', kind: '교내', name: '비둘기장학금', provider: '한양여자대학교',
  summary: '장애 학생과 다문화가족 학생의 수업료를 감면해 주는 교내 장학금이에요.',
  who: ['장애등급 3등급 이상인 학생: 수업료의 절반 감면', '다문화가족 학생: 수업료 일부 감면'],
  amount: '장애 학생 수업료 50%, 다문화가족 학생은 수업료 일부',
  period: '학교 장학일정·장학공지에서 확인',
  apply: '증빙 서류가 필요할 수 있어요. 학교 장학 담당 부서에 문의',
  url: 'https://www.hywoman.ac.kr/', urlLabel: '한양여대 홈페이지 → 장학제도',
  basis: '한양여대 장학금 지급 규정(검색 요약, 구버전일 수 있음)',
  unknown: ['장애등급제 폐지 이후의 현재 기준', '다문화가족 학생의 감면 비율', '필요한 증빙 서류'],
 },
 {
  id: 'staff', kind: '교내', name: '교직원 및 직계자녀 장학금', provider: '한양여자대학교',
  summary: '학교 교직원과 그 직계자녀를 위한 교내 장학금이에요.',
  who: ['한양여대 교직원 및 직계자녀'],
  amount: '확인하지 못했어요',
  period: '학교에 문의',
  apply: '학교 안내에 따라 신청',
  url: 'https://www.hywoman.ac.kr/', urlLabel: '한양여대 홈페이지 → 장학제도',
  basis: '한양여대 장학금 지급 규정(검색 요약, 구버전일 수 있음)',
  unknown: ['지급 금액과 조건'],
 },

 // ---------- 교외 (학교 밖 기관이 지급) ----------
 {
  id: 'national1', kind: '교외', name: '국가장학금 Ⅰ유형 (학생직접지원형)', provider: '한국장학재단',
  summary: '소득 구간과 성적 기준을 충족한 대학생의 등록금 부담을 덜어 주는 국가 장학금이에요. 학교가 아니라 한국장학재단에 신청해요.',
  who: ['대한민국 국적의 국내 대학 재학생', '소득 구간 8구간 이하 (재단 안내 기준. 일부 자료는 9구간 이하라고 달라 재단 공지에서 확인 필요)', '직전 학기 12학점 이상 이수, 성적 80점 이상 (기초·차상위는 70점 이상, 1~3구간은 C학점 경고제 2회)', '신입생·편입생은 첫 학기에 성적·이수학점 기준이 적용되지 않아요'],
  amount: '이번 조사에서 금액은 확인하지 못했어요',
  period: '2026학년도 2학기: 2026-08-12 ~ 09-09 18:00 (서류 제출 ~09-16 18:00). 다음 학기 일정은 아직 공고를 확인하지 못했어요',
  periodEnd: '2026-09-16',
  apply: '한국장학재단 누리집 또는 모바일 앱의 "국가장학금 통합 신청하기" (재학생은 원칙적으로 1차 신청 기간에만 신청)',
  url: 'https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_12_01_01', urlLabel: '한국장학재단 국가장학금 Ⅰ유형',
  basis: '한국장학재단 안내 페이지(페이지 확인) + 대학·금융 안내(검색 요약)',
  unknown: ['지원 금액', '2027학년도 1학기 신청 기간', '2027년 1학기부터 학자금 지원구간이 10구간에서 5구간으로 개편된다는 2차 자료가 있어 재단 공지 확인 필요'],
 },
 {
  id: 'work', kind: '교외', name: '국가근로장학금', provider: '한국장학재단 · 대학',
  summary: '학교나 기관에서 일하고 근로 대가를 받는 국가 장학금이에요. 한국장학재단에 신청하고, 기관별 기준으로 선발해요.',
  who: ['대한민국 국적의 학부 재학생 또는 신·편입생', '직전 학기 성적 70점 이상', '학자금 지원구간 9구간 이하', '휴학생·졸업자·자퇴자·외국인 학생·산업체위탁생은 신청할 수 없어요'],
  amount: '근로 시간에 따른 근로 대가 (구체 금액은 확인하지 못했어요)',
  period: '2026학년도 2학기: 1차 2026-05-22 ~ 06-22 18:00, 2차 08-12 ~ 09-09 18:00 (모두 마감). 한양여대는 2026-10-13에 "2026년 2학기 국가근로장학금 일반유형 추가신청"을 안내했어요',
  periodEnd: '2026-09-09',
  apply: '한국장학재단 누리집·앱에서 학생 신청 후 희망 근로지 신청. 대학마다 2차 신청을 받지 않는 곳도 있어요',
  url: 'https://www.kosaf.go.kr', urlLabel: '한국장학재단 → 장학금 → 국가근로',
  basis: '대학 공지(검색 요약) + 한양여대 장학공지 제목(검색 요약)',
  unknown: ['다음 학기 신청 기간', '한양여대의 근로 기관·선발 기준', '시급과 근로 시간 상한'],
 },
 {
  id: 'ladder2', kind: '교외', name: '고졸 후학습자 장학금 (희망사다리 Ⅱ유형)', provider: '한국장학재단',
  summary: '고등학교 졸업 후 일하며 대학에 다니는 학생의 등록금을 지원하는 장학금이에요. 소득 기준은 없어요.',
  who: ['대한민국 국적의 학부 재학생(신·편입생 포함)', '고등학교 졸업 후 재직 2년 이상 (중소·중견기업은 1년 이상), 심사일 기준 선발 대상 기업에 재직 중', '직전 학기 성적 70점 이상 (신·편입생은 성적 기준 없음)', '같은 학기에 재단의 다른 장학금을 받으면 제외'],
  amount: '등록금 전액 (대기업·비영리기관 재직자는 50%)',
  period: '2026학년도 2학기 신규 장학생: 2026-09-01 ~ 09-18 18:00 (마감). 1학기는 3월에 접수했어요',
  periodEnd: '2026-09-18',
  apply: '한국장학재단 누리집 또는 모바일 앱에서 학생이 직접 신청',
  url: 'https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_16_01', urlLabel: '한국장학재단 고졸 후학습자 장학금',
  basis: '한국장학재단 안내와 보도(검색 요약)',
  unknown: ['다음 신청 기간', '재직 인정 기업의 구체 범위'],
 },
 {
  id: 'seoul', kind: '교외', name: '서울인재대학장학금', provider: '서울미래인재재단 (구 서울장학재단)',
  summary: '서울 소재 대학에 다니는 1학년 대학생에게 연간 200만 원을 주는 서울시 장학금이에요.',
  who: ['2026년 2학기에 정규 등록할 예정인 1학년 대학생', '서울 소재 대학 재학생, 또는 서울시민(의 자녀)이면서 비서울 소재 대학에 다니는 학생'],
  amount: '연간 200만 원 1회 지급 (약 228명 선발)',
  period: '2026년 하반기: 2026-08-03 10:00 ~ 08-10 15:00 (마감). 다음 모집은 재단 공지에서 확인',
  periodEnd: '2026-08-10',
  apply: '서울미래인재재단 누리집에서 온라인 신청',
  url: 'https://www.seoulfuture.or.kr/', urlLabel: '서울미래인재재단',
  basis: '재단 공고(검색 요약)',
  unknown: ['선발 기준(소득·성적 가중치)', '2027학년도 신규 모집 일정'],
 },
 {
  id: 'seoul-interest', kind: '교외', name: '서울시 대학(원)생 학자금 대출이자 지원', provider: '서울시 (서울미래인재재단)',
  summary: '장학금은 아니지만, 한국장학재단 학자금 대출의 이자를 지원해 학비 부담을 줄여 주는 제도예요.',
  who: ['한국장학재단에서 학자금 대출을 받은 서울 거주 대학(원) 재학생·휴학생', '졸업 후 5년 이내 졸업생'],
  amount: '대출 이자 지원 (구체 금액은 확인하지 못했어요)',
  period: '2026년 제2차 모집이 있었어요. 신청 기간은 확인하지 못했어요',
  apply: '서울시·서울미래인재재단 안내에 따라 신청',
  url: 'https://www.seoulfuture.or.kr/', urlLabel: '서울미래인재재단',
  basis: '대학 공지(검색 요약)',
  unknown: ['신청 기간', '지원 금액·한도'],
 },
];

/** 교내 장학금은 서로 중복해서 받을 수 없고, 교내·교외는 중복할 수 있어요(합계가 등록금을 넘을 수 없음). */
export const OVERLAP_NOTE = '교내 장학금끼리는 내규가 허용하는 경우가 아니면 중복해서 받을 수 없어요. 교내 장학금과 교외 장학금은 함께 받을 수 있지만, 합계가 등록금을 넘을 수는 없어요. (한양여대 장학금 지급 규정, 검색 요약)';

// ---------------- 자가 진단 ----------------
export type Profile = {
 nationality: 'kr' | 'foreign';
 status: 'enrolled' | 'leave' | 'new';
 score: 'high' | 'mid' | 'low' | 'na';
 credits12: 'yes' | 'no' | 'na';
 income: 'basic' | 'b1_3' | 'b4_8' | 'b9' | 'b10' | 'unknown';
 freshman: 'yes' | 'no';
 workedAfterHS: 'yes' | 'no';
 lowIncomeFamily: 'yes' | 'no';
 disability: 'yes' | 'no';
 multicultural: 'yes' | 'no';
 staffChild: 'yes' | 'no';
};
export const DEFAULT_PROFILE: Profile = { nationality: 'kr', status: 'enrolled', score: 'high', credits12: 'yes', income: 'unknown', freshman: 'no', workedAfterHS: 'no', lowIncomeFamily: 'no', disability: 'no', multicultural: 'no', staffChild: 'no' };

export type Verdict = 'ok' | 'check' | 'no';
export type Reason = { ok: boolean | null; text: string }; // null = 확인 필요
export type Result = { id: string; verdict: Verdict; headline: string; reasons: Reason[] };

const sum = (reasons: Reason[], okMsg: string, checkMsg: string, noMsg: string): Pick<Result, 'verdict' | 'headline'> => {
 if (reasons.some((r) => r.ok === false)) return { verdict: 'no', headline: noMsg };
 if (reasons.some((r) => r.ok === null)) return { verdict: 'check', headline: checkMsg };
 return { verdict: 'ok', headline: okMsg };
};

export function evaluate(p: Profile): Result[] {
 const out: Result[] = [];
 const kr: Reason = p.nationality === 'kr' ? { ok: true, text: '대한민국 국적이에요' } : { ok: false, text: '대한민국 국적 학생이 대상이에요' };

 // 국가장학금 Ⅰ유형
 {
  const r: Reason[] = [kr];
  r.push(p.status === 'leave' ? { ok: null, text: '휴학 중이면 해당 학기에는 지원받기 어려워요. 복학 예정이라면 신청 가능해요' } : { ok: true, text: '재학(복학 예정)·신입생이에요' });
  r.push(
   p.income === 'b10' ? { ok: false, text: '소득 10구간은 지원 대상이 아니에요(2026년 기준)' }
   : p.income === 'b9' ? { ok: null, text: '9구간은 자료마다 대상 여부가 달라요. 재단 공지에서 확인해 주세요' }
   : p.income === 'unknown' ? { ok: null, text: '소득 구간을 모르면 한국장학재단에서 먼저 확인해 보세요' }
   : { ok: true, text: '소득 구간이 8구간 이하예요' },
  );
  if (p.status === 'enrolled') {
   r.push(p.credits12 === 'yes' ? { ok: true, text: '직전 학기 12학점 이상을 이수했어요' } : { ok: false, text: '직전 학기 12학점 이상 이수가 필요해요' });
   const low = p.income === 'basic';
   const warn = p.income === 'basic' || p.income === 'b1_3';
   r.push(
    p.score === 'high' ? { ok: true, text: '직전 학기 성적이 80점 이상이에요' }
    : p.score === 'mid' ? (low ? { ok: true, text: '기초·차상위는 70점 이상이면 돼요' } : warn ? { ok: true, text: '1~3구간은 C학점 경고제로 2회까지 지원받을 수 있어요' } : { ok: false, text: '80점 이상이 필요해요 (70점대는 기초·차상위, 1~3구간만 예외)' })
    : { ok: false, text: '직전 학기 성적이 70점 이상이어야 해요' },
   );
  } else {
   r.push({ ok: true, text: '신입·편입 첫 학기에는 성적·학점 기준이 적용되지 않아요' });
  }
  out.push({ id: 'national1', ...sum(r, '신청해 볼 수 있어요', '조건 확인이 필요해요', '지금은 조건이 맞지 않아요'), reasons: r });
 }

 // 국가근로장학금
 {
  const r: Reason[] = [kr];
  r.push(p.status === 'leave' ? { ok: false, text: '휴학생은 신청할 수 없어요' } : { ok: true, text: '재학생 또는 신·편입생이에요' });
  r.push(p.status === 'new' ? { ok: true, text: '신·편입생은 직전 학기 성적 기준이 없어요' } : p.score === 'high' || p.score === 'mid' ? { ok: true, text: '직전 학기 성적이 70점 이상이에요' } : { ok: false, text: '직전 학기 성적 70점 이상이 필요해요' });
  r.push(p.income === 'b10' ? { ok: false, text: '소득 9구간 이하가 대상이에요' } : p.income === 'unknown' ? { ok: null, text: '소득 구간을 한국장학재단에서 확인해 주세요' } : { ok: true, text: '소득 9구간 이하예요' });
  const res = sum(r, '신청 요건을 충족해요 (선발은 기관별 기준)', '조건 확인이 필요해요', '지금은 조건이 맞지 않아요');
  out.push({ id: 'work', ...res, reasons: r });
 }

 // 희망사다리 Ⅱ유형
 {
  const r: Reason[] = [kr];
  r.push(p.workedAfterHS === 'yes' ? { ok: true, text: '고졸 후 재직 경력이 있어요 (재직 기간 2년·중소중견 1년 이상인지 확인)' } : { ok: false, text: '고등학교 졸업 후 재직 2년 이상(중소·중견기업은 1년 이상)이 필요해요' });
  r.push(p.status === 'leave' ? { ok: false, text: '휴학 중에는 지원이 어려워요' } : { ok: true, text: '재학생 또는 신·편입생이에요' });
  r.push(p.status === 'new' ? { ok: true, text: '신·편입생은 성적 기준이 없어요' } : p.score === 'high' || p.score === 'mid' ? { ok: true, text: '직전 학기 성적이 70점 이상이에요' } : { ok: false, text: '직전 학기 성적 70점 이상이 필요해요' });
  const res = sum(r, '신청해 볼 수 있어요', '조건 확인이 필요해요', '지금은 조건이 맞지 않아요');
  out.push({ id: 'ladder2', ...res, reasons: r });
 }

 // 서울인재대학장학금
 {
  const r: Reason[] = [
   p.freshman === 'yes' ? { ok: true, text: '정규 등록 예정인 1학년이에요' } : { ok: false, text: '1학년 대학생이 대상이에요' },
   { ok: true, text: '한양여대는 서울 성동구에 있어 서울 소재 대학 재학생에 해당해요' },
  ];
  const res = sum(r, '신청해 볼 수 있어요 (다음 모집 일정 확인)', '조건 확인이 필요해요', '지금은 조건이 맞지 않아요');
  out.push({ id: 'seoul', ...res, reasons: r });
 }

 // 서울시 학자금 대출이자 지원은 대출 여부를 묻지 않으므로 진단에서 제외합니다.

 // 교내 성적우수 · 애지실천: 선발 기준(점수·인원)을 확인하지 못해 가능성만 안내합니다.
 for (const id of ['excellence', 'aji']) {
  const r: Reason[] = [];
  if (p.status === 'leave') r.push({ ok: false, text: '휴학 중에는 대상이 아니에요' });
  else if (p.status === 'new') r.push({ ok: null, text: '신입생은 입학 성적으로 선발해요. 선발 기준은 학교 공지에서 확인해 주세요' });
  else if (p.score === 'high') r.push({ ok: null, text: '직전 학기 성적이 우수하면 가능성이 있어요. 선발 기준 점수는 학교에서 확인해 주세요' });
  else r.push({ ok: null, text: '성적 기준이 있어 어려울 수 있어요. 선발 기준 점수는 학교에서 확인해 주세요' });
  out.push({ id, ...sum(r, '신청해 볼 수 있어요', '학교 선발 기준 확인이 필요해요', '지금은 대상이 아니에요'), reasons: r });
 }

 // 한양희망장학금
 {
  const poor = p.lowIncomeFamily === 'yes' || p.income === 'basic';
  const r: Reason[] = [poor ? { ok: null, text: '차상위계층 등 가정형편이 어려운 학생에 해당할 수 있어요. 증빙은 학교 장학 담당 부서에 확인해 주세요' } : { ok: false, text: '차상위계층 등 가정형편이 어려운 학생이 대상이에요' }];
  out.push({ id: 'hope', ...sum(r, '신청해 볼 수 있어요', '학교에 증빙 확인이 필요해요', '지금은 조건이 맞지 않아요'), reasons: r });
 }

 // 비둘기장학금
 {
  const hit = p.disability === 'yes' || p.multicultural === 'yes';
  const r: Reason[] = [hit ? { ok: null, text: p.disability === 'yes' ? '장애 학생은 수업료 50% 감면 대상이에요. 현재 장애 판정 기준은 학교에서 확인해 주세요' : '다문화가족 학생은 수업료 일부 감면 대상이에요. 증빙은 학교에서 확인해 주세요' } : { ok: false, text: '장애 학생 또는 다문화가족 학생이 대상이에요' }];
  out.push({ id: 'dove', ...sum(r, '신청해 볼 수 있어요', '학교에 증빙 확인이 필요해요', '지금은 조건이 맞지 않아요'), reasons: r });
 }

 // 교직원 및 직계자녀
 {
  const r: Reason[] = [p.staffChild === 'yes' ? { ok: true, text: '교직원 직계자녀예요' } : { ok: false, text: '교직원 및 직계자녀가 대상이에요' }];
  out.push({ id: 'staff', ...sum(r, '신청해 볼 수 있어요', '조건 확인이 필요해요', '지금은 조건이 맞지 않아요'), reasons: r });
 }

 return out;
}
