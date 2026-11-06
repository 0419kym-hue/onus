# ON:US — 한양여대 학생을 위한 공모전·장학금·대외활동 경험 연결 플랫폼

> 한양여자대학교 × Tilon × KTNF GPU **'모두의 AI 해커톤'** 출품작 · 주제 **"내 전공 현장을 바꾸는 AI"**

| | |
|---|---|
| 배포 주소 | https://hy-company-eight.vercel.app/onus |
| 저장소 | https://github.com/0419kym-hue/onus (Public) |
| 한 줄 소개 | 선배의 실제 수상작·준비 기간·제출 규격을 근거로, 학과·수업에 맞는 공모전·장학금·대외활동을 찾고 다음 행동을 정하게 돕는 서비스 |

## 지금 사용할 수 있는 기능 (배포본에서 확인됨)

| 메뉴 | 주소 | 하는 일 |
|---|---|---|
| 수상 아카이브 | `/onus/archive` | 선배 수상작 12건을 한 표로 비교, 작품 상세에서 대회·시상·규격·준비 기간 확인 |
| 공모전 | `/onus/contests` | 접수 중 공모전 목록(마감 지난 것은 자동 제외), 대회별 확인할 점·체크리스트 |
| **장학금** | `/onus/scholarships` | **교내(한양여대)·교외 장학금 구분**, 신청 기간·대상·방법, **"나도 받을 수 있을까?" 규칙 기반 자가 진단** |
| **대외활동** | `/onus/activities` | 대외활동 사이트·정부·교내 지원 안내, 모집 중 예시, 조심할 점 |
| AI 추천 | `/onus/recommend` | 학과·수업을 읽어 공모전을 추천하고, 닮은 선배와 마감 기준 준비 일정을 제안 |
| 도전 보드 / 커뮤니티 / 경험 인증 | `/onus/board` `/onus/community` `/onus/verify` | 저장·준비 단계 관리, 팀원 모집·질문, 서류 제출 후 운영자 검토 |
| 서비스 소개 | `/onus/about` | 문제·해결, **5분 사용 흐름**, 검증 현황, AI 사용 범위, 구현·미구현·한계를 그대로 공개 |
| 수상작 올리기 | `/onus/submit` | 작품 이미지·공모전 정보와 **수상증명서(비공개, 운영자만 열람·확인 후 삭제)**를 올리면 운영자 승인 후 수상 아카이브에 공개 |
| 운영·인증 정책 | `/onus/policy` | 경험 인증 절차(운영자 확인→승인/반려→서류 삭제)와 한계, 익명 글·댓글의 악성 이용 대응(구현된 것/미구현 구분) |

## AI는 어디에 쓰고, 어떻게 통제하나요
- **AI(OpenAI `gpt-5.4-mini`, 서버 API route에서만 호출)**: 입력한 학과·수업에서 강점을 읽고, 접수 중 공모전 후보 중 맞는 곳을 고르고, 준비 일정 초안을 제안합니다.
- **AI가 아닌 규칙**: 닮은 선배 매칭(`lib/onus/fields.ts`), 선배 준비 기간과 마감일 비교, 체크리스트, **장학금 자가 진단(`lib/onus/scholarships.ts`)**. 자격 판정은 정확해야 해서 일부러 AI에 맡기지 않았습니다.
- 환각 방지: 모델은 후보 **번호만** 고르고, 제목·링크·마감일은 서버 데이터로 채웁니다. 작품 점수화·수상 가능성 예측은 하지 않습니다.
- 서버 환경변수 `ONUS_AI_DISABLED=true` 로 AI 기능을 끌 수 있습니다.

## 보안 · 개인정보 (자세한 점검 결과: [`docs/보안점검.md`](docs/보안점검.md))
- API 키·토큰·서비스 롤 키는 저장소에 없습니다(`.env*`는 Git 제외, `.env.example`에는 이름만). OpenAI 키는 서버에서만 사용합니다.
- 운영 의존성 취약점 0건(`npm audit --omit=dev`), 모든 응답에 보안 헤더 적용(`next.config.ts`).
- 입력(학과·수업·자가 진단 응답)은 서버에 저장하지 않습니다. 이름·학번·연락처를 받지 않습니다.
- DB는 RLS와 컬럼 단위 권한으로 공개 컬럼만 읽히고, 쓰기·삭제는 허용된 경로만 가능합니다(`supabase/migrations/`).
- AI API는 같은 출처 요청만 받고 IP당 분당 5회로 제한합니다.

## 실행 방법
```sh
npm ci
npm run dev        # http://localhost:3000/onus
npm run typecheck && npm run build
```
환경변수(값은 직접 입력, 저장소에 넣지 않기): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `OPENAI_API_KEY`(선택), `ONUS_AI_DISABLED`(선택)

## 한계 (숨기지 않고 공개)
- 사용자 인터뷰·사용성 테스트 결과가 아직 없습니다. 문제 정의는 가설이며, 다음 단계는 재학생 3명 안팎의 5분 사용 테스트입니다.
- 글·댓글 신고·숨김 기능은 미구현입니다(현재는 운영자가 DB에서 직접 삭제). 대응 기준은 `/onus/policy`에 있습니다.
- 장학금·대외활동·공모전 정보는 2026-11-06 공개 자료 기준이며, 학교 선발 기준 등 확인하지 못한 것은 "확인하지 못했어요"로 표시했습니다. 신청 전에는 공식 공고를 확인해야 합니다.
- 작품 올리기(`/onus/submit`)는 DB 마이그레이션(`20261106120000`, `20261106130000`) 적용 후 저장됩니다. PDF 규격 점검·인증 리뷰어 매칭은 미구현입니다.

## 코드 지도
AI·다른 개발자를 위한 개념·사이트맵·규칙은 [`docs/ONUS_프로젝트_맵.md`](docs/ONUS_프로젝트_맵.md), 심사 관점 자체평가는 [`docs/ONUS_심사기준_자체평가.md`](docs/ONUS_심사기준_자체평가.md), 디자인 기준은 [`DESIGN.md`](DESIGN.md)에 있습니다.

---

# (아래는 수업용 HY컴퍼니 실습 프로젝트의 원래 README입니다)

# HY컴퍼니 · 공통 실습 시작 프로젝트

한양여자대학교 AI 해커톤에서 모두 같은 상태로 시작하기 위한 Next.js 프로젝트입니다.
## 서버 실행 → 브라우저에서 연결

Node.js 24 LTS 권장(최소 22). `hy-company` 폴더에서 아래 두 줄만 실행합니다.

```sh
npm ci
npm run dev
```

터미널에 표시된 주소 뒤에 `/setup`을 붙여 엽니다. 보통 **http://localhost:3000/setup** 입니다.

이 서버 페이지의 **CLI 연결 프롬프트를 Claude Code에 보내고**, AI 안내에 따라 Supabase CLI와 Vercel CLI로 연결·배포합니다. Next.js 서버가 Supabase에서 공고를 읽어 화면을 제공합니다. 서버를 별도로 하나 더 만들 필요가 없습니다.

- `/`: 채용 사이트
- `/setup`: 연결 가이드와 실제 DB 연결 상태
- `/jobs/[id]`: 공고 상세

설치 전 도움이 필요하면 `시작하기.html`, 자세한 절차는 `docs/학생시작가이드.md`를 참고하세요.

## 포함한 것

- 가상 기업 HY컴퍼니 소개, 예시 채용공고 6개, 직무 필터, 공고 상세.
- Supabase 연결 전 로컬 예시 모드 / 연결 후 실제 DB 조회 / 연결 실패·빈 결과 구분.
- 공개 실습 공고만 읽을 수 있는 Supabase 테이블·RLS·예시 SQL.
- GitHub 첫 저장소 생성과 Vercel 자동 배포 안내.
- 선택적으로 Google Form 응답 링크 연결. 기본 지원 버튼은 비활성화.
- 로컬 글꼴을 포함하므로 화면을 위해 별도 글꼴 서버에 접속하지 않습니다.

## 수업에서 추가할 것

34번 슬라이드에서 헤더에 기존 `/` 페이지 탭과 `/career` 분석 탭을 추가합니다. 이후 커리어리 MCP 데이터 적재, 차트, 이력서 추천을 구현합니다. 시작 프로젝트에는 해당 기능이나 MCP 팀 토큰을 미리 넣지 않았습니다.

## 연결 정보

`.env.example`을 `.env.local`로 복사해 내 Supabase URL과 Publishable key를 입력합니다. 실제 값은 GitHub·단톡방에 올리지 않습니다. AI가 `supabase/01_hy_company.sql`을 마이그레이션으로 준비하고 Supabase CLI로 반영합니다. Vercel 환경변수도 CLI로 별도 설정합니다.

이 ZIP은 프로젝트·계정·배포를 자동 생성하지 않습니다. 본인 계정으로 안내 절차를 완료해야 연결됩니다.

## 파일 구조

- `app/page.tsx`: 채용 홈 화면
- `app/jobs/[id]/page.tsx`: 상세 화면과 지원 링크
- `components/Header.tsx`: 34번에서 수정할 헤더
- `components/JobBoard.tsx`: 직무 필터와 공고 카드
- `lib/jobs.ts`: Supabase 조회와 오류 처리
- `lib/sample-jobs.json`: 연결 전 사용할 가상 공고
- `supabase/01_hy_company.sql`: 학생 DB 초기 설정
- `docs/학생시작가이드.md`: 계정 생성부터 공개 주소까지

## 검증

```sh
npm run build
npm run typecheck
npm start
```

개발 중에는 `npm run dev`를 사용합니다. `npm start`는 먼저 빌드해야 합니다. 설치 버전은 `package-lock.json`에 고정되어 있으므로 `npm ci`를 사용합니다.

## 배포 흐름

코드 수정 → 필요한 DB 변경 별도 적용 → commit → GitHub 배포 브랜치에 push → Vercel 빌드·배포 → 공개 주소 확인.

Supabase 테이블을 GitHub push만으로 바꿀 수는 없습니다. 현재 프로젝트에는 자동 DB 마이그레이션 설정이 없습니다.

글꼴: Pretendard, SIL Open Font License. `public/fonts/LICENSE.txt`를 참고하세요.
