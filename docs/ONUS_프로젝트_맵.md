# ON:US 프로젝트 맵 (다른 AI·개발자용)

> 이 문서는 ON:US 코드를 처음 읽는 AI나 사람이 **개념 → 구조 → 규칙** 순서로 빠르게 이해하도록 만든 안내서입니다.
> 사실이 바뀌면 이 문서도 같이 고치세요. 확인하지 않은 내용은 "미확인"이라고 적습니다.
> 마지막 정리: 2026-11-06

## 0. 심사자(AI·사람)를 위한 30초 요약

| 질문 | 답 |
|---|---|
| 무엇인가 | 한양여대 학생이 선배의 수상작·준비 기간·제출 규격을 근거로 다음 공모전 도전을 정하게 돕는 플랫폼 |
| 해커톤 주제와의 관계 | "내 전공 현장을 바꾸는 AI": 학생의 학과·수업을 읽어 맞는 공모전과 닮은 선배를 연결 |
| 배포 주소 | https://hy-company-eight.vercel.app/onus |
| 저장소 | https://github.com/0419kym-hue/onus (main) |
| 핵심 코드는 어디 | AI 추천 `app/api/onus/recommend/route.ts` · 닮은 선배 규칙 `lib/onus/fields.ts` · 데이터 `lib/onus/works.ts`, `contests.ts` · 수상작 올리기 `app/onus/submit/`, `components/onus/SubmitWorkForm.tsx`, `supabase/migrations/20261106120000_*.sql` |
| 확인 방법 | `npm run typecheck` → `npm run build`(모든 라우트가 목록에 나와야 함). 환경변수 없이도 빌드되고, 키가 없으면 AI API는 503으로 안내 |
| 설계 원칙 | ① AI는 번호만 고르고 제목·링크·날짜는 서버 데이터로 채움(환각 방지) ② 선배 매칭·기간 비교는 AI가 아닌 규칙 ③ 모르는 것은 `unknown`/"기록 없음"으로 표시 ④ 회차가 다른 정보를 섞지 않음 ⑤ 구현·미구현을 `/onus/about`에 그대로 공개 |
| 알려진 빈틈 | 사용자 인터뷰 결과 없음 · 선배 실행 단계 기록 없음(기간만) · 작품 업로드는 **DB 마이그레이션 적용 전에는 "준비 중" 안내만 표시**(적용 방법은 6장) · 인증 리뷰어 매칭·PDF 규격 점검은 미구현 |

## 1. 한 줄 개념

**ON:US** = 한양여자대학교 학생이 공모전을 준비할 때, **같은 학교 선배의 실제 출품작·수상 기록·준비 기간·제출 규격**을 대회 정보와 연결해 보여 주고, 학과·수업을 바탕으로 **닮은 선배와 도전할 공모전을 추천**하는 웹 플랫폼.

- 이름 뜻: ON(연결하고 활성화하다) + US(우리). 슬로건 "우리의 도전에 불을 켜다."
- 핵심 사용자: 공모전을 찾아보거나 준비하는 한양여대 재학생. 공급자는 수상·출품 선배.
- 한 문장 가치: 선배의 실제 경험을 근거로 자기 도전의 다음 행동을 정하게 한다.
- 기획 원문: `docs/ONUS_기획서.md`, `docs/ONUS_요구사항.md`. 심사 관점 점검: `docs/ONUS_심사기준_자체평가.md`.

### 개념 용어
| 용어 | 뜻 |
|---|---|
| 작품(Work) | 선배가 낸 출품작 1건. 대회·연도·수상 등급·분야·설명·표지·보드 이미지 포함 (`lib/onus/works.ts`) |
| 대회(Contest) | 아카이브에 연결된 대회의 성격·확인된 정보·모르는 것·확인할 점·출처 (`lib/onus/contests.ts`) |
| 외부 공모전(ExternalContest) | 지금 접수 중인 공모전 목록. 수집 시점 기준이며 마감 지난 것은 화면에서 자동 제외 (`lib/onus/external-contests.ts`) |
| 준비 기록(Journey) | 선배의 준비 기간·단계 기록. **값이 있는 것만 보여 주고 추측으로 채우지 않는다** (`lib/onus/types.ts`, `journey.ts`) |
| 분야 태그(FieldKey) | space/product/visual/ai/idea/color 6개. 학과·수업·작품·공모전을 같은 기준으로 비교 (`lib/onus/fields.ts`) |
| 닮은 선배 | 사용자의 분야 태그·학과와 겹치는 선배 작품. **AI가 아니라 서버 규칙**으로 계산 |

## 2. 기술 스택과 실행

- Next.js **16.4.5** App Router, React 19.3, TypeScript strict(`@/*` 경로). Tailwind 없음, 일반 CSS.
- **이 Next.js는 기존 버전과 다릅니다.** 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 관련 문서를 읽으세요 (`AGENTS.md`).
- 3D: three + @react-three/fiber + drei (메인 히어로만, 브라우저에서만 로드).
- DB: Supabase (커뮤니티·인증 신청에만 사용). 아카이브·대회·소식은 **코드 안의 큐레이션 데이터**.
- AI: OpenAI Chat Completions(`gpt-5.4-mini`), **서버 API route에서만** 호출.
- 배포: Vercel 프로젝트 `hy-company` (프로덕션 별칭 `hy-company-eight.vercel.app`). 저장소: `github.com/0419kym-hue/onus` (main).
- 명령: `npm run dev` / `npm run typecheck` / `npm run build`. lint·test 스크립트는 없음.

### 환경변수 (값은 절대 코드·문서·Git에 넣지 않기)
| 이름 | 용도 | 비고 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 커뮤니티 읽기 | 둘 다 없을 때만 예시 모드 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 쓰기(HY컴퍼니 지원서 등) | 서버 전용, `NEXT_PUBLIC_` 금지 |
| `OPENAI_API_KEY` | AI 추천 | 서버 전용. 없으면 API가 503 |
| `ONUS_AI_DISABLED` | `true`면 AI 추천을 끔 | 해커톤 트랙 규정상 AI를 쓰면 안 될 때 사용 |

## 3. 사이트맵 (라우트)

| URL | 파일 | 역할 | 데이터 |
|---|---|---|---|
| `/onus` | `app/onus/page.tsx` | 메인: 3D 히어로, 통계 띠, 마감 티커, AI 추천, 도전 찾기, 서비스 타일, 수상작 쇼케이스, 마감 임박, 소식, CTA | 정적 데이터 + 오늘 날짜 |
| `/onus/recommend` | `app/onus/recommend/page.tsx` | AI 맞춤 추천 전용 페이지 | `/api/onus/recommend` |
| `/onus/archive` | `app/onus/archive/page.tsx` | 수상 아카이브: 통계, 한눈에 비교 표, 대회별 갤러리 | works, contests |
| `/onus/works/[slug]` | `app/onus/works/[slug]/page.tsx` | 작품 상세: 한눈 요약, 대회 연결, 보드, 준비 기록, 코멘트 | works, contests, Supabase 코멘트 |
| `/onus/contests` | `app/onus/contests/page.tsx` | 접수 중 공모전 + 아카이브 대회 목록 | external-contests, contests |
| `/onus/contests/[slug]` | `app/onus/contests/[slug]/page.tsx` | 대회 성격, 확인된 정보, **출품 준비 체크리스트**, 선배 출품작, 출처 | contests, works |
| `/onus/news` | `app/onus/news/page.tsx` | 한양여대 관련 기사 | `lib/onus/news.ts` |
| `/onus/board` | `app/onus/board/page.tsx` | 나의 도전 보드(담은 공모전, 브라우저 저장) | localStorage (`lib/onus/board.ts`) |
| `/onus/community`, `/onus/community/[id]` | `app/onus/community/**` | 팀원 모집·모임·이야기 글과 댓글 | Supabase `onus_posts`, `onus_comments` |
| `/onus/verify` | `app/onus/verify/page.tsx` | 수상·출품 경험 인증 신청 | Supabase `onus_verifications` |
| `/onus/admin` | `app/onus/admin/page.tsx` | 운영자: 경험 인증 심사 + 올라온 수상작 승인(운영자 이메일 로그인) | Supabase |
| `/onus/scholarships` | `app/onus/scholarships/page.tsx` | 교내(한양여대)·교외 장학금 구분, 신청 기간·대상·방법, 규칙 기반 자가 진단 | `lib/onus/scholarships.ts` (데이터+`evaluate()` 규칙), `components/onus/ScholarshipBoard.tsx` |
| `/onus/activities` | `app/onus/activities/page.tsx` | 대외활동 사이트·정부·교내 지원, 모집 중 예시(마감 지나면 자동 숨김), 조심할 점 | `lib/onus/activities.ts` |
| `/onus/submit` | `app/onus/submit/page.tsx` | 수상작 올리기: 작품 정보·이미지 업로드, 운영자 승인 후 아카이브에 공개 | Supabase `onus_work_submissions`, 저장소 `onus-works` |
| `/onus/about` | `app/onus/about/page.tsx` | 서비스 소개(문제·해결·AI 사용 범위·구현 상태) | 정적 + 집계 |
| `/api/onus/recommend` | `app/api/onus/recommend/route.ts` | AI 추천 API (POST) | OpenAI + 서버 데이터 |
| `/`, `/jobs/[id]`, `/career`, `/setup`, `/api/apply` | `app/**` | **기존 HY컴퍼니 수업용 화면. 건드리지 않음** | Supabase |

공통: `app/onus/layout.tsx`(헤더·푸터·CSS 로드), `app/layout.tsx`(HY컴퍼니 공통 레이아웃).

## 4. 코드 지도

### 스타일 (로드 순서 = 우선순위)
`app/onus/onus.css`(기본) → `onus-redesign.css`(1차 개편) → **`onus-toss.css`(최종 테마, 토스 스타일 + 유리 배경)**. 새 스타일은 `onus-toss.css` 맨 아래에 추가. 모든 규칙은 `.onus` 범위. 디자인 기준은 `DESIGN.md`.

### 데이터·로직 (`lib/onus/`)
| 파일 | 내용 |
|---|---|
| `types.ts` | Work, Contest, Journey 등 타입 |
| `works.ts` | 선배 작품 12건 + 준비 기간(`journeyOf`) |
| `contests.ts` | 대회 6개: 성격·facts(근거 `basis` 병기)·unknown·checkpoints·sources·editions |
| `data.ts` | 정렬·조회·통계 헬퍼 |
| `awards.ts` | 수상 등급 순위·표기 |
| `fields.ts` | 분야 태그, 학과·수업→태그 규칙, `similarSeniors()` |
| `journey.ts` | 준비 기간 → 일 수·문구 |
| `external-contests.ts`, `news.ts` | 수집 데이터(`*_CHECKED_AT` = 수집일) |
| `flags.ts` | `aiEnabled()` |
| `scholarships.ts` | 장학금 데이터(교내/교외, 근거 `basis`, 확인하지 못한 것 `unknown`)와 자가 진단 규칙 `evaluate()` — AI 아님 |
| `activities.ts` | 대외활동 사이트·모집 예시 데이터(수집일 2026-11-06) |
| `submissions.ts` | 운영자가 승인한 학생 작품 읽기(서버), 이미지 주소 |
| `community*.ts`, `badges.ts`, `anon.ts`, `admin-client.ts`, `supabase-browser.ts`, `board.ts` | Supabase·브라우저 저장 관련 |

### 컴포넌트 (`components/onus/`)
- 레이아웃·공통: `OnusHeader`, `PageHead`, `Reveal`(스크롤 등장), `Icons`, `AwardBadge`
- 메인: `HeroScene` → `Hero3D`(3D, `ssr:false` 동적 로드), `CountUp`, `Tilt`, `ChallengeFinder`(규칙 기반 도전 찾기), `AiRecommend`
- 아카이브: `ArchiveOverview`(비교 표), `WorkGallery`, 올라온 작품 카드(`archive/page.tsx`)
- 수상작 올리기: `SubmitWorkForm`(학생), `AdminWorks`(운영자 승인)
- 마스코트: 이미지 `public/onus/brand/hywu-crew.*`(세 캐릭터), `hywu-nari.*`(나리, AI 도우미). 원본은 학교 제공 JPG에서 흰 배경만 투명 처리. 표기: © Hanyang Women's University(푸터)
- 대회: `PrepChecklist`(체크리스트, localStorage), `ExternalContests`, `SaveButton`
- 커뮤니티·인증: `CommentThread`, `PostForm`, `PostActions`, `IdentityFields`, `VerifyForm`, `AdminReview`, `NewsList`, `BoardView`

### AI 추천 흐름 (`app/api/onus/recommend/route.ts`)
1. 동일 출처·IP 분당 5회·본문 5,000자 제한, `aiEnabled()` 확인, 키 확인
2. 서버가 마감 전 공모전 후보 목록과 남은 일수를 만들어 **프롬프트에 포함**
3. 모델은 **번호(id)·이유·적합도·준비 일정·태그만** JSON 스키마(strict)로 반환
4. 서버가 번호를 검증하고 제목·링크·마감일은 **서버 데이터에서** 채움
5. 서버 규칙으로 닮은 선배(`similarSeniors`)와 준비 기간 비교(`pace`)를 계산해 합침
6. 입력은 저장하지 않음. OpenAI 오류 내용은 로그에만 남기고 사용자에게는 일반 문구

## 5. 반드시 지킬 규칙

**사실과 표기**
1. 확인하지 못한 사실을 쓰지 않는다. 모르면 `unknown` 목록이나 "기록 없음"으로 남긴다.
2. 대회 정보는 `facts[].basis`에 근거(공식 페이지 확인 / 검색 요약)를 적는다. 수집일(`*_CHECKED_AT`)은 실제로 다시 확인했을 때만 바꾼다.
3. 작품·수상 기록은 제공자 본인의 것이다. 작품명·대회명·연도·등급은 제공된 표기를 임의로 바꾸지 않는다. 학생 실명·학번은 화면·파일명에 넣지 않는다.
4. 준비 기록(`journey`)은 작성자가 준 값만 넣는다. 심사평·입상 이유·작성자의 의도는 지어내지 않는다 (`contestFit`은 "초안 · 작성자 확인 필요").
5. 회차가 다른 정보를 섞지 않는다 (2025 작품에 2026 일정 표시 금지 — `works/[slug]/page.tsx`의 회차 필터 참고).

**AI와 개인정보**
6. AI는 서버 API route에서만 호출한다. `OPENAI_API_KEY`에 `NEXT_PUBLIC_`을 붙이지 않는다.
7. AI가 링크·제목·날짜를 만들게 하지 않는다. 후보 번호만 고르게 하고 서버 데이터로 채운다.
8. 작품 점수화·수상 가능성 예측은 하지 않는다. (추천의 "적합도"는 공모전과의 맞음 정도이지 작품 평가가 아니다.)
9. 사용자 입력(학과·수업)은 서버에 저장하지 않는다. 이름·학번·연락처를 받지 않는다.
10. **해커톤 트랙 주의**: 기획서(`ONUS_기획서.md`)는 이 해커톤을 "트랙 2 (AI 기술 미사용)"로 적고 있다. 현재 사이트에는 AI 추천이 있어 **충돌 가능성이 있다.** 트랙 규정을 확인하고, 필요하면 `ONUS_AI_DISABLED=true`로 끈다. 이 판단은 사용자가 한다.

**코드와 작업 방식**
11. `/`, `/jobs`, `/career`, `/setup`, `api/apply`, `globals.css`, 기존 테이블·마이그레이션은 수정·삭제하지 않는다.
12. 변경 후 `npm run typecheck`와 `npm run build`를 실행하고 결과를 그대로 보고한다. 실행하지 않은 확인을 했다고 쓰지 않는다.
13. 비밀 값(키·토큰)은 코드·문서·커밋에 넣지 않는다. `.env*`는 Git에서 제외되어 있다(`.env.example`만 포함).
14. 배포(`vercel deploy --prod`)와 `git push`는 사용자가 요청했을 때만 한다. 토큰은 사용자가 준 것을 그 작업에만 쓴다.
15. 문구는 한국어 존댓말 해요체, 쉬운 말. 큰 제목 크기는 `DESIGN.md` 타입 스케일을 따른다.
16. 한국어 경로·파일명이 있는 Windows 환경이다. 셸 따옴표 문제가 생기면 파일 도구로 쓴다.
17. 사이트 문구에서 로그인 유무를 내세우는 표현을 쓰지 않는다(사용자 요청). 로그인을 도입하자는 뜻이 아니라 문구만 피한다.
18. 마스코트 이미지는 학교 소유다. 변형(색·표정)하지 않고 출처 표기를 유지한다.
19. 장학금·대외활동 정보는 확인한 공개 자료만 쓰고 `unknown`에 모르는 것을 남긴다. 자격 판정은 AI가 아니라 `evaluate()` 규칙으로만 하고, 결과에는 "공식 공고 확인" 안내를 유지한다.
20. 운영 DB를 바꾸는 명령(`supabase db push`)은 사용자가 직접 실행한다. 마이그레이션 파일은 `supabase/migrations/`에 두고 적용 여부를 확인해서 쓴다.

## 6. 알려진 한계 (2026-11-06 기준)
- 사용자 검증(인터뷰) 결과 없음. 문제 정의는 가설이다.
- 기획서의 P0 중 **작품 등록·PDF 규격 점검, 인증 리뷰어에게 피드백 요청·수정 체크리스트, 데모 로그인은 미구현**이다.
- 선배 준비 기록은 기간만 있고 실행 단계·시도·도구는 비어 있다.
- 한국색채학회 제7회 요강은 포스터 이미지로만 공개되어 글로 확인하지 못했다.
- 3D 히어로는 WebGL이 없는 환경에서는 그라디언트 배경만 보인다(의도된 폴백).
- 시각디자인·경영 분야로 수상한 선배 작품이 아직 없어 해당 학과 추천 시 "선배 없음" 안내가 나온다.

## 7. 마이그레이션 적용 방법 (수상작 올리기)

`supabase/migrations/20261106120000_onus_work_submissions.sql`은 새 테이블 `onus_work_submissions`, 저장소 `onus-works`, 운영자용 함수를 추가한다(기존 테이블은 수정하지 않음).
원격 적용 현황은 `npx supabase migration list --remote`로 확인하고, 아래 명령으로 적용한다.

```sh
npx supabase db push --remote --dry-run   # 올라갈 파일만 미리 확인
npx supabase db push --remote             # 실제 적용
```

적용 후에는 `/onus/submit`에서 작품을 올리고, `/onus/admin`에서 운영자(`onus_admins` 등록 이메일)로 로그인해 승인하면 `/onus/archive`의 "새로 올라온 수상작"에 보인다.
