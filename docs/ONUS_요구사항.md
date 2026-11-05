# ON:US 요구사항 문서와 개발 계획

표기: **[확인]** 실제로 확인한 사실 · **[가설]** 검증 전 가정 · **[결정]** 합의 · **[제안]** 확인 필요

# PART B. 요구사항 문서와 개발 계획

## B1. 기존 프로젝트 분석 결과 [확인]

폴더 `C:\Users\유민\my-project333\hy-company\hy-company`

| 항목 | 확인 내용 |
|---|---|
| 스택 | Next.js 16.4.5 App Router, React 19.3.1, TypeScript strict(`@/*`). **Tailwind 없음**, 스타일은 `app/globals.css` 110줄 일반 CSS |
| 기존 화면 | `/`(HY컴퍼니), `/jobs/[id]`, `/career`(이미 구현됨. README는 "34번에서 추가"라고 되어 있어 문서와 불일치), `/setup`, `api/apply` |
| 데이터 | Supabase, 테이블 `hy_company_jobs`, `careerly_jobs`, `applications`. 마이그레이션 4개 |
| 인증·업로드·AI | **모두 없음.** `supabase.auth`, Storage, 파일 입력, LLM 호출 코드 없음 |
| 스크립트 | `dev`, `build`, `start`, `typecheck`. lint·test 없음 |
| 폰트·스타일 | Pretendard 로컬 폰트(외부 서버 접속 없음), 배경 `#faf8f4`, 주색 보라, 반응형 1000/640px, `prefers-reduced-motion` 처리 |
| 전환 효과 | `node_modules/next/dist/docs`에 View Transitions 가이드가 있고 React 19.3 `<ViewTransition>`이 설정 없이 동작. 일부 브라우저는 애니메이션이 다를 수 있음 |
| 주의 | `AGENTS.md`: 이 Next.js는 기존과 다르므로 **코딩 전 해당 문서를 읽을 것**. `.vercel/`, `supabase/.temp/`가 있으나 **현재 연결 상태는 `/setup`으로 확인 전**이다 |

**재사용할 것:** `lib/jobs.ts`의 환경변수 검사·오류 처리 패턴(URL·key 둘 다 없을 때만 예시 모드, 그 외 오류는 숨기지 않음), `api/apply/route.ts`의 동일 출처 검사·본문 제한·honeypot 패턴, Pretendard 폰트와 `skip-link`·`error.tsx`·`not-found.tsx`, `JobBoard`의 필터 칩 패턴(참고).
**건드리지 않을 것:** 기존 `/`, `/jobs`, `/career`, `/setup`, `api/apply`, 기존 테이블·마이그레이션, `globals.css`. **삭제는 하지 않는다.**

## B2. 구조 결정 [제안, 승인 필요]
- **경로**: 모든 ON:US 화면은 `/onus/*`. 시작 화면 `/`는 유지(CLAUDE.md).
- **기존 파일 수정은 최소 2곳**: ① `app/layout.tsx`: HY컴퍼니 헤더·푸터를 `/onus` 경로에서는 숨기는 작은 클라이언트 래퍼 적용(파일 이동 없음, 다른 경로 동작 불변) ② `.env.example`에 새 환경변수 **이름만** 추가. `package.json`에는 의존성 추가(PDF 점검용 `pdf-lib` 하나만).
- **스타일**: `app/onus/onus.css`를 `.onus` 범위로 분리. Tailwind는 추가하지 않는다.
- **DB**: 새 마이그레이션 `supabase/migrations/<타임스탬프>_onus.sql`, 테이블은 모두 `onus_` 접두사. 적용은 학생이 Supabase CLI로 수행(README 절차). **적용 전에는 "적용했다"고 말하지 않는다.**
- **예시 모드(ON:US)**: URL·Publishable key가 둘 다 없을 때만 `lib/onus/sample-data.ts`로 읽기 전용 둘러보기. 쓰기 기능은 "DB 연결 후 사용 가능" 안내로 비활성(저장하는 척하지 않음). 한쪽만 있거나 조회 실패 시 오류 화면, 예시로 대체하지 않는다.

## B3. 데이터 모델과 권한

| 테이블 | 핵심 컬럼 | 읽기 | 쓰기 |
|---|---|---|---|
| `onus_profiles` | id, role(student/reviewer/admin), department, interests[], anon_code, is_demo | 서버만 | 서버만 |
| `onus_contests` | id, title, field, organizer_note, demo_flag | 공개 | 서버(운영자) |
| `onus_contest_editions` | contest_id, year, official_url, requirements(jsonb: 형식·페이지·용지·용량·필수서류·마감), source_quotes(jsonb) | 공개 | 서버(운영자) |
| `onus_works` | owner, edition_id, title, description, file_path, visibility, is_seed_demo | 공개분만 / 소유자·수락된 리뷰어 | 서버 |
| `onus_experiences` | work_id, result, timeline, key_decision, spec_note, consent flags, published | 공개(published) | 서버 |
| `onus_badges` | profile_id, type(award/entry/major_senior), field, edition_id, show_contest/show_year/show_level, verified_by, is_seed_demo | 서버만(표시용 뷰만 노출) | 서버(운영자) |
| `onus_evidence` | profile_id, file_path, doc_type, entered(jsonb: 운영자 입력 대회명·연도·등급·발급기관), status, decision_note | 운영자만 | 서버 |
| `onus_review_requests` | work_id, feedback_type, question, target_reviewer_ids, status | 요청자·대상 리뷰어 | 서버 |
| `onus_reviews` | request_id, reviewer, strengths, improvements, improvement_categories[], risks, comment, submitted_at | 요청자 | 서버 |
| `onus_checklist_items` | request_id, source_review_id, category, text(리뷰어 원문), done | 요청자 | 서버 |
| `onus_work_versions` | work_id, file_path, note, created_at | 소유자 | 서버 |

- **RLS 원칙**: 공개 읽기는 공모전·회차·공개 경험 기록뿐. 나머지는 정책 없이(기존 `applications`와 같은 방식) 서버에서만 접근. 개인정보 가능성이 있는 컬럼(증빙 원본)은 비공개 저장소에만 둔다.
- **쓰기 경로**: 서버 액션 또는 API 라우트에서 `SUPABASE_SERVICE_ROLE_KEY`(서버 전용 환경변수, **`NEXT_PUBLIC_` 금지**, Git 제외)를 사용. 기존 `api/apply`와 같은 방식.
- **증빙 저장 최소화**: 이름·학번은 데이터로 입력·저장하지 않는다. 운영자가 원본을 눈으로 확인한다. 승인·반려 후 원본 삭제.
- **Storage**: 비공개 버킷 2개(작품, 증빙). 마이그레이션에서 생성하며 적용 여부는 실제 확인한다. 열람은 서버가 기한 있는 링크를 발급한다.

## B4. 구현 / 데모 / 연동 불가 구분

| 구분 | 항목 |
|---|---|
| **구현 (실제 동작·DB 저장)** | 데모 역할 전환 · 공모전·회차·규격 조회 · 선배 작품 열람 · 작품 등록과 파일 업로드 · PDF 규격 점검(페이지·용지·형식·용량, 확인 불가 항목은 "확인 필요") · 피드백 유형 선택과 후보 추천(규칙) · 요청·수락·거절 · 리뷰 작성 · 앱 내 피드백함 · 수정 체크리스트·공통 개선 요소(리뷰어 문장 그대로) · 수정본 기록 · 운영자 증빙 검수와 배지 부여 |
| **구현하지 않음 (트랙 2)** | AI 요강 분석 · AI 증빙 추출 · AI 리뷰 요약. 운영자 직접 입력과 규칙 기반 체크리스트로 대체 |
| **데모 처리 (시연용으로 명시)** | 구성원 인증=데모 계정 · 시드 공모전·작품·선배·리뷰어 배지는 **가상 데이터에 "시연용 예시" 표시** · 시드 배지는 운영자 검수를 거친 것이 아님을 표시 · 시연 피드백 일부는 팀이 작성(표시) · 운영자 역할=팀 · 증빙은 가상 확인서 · 알림=앱 내 알림만 |
| **연동 불가·미구현 (완료로 말하지 않음)** | 학교 이메일·학번 인증 연동 · 학교 담당자 운영 참여(협의 필요) · 공식 수상자 명단 자동 대조 · 위조 서류 판별 · 졸업 여부 확인 · 이메일·푸시 알림 · 실제 한양여대 학생 데이터와 작품 · 사용자 검증 결과 · 필기·팀 모집·학교생활 정보 · 증빙 보관 정책(학교 협의) |

## B5. 이틀간 개발 우선순위

**P0 — 시연 핵심 (이 순서로 만들고, 끝나지 않으면 P1은 포기)**
1. 기반: 레이아웃 래퍼, `onus.css` 디자인 시스템, 마이그레이션, 데모 세션, 시드 데이터, 예시 모드
2. `/onus` 첫 화면 + 대표 갤러리, 데모 로그인, `/onus/discover`
3. 공모전 상세(요강·연도별 규격·출품작), 선배 작품 상세(공유 요소 전환)
4. 작품 등록(업로드) + PDF 규격 점검
5. 리뷰 요청(유형 → 후보 + 추천 이유) → 피드백함
6. 리뷰어 화면(수락 → 열람 → 작성)
7. 수정 체크리스트·공통 개선 요소(규칙 기반)

**P1 — 시간이 허용되면**
8. 운영자 증빙 검수 + 배지 부여(운영자 직접 입력)
9. 수정본 등록·비교, 경험 공개 동의와 아카이브 연결
10. 요강·규격 입력 운영 도구(`/onus/admin/contests`)

**P2 — 이번에는 하지 않음**: 학과 필기, 실습 노하우, 팀원 모집, 학교생활 정보, 실제 인증 연동.

**일정**: 1일차 오전 1~3(+문서 저장), 오후 4~5. 2일차 오전 6~7, 오후 8~9와 발표 준비. 검증(인터뷰)은 별도로 2~3시간 배정하고 코딩과 병행하지 않는다.

## B6. 디자인 방향 [제안: 포인트 색 최종 결정은 구현 시작 시 확인]
- 밝은 오프화이트 배경, 먹색 본문, **포인트 색 1개**, Pretendard(이미 로컬 포함, 외부 폰트 서버 없음).
- 에디토리얼 레이아웃: 큰 작품 이미지 카드, 번호가 붙은 섹션 제목, 고정된 필터 바, 4:5 비율 그리드.
- 모션: 스크롤 등장은 작은 클라이언트 컴포넌트(IntersectionObserver), `prefers-reduced-motion`에서는 끔. 작품 카드 → 상세 이미지는 `<ViewTransition>` 공유 요소 전환(구현 전 docs 확인).
- 이미지: 외부 이미지 호스트를 쓰지 않는다. 시드 작품은 자체 제작한 SVG/CSS 커버를 사용.
- 접근성: 대비, 키보드 이동, 대체 텍스트, "시연용 예시" 배지는 항상 보이게.

## B7. 지켜야 할 규칙 (CLAUDE.md 기준)
- 한 단계씩 실행하고 **실제 결과를 확인**한다. 확인 명령은 `npm run build`, `npm run typecheck`. 화면은 dev 서버를 띄워 직접 클릭해 확인하고 결과를 그대로 보고한다.
- 실제 공고·통계·연결 성공·배포 완료를 확인하지 않고 완료했다고 말하지 않는다. 시연용 계정·시연용 피드백은 화면에 시연용임을 표시한다. 다른 학생의 이름·작품은 본인 동의 없이 넣지 않는다. (현재 아카이브의 12건은 작품 제공자 본인의 기록이다.)
- **개인정보**: ON:US의 증빙 업로드는 개인정보를 다룰 수 있다. 이번 구현은 **가상 테스트 문서만** 받도록 화면에 명시하고, 이름·학번은 추출·저장하지 않으며 승인·반려 후 원본을 삭제한다. 실제 학생 증빙 수집은 학교 협의 후에 한다.
- 키는 학생이 `.env.local`과 Vercel에 직접 입력(`SUPABASE_SERVICE_ROLE_KEY`). 코드·문서·Git에 값을 넣지 않는다. 공개 배포 시 업로드 기능은 환경변수 스위치로 끌 수 있게 한다(익명 남용 방지).
- AI 기술과 AI 문구는 쓰지 않는다(트랙 2). 규칙 기반 기능을 AI라고 표현하지 않는다.

## B8. 구현 후 검증 방법
1. `npm run typecheck`, `npm run build` 통과 확인(출력 그대로 보고).
2. `npm run dev` 후 `/setup`에서 Supabase 연결 상태 확인. 마이그레이션 적용 후 `onus_` 테이블 존재와 조회 결과 확인.
3. 세 계정(학생·리뷰어·운영자)으로 A5 시나리오를 처음부터 끝까지 클릭해 확인: 공모전 상세 → 작품 열람 → 등록·규격 점검 → 요청 → 수락·작성 → 피드백함 → 수정 체크리스트.
4. 실패 경로 확인: Supabase 설정 누락(예시 모드·오류 구분), 잘못된 파일, 리뷰어 미수락 시 작품 접근 차단, 학생이 다른 학생의 작품에 접근 시도.
5. 확인하지 못한 항목은 "미확인"으로 남기고 발표 자료에서 완료로 표현하지 않는다.

## B9. 승인 후 첫 작업
1. 이 문서를 `docs/ONUS_기획서.md`, `docs/ONUS_요구사항.md`로 **새 파일로 저장**(기존 파일 덮어쓰지 않음).
2. 가장 먼저 만들 화면: **`/onus` 첫 화면과 대표 작품 갤러리**, 그다음 **공모전 상세와 선배 작품 상세**. 이유: 플랫폼의 필요성을 보여 주는 첫 장면이며 DB 없이도 디자인 시스템과 시드 데이터 구조를 먼저 검증할 수 있다.
3. 그 다음 마이그레이션과 데모 세션을 만들고, P0 순서대로 진행한다.

## 승인 전에 확인하고 싶은 가정
- `/onus/*` 경로 사용과 `app/layout.tsx` 수정(헤더·푸터 숨김 래퍼).
- **[변경됨] 시드 데이터는 가상이 아니라 작품 제공자 본인의 실제 수상 기록 12건**(작품명·공모전명·연도·등급은 제공된 표기 그대로). 대회 성격은 웹 검색 요약 기준이며 출처를 함께 표시한다. 화면에는 작성자 실명·학번을 표시하지 않고, 이미지 파일명에서도 제거했다. 대회-작품 연결 코멘트는 "초안 · 작성자 확인 필요"로 표시한다.
- 증빙은 가상 테스트 문서만 사용.
- 리뷰어 기본 공개 범위는 모두 비공개.
- 포인트 색은 구현 시작 시 시안을 보고 결정.
