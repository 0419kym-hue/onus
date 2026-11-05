// 외부 공모전 정보 사이트(주로 위비티)의 공개 상세 페이지를 읽어 모은 "수집 시점 기준" 목록입니다.
// 실시간 연동이 아니며, 접수 일정·대상은 바뀔 수 있으므로 반드시 상세 링크의 공식 안내에서 다시 확인해야 합니다.
// 마감일이 지난 항목은 화면에서 자동으로 숨깁니다. 마감일은 상세 페이지의 접수 기간 끝 날짜입니다.
export type ExternalContest = { title: string; organizer: string; deadline: string; field: string; eligibility: string; url: string; source: string };

export const EXTERNAL_CHECKED_AT = '2026-11-05';

export const externalContests: ExternalContest[] = [
 { title: '제14회 한옥디자인 국제 공모전', organizer: '사단법인 한옥건축학회', deadline: '2026-12-28', field: '디자인/건축', eligibility: '일반인, 대학생', url: 'http://www.modernhanok.org/default/online/01.php?com_board_basic=read_form&com_board_idx=54&sub=0&top=5&com_board_id=20', source: '위비티' },
 { title: '2026 대한건축사협회 대학(원)생 모듈러건축 공모전', organizer: '대한건축사협회 (주관: 모듈러건축위원회)', deadline: '2026-12-02', field: '건축', eligibility: '건축 관련 학과 대학생·대학원생(재학/휴학), 팀당 2인 이내', url: 'https://www.kira.or.kr/jsp/main/01/01.jsp?ba_bbsId=BBS_00_NOTICE&bbsLocale=&sc_ba_bbsId=BBS_00_NOTICE&mode=read&sc_ba_cateId=&sc_scType=1&sc_keyword=&sc_ba_titleL=&sc_ba_authorNameL=&ba_id=264476', source: '위비티' },
 { title: '2026 제1회 KIBE 융합디자인 공모전', organizer: '(사)한국녹색플랜연구원', deadline: '2026-12-31', field: '건축/디자인', eligibility: '대학생(대학원생 포함), 개인 또는 5인 이내 팀', url: 'https://landkibe.or.kr/notice.jsp?key=323&gbn=%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD', source: '위비티' },
 { title: '[제3회] 매경 AI 광고 공모전 대한민국 AI 광고대상', organizer: '매경미디어 (주관: 매경ECONOMY·MINDSPARK·매경AX)', deadline: '2026-11-30', field: 'AI/광고/영상/아이디어', eligibility: '일반인, 대학생, 청소년 (만 14세 이상, 개인·팀)', url: 'https://aimk.ai', source: '위비티' },
 { title: '선샤인 TIME TRAVEL 숏폼 영상 공모전', organizer: 'SBS A&T', deadline: '2026-11-12', field: '영상/숏폼/광고', eligibility: '제한없음 (대한민국 국민, 개인 또는 5인 이내 팀)', url: 'https://docs.google.com/forms/d/e/1FAIpQLSffpfSgOU1UQHK-kpsjUXhgGewCGGhDIbnirpGBC07JMQg0xQ/viewform', source: '위비티' },
 { title: '2026 DATA·AI 분석 경진대회', organizer: '한국과학기술정보연구원(KISTI)', deadline: '2026-11-10', field: '데이터/AI', eligibility: '일반인, 대학생, 청소년', url: 'https://aida.kisti.re.kr/competition/main/competition/COMP_000000000000050/detail.do', source: '위비티' },
 { title: '2026 대경권 캠퍼스 IR 챔피언십 (창업 공모전)', organizer: '(주)포항연합기술지주', deadline: '2026-11-13', field: '창업/아이디어', eligibility: '대구·경북 소재 대학 재학생 및 졸업 3년 이내(팀원 모두 해당)', url: 'https://dgcic.co.kr', source: '위비티' },
 { title: '7th Da-Ho Award Asian International Short Film Competition(단편영화 공모전)', organizer: 'Da-Ho Construction Co., Ltd.', deadline: '2027-01-15', field: '영상/단편영화', eligibility: '제한없음 표기. 상세: 대만 제외 아시아 국적 감독, 대만 유학 아시아 학생 가능', url: 'https://bhuntr.com/en/competitions/gvh92bf81bpb8pirvd', source: '위비티' },
 { title: '농업가치 확산을 위한 농심천심 대학(원)생 논문 공모전', organizer: '농업협동조합중앙회', deadline: '2027-02-26', field: '논문/아이디어', eligibility: '대학·대학원 재학생 및 휴학생(전공 무관). 접수 2027-02-22~02-26', url: 'https://www.nonghyup.com/introduce/research/researchPaperCompetition.do', source: '위비티' },
 { title: '2026 청년의 시간(성남 청년 참여 예산제) 참가팀 모집', organizer: '성남시청소년청년재단', deadline: '2026-11-22', field: '공공 아이디어', eligibility: '성남 거주·근무·학업·활동 19~39세 청년, 3~6인 팀', url: 'https://www.snyouth.or.kr/fmcs/289?action=read&action-value=79dc727035b9c04bee890ecabb8bc95b', source: '위비티' },
 { title: 'Tree Eco 파충류 캐릭터 디자인 공모전', organizer: '트리에코 / 문도에이아이', deadline: '2026-11-19', field: '캐릭터 디자인', eligibility: '제한없음', url: 'https://tree-submit.haejo.ai/', source: '위비티' },
 { title: '제2회 서울대학교 SNU Commons 중앙도서관 융합 미디어 작품 공모전', organizer: '서울대학교 중앙도서관', deadline: '2026-11-29', field: '영상/미디어', eligibility: '서울대 학부·대학원생(휴학·연구생 포함)', url: 'https://lib.snu.ac.kr/', source: '위비티' },
 { title: '대학생 시선으로 바라보는 영해 발견 콘텐츠 공모전', organizer: '영덕군', deadline: '2026-11-06', field: '영상/콘텐츠', eligibility: '경북 소재 대학 재학생, 개인 또는 4인 이내 팀', url: 'https://www.yd24.or.kr/notice/대학생-시선으로-바라보는영해-발견-콘텐츠-공모전/', source: '위비티' },
 { title: '[한국체육산업개발(주)] 공공데이터 활용 경진대회', organizer: '한국체육산업개발(주)', deadline: '2026-12-01', field: '공공데이터/IT', eligibility: '제한없음', url: 'https://www.wevity.com/?c=find&s=1&gbn=view&gp=1&ix=112160', source: '위비티' },
 { title: 'AI·융합교육 신규 통합 플랫폼 네이밍 공모전', organizer: '한국과학창의재단 / 교육부', deadline: '2026-11-18', field: '네이밍', eligibility: '제한없음 (1인 2건)', url: 'https://sai.software.kr/notification/notice/0371b425-0f8d-4226-a73e-c5e6167cb5c1', source: '위비티' },
 { title: '두찜에서 맥북 네오 쏜다 두찜 꿀조합 공모전', organizer: '(주)기영에프앤비 / 두찜', deadline: '2026-11-30', field: '광고/마케팅', eligibility: '제한없음 (공개 계정 참여)', url: 'https://www.instagram.com/twozzim/p/De1OhOqGM0x/', source: '위비티' },
 { title: 'AI 달인의 꿀팁 챌린지 시즌4', organizer: '과학기술정보통신부', deadline: '2026-11-20', field: 'AI', eligibility: '제한없음', url: 'https://aichallenge4all.or.kr/competitions/master100_s4', source: '위비티' },
 { title: '2026 성평등 AI 벤치마크 챌린지 참가팀 모집', organizer: '성평등가족부', deadline: '2026-11-20', field: 'AI', eligibility: '제한없음', url: 'https://www.mogefdatacontest.co.kr/index.jsp', source: '위비티' },
 { title: '[CJ제일제당] 햇반 30주년 AI 공모전 (갓 지은 AI디어)', organizer: 'CJ제일제당', deadline: '2026-11-13', field: 'AI/아이디어', eligibility: '일반인, 대학생, 청소년', url: 'https://www.instagram.com/hetbahn.30years/', source: '위비티' },
 { title: '제2회 2026 대한민국 AI 창조공모대전', organizer: '한국창조미술협회', deadline: '2026-11-27', field: 'AI 미술', eligibility: '제한 없음 (대한민국 국민 누구나)', url: 'https://koreaaiart.com/', source: '위비티' },
 { title: '현대자동차그룹 차량용 앱 개발 공모전', organizer: '현대자동차그룹', deadline: '2026-11-15', field: '앱 개발/IT', eligibility: '일반인, 대학생', url: 'https://appdevchallenge.auto-hmg.io/landing', source: '위비티' },
 { title: '[세종사이버대학교 AI실무활용학과] 한국 고전 설화 또는 전래동화 캐릭터의 재해석 공모전', organizer: '세종사이버대학교 AI실무활용학과', deadline: '2026-11-16', field: 'AI 이미지/영상/컷툰', eligibility: '전공생 및 AI 콘텐츠 제작에 관심 있는 일반인 누구나', url: 'https://home.sjcu.ac.kr/ai-intel/community/data.do?mode=view&articleNo=138855', source: '위비티' },
 { title: '2026 K-AWARDS DIGITAL EXCELLENCE AWARDS', organizer: '사단법인 한국디지털에이전시협회', deadline: '2026-11-09', field: '웹/디지털', eligibility: '대학생, 청소년 (고등학생·대학생 재학생, 개인/팀)', url: 'https://www.kwaa.or.kr/K-awards2026/', source: '위비티' },
 { title: '한국공학한림원 공학의 가치 숏폼 콘테스트', organizer: '한국공학한림원', deadline: '2026-11-20', field: '영상/숏폼', eligibility: '만 19세 이상 국내 대학·대학원 재학/휴학생, 개인 또는 3인 이내 팀', url: 'https://sites.google.com/view/engineering-value-contest/', source: '위비티' },
 { title: '2026 조달청 AI 게임·콘텐츠 공모전', organizer: '조달청', deadline: '2026-11-22', field: 'AI/게임·콘텐츠', eligibility: '제한없음 (대한민국 국민, 개인/팀)', url: 'https://blog.naver.com/ppspr/224439199284', source: '위비티' },
 { title: '제1회 한아전 게임 시나리오·그래픽 공모전', organizer: '한국IT전문학교', deadline: '2026-11-30', field: '게임 시나리오/그래픽', eligibility: '청소년, 기타 (대학생 참가 가능 여부 불명확)', url: 'https://www.kart.ac.kr/new2/main/sub.asp?avan=1002020000&KOREAIT_newsMode=view&intseq=6795', source: '위비티' },
 { title: '건강보험심사평가원 광고 온에어 기념 이벤트', organizer: '건강보험심사평가원', deadline: '2026-11-15', field: '광고/영상 이벤트', eligibility: '제한없음', url: 'https://vo.la/O5a6KCv', source: '위비티' },
 { title: '제1회 동물사랑 디카시 공모전', organizer: '한국디카시인협회 서울북부지회', deadline: '2026-11-30', field: '문학/디카시', eligibility: '제한없음', url: 'https://cafe.daum.net/.dicapoemjournal/MnJe/3', source: '위비티' },
];

export const contestSites = [
 { name: '위비티', url: 'https://www.wevity.com' },
 { name: '링커리어', url: 'https://linkareer.com' },
 { name: '씽굿', url: 'https://www.thinkcontest.com' },
 { name: '올콘', url: 'https://www.all-con.co.kr' },
 { name: '콘테스트코리아', url: 'https://www.contestkorea.com' },
];
