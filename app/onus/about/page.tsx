import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/onus/PageHead';
import Reveal from '@/components/onus/Reveal';
import { allContests, sortedWorks } from '@/lib/onus/data';
import { externalContests } from '@/lib/onus/external-contests';
import { news } from '@/lib/onus/news';

export const metadata: Metadata = { title: '서비스 소개', description: 'ON:US가 해결하려는 문제, 작동 방식, AI 사용 범위, 구현 상태와 한계를 한 페이지에서 설명합니다.' };
export const dynamic = 'force-dynamic'; // 접수 중 공모전 수를 오늘 날짜 기준으로 계산합니다.

export default function AboutPage() {
 const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
 const live = externalContests.filter((x) => x.deadline >= today).length;
 const works = sortedWorks();
 const withDuration = works.filter((w) => w.journey).length;
 return (
  <main id="main">
   <PageHead eyebrow="ABOUT ON:US" title="ON:US는 이런 서비스예요" lead="공모전을 준비하는 한양여대 학생이 선배의 실제 출품작·수상 경험·준비 기간·제출 규격을 근거로 다음 행동을 정하게 돕는 플랫폼이에요. 심사하시는 분들을 위해 핵심만 한 페이지에 정리했어요." icon="badge" />

   <section className="on-section on-section-tight">
    <Reveal><p className="on-eyebrow">PROBLEM &amp; SOLUTION</p><h2>문제와 해결</h2></Reveal>
    <div className="on-about-grid">
     <Reveal><div className="on-about-card">
      <h3>문제 (검증 전 가설)</h3>
      <p>공모전 정보, 과거 출품작, 수상 경험, 준비 과정이 개인과 학과에 흩어져 있어 후배가 선배의 경험을 활용하기 어렵다고 보았어요. 이 가설은 아직 학생 인터뷰로 검증하지 못했어요.</p>
     </div></Reveal>
     <Reveal delay={60}><div className="on-about-card">
      <h3>해결</h3>
      <ul>
       <li>공모전 회차 → 제출 규격 → 선배 작품과 준비 기간을 하나의 흐름으로 연결</li>
       <li>같은 분야 선배의 수상 사례로 &ldquo;나도 해볼 만한지&rdquo; 판단할 근거 제공</li>
       <li>마감일과 선배의 준비 기간을 견줘 지금 시작해도 되는지 안내</li>
      </ul>
     </div></Reveal>
     <Reveal delay={120}><div className="on-about-card">
      <h3>차별점</h3>
      <p>공모전 검색·수상작 갤러리는 이미 있어요. ON:US는 같은 학교 선배의 기록을 대회와 연결하고, 학교 구성원 안에서 경험이 쌓이게 하는 데 집중해요.</p>
     </div></Reveal>
    </div>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">NOW</p><h2>지금 담겨 있는 것</h2></Reveal>
    <ul className="on-about-nums">
     <li><b>{works.length}</b><span>선배 수상·선정 작품</span></li>
     <li><b>{allContests.length}</b><span>대회 성격 정리</span></li>
     <li><b>{live}</b><span>접수 중 공모전</span></li>
     <li><b>{news.length}</b><span>한양여대 관련 기사</span></li>
     <li><b>{withDuration}</b><span>준비 기간 기록</span></li>
    </ul>
    <p className="on-small">작품과 수상 기록은 제공자 본인의 것이고, 대회 정보는 공개 자료를 수집한 시점 기준이에요. 준비 기간은 작성자가 알려 준 대략적인 값(대부분 약 1주, 색채·조형 공모전은 약 2일)이에요.</p>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">5 MINUTES</p><h2>처음 공모전을 준비하는 학생의 5분 사용 흐름</h2><p className="on-section-lead">기능이 많아 보이지만, 처음 오는 학생이 따라가는 길은 이 다섯 단계 하나예요.</p></Reveal>
    <ol className="on-policy-steps">
     <li><b>1 · 적기</b><span><Link className="on-inline-link" href="/onus/recommend">AI 추천</Link>에 학과·수업·관심사를 한두 줄 적어요.</span></li>
     <li><b>2 · 고르기</b><span>추천 이유와 닮은 선배, 마감에서 거꾸로 계산한 준비 일정을 보고 마음에 드는 공모전을 골라요.</span></li>
     <li><b>3 · 확인하기</b><span>공식 안내 링크로 참가 대상과 마감일을 직접 확인해요.</span></li>
     <li><b>4 · 참고하기</b><span><Link className="on-inline-link" href="/onus/archive">수상 아카이브</Link>에서 같은 분야 선배의 작품과 준비 기간, 제출 규격을 봐요.</span></li>
     <li><b>5 · 담기</b><span><Link className="on-inline-link" href="/onus/board">도전 보드</Link>에 저장하고 준비 단계를 체크해요. 장학금·대외활동은 같은 메뉴에서 이어서 볼 수 있어요.</span></li>
    </ol>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">VALIDATION</p><h2>검증할 가설과 계획</h2><p className="on-section-lead">학생 인터뷰와 사용성 테스트는 아직 진행하지 못했어요. 그래서 아래 내용은 결과가 아니라 <strong>가설과 검증 계획</strong>이고, 결과가 나오면 이 페이지에 그대로 기록해요.</p></Reveal>
    <table className="on-status-table">
     <tbody>
      <tr><th>가설 1</th><td>재학생은 공모전·장학금·대외활동 정보를 여러 사이트와 공지에서 따로 찾느라 어려움을 겪는다. <em className="on-small">확인 방법: 재학생 3~5명에게 평소 어디서 어떻게 찾는지 물어보는 짧은 인터뷰</em></td></tr>
      <tr><th>가설 2</th><td>선배의 작품·준비 기간·제출 규격을 보면 첫 도전의 부담이 줄어든다. <em className="on-small">확인 방법: 아카이브를 본 뒤 &ldquo;도전해 볼 마음이 생겼나요&rdquo;를 5점 척도와 한 줄 의견으로 받기</em></td></tr>
      <tr><th>가설 3</th><td>처음 온 학생이 5분 안에 나에게 맞는 기회를 하나 저장할 수 있다. <em className="on-small">확인 방법: 위 5분 흐름을 과제로 주고 관찰하며 막힌 지점 기록 (성공 기준: 참여자 과반이 5분 안에 저장까지 도달)</em></td></tr>
     </tbody>
    </table>
    <p className="on-small" style={{ marginTop: 12 }}>이 가설들로 인터뷰 질문을 만들고, 받은 피드백은 화면 개선에 반영한 뒤 &ldquo;무엇을 들었고 무엇을 고쳤는지&rdquo;를 함께 남길 계획이에요.</p>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">AI USAGE</p><h2>AI는 어디에 쓰고, 어디에 쓰지 않나요</h2></Reveal>
    <div className="on-about-grid">
     <Reveal><div className="on-about-card">
      <h3>AI가 하는 일</h3>
      <ul>
       <li>학생이 적은 학과·수업·관심사에서 분야와 강점 읽기</li>
       <li>접수 중인 공모전 중 맞는 곳 고르고 이유 설명</li>
       <li>마감일에서 거꾸로 계산한 준비 일정 초안 제안</li>
      </ul>
     </div></Reveal>
     <Reveal delay={60}><div className="on-about-card">
      <h3>규칙으로 하는 일 (AI 아님)</h3>
      <ul>
       <li>같은 분야·학과 선배 작품 매칭</li>
       <li>선배 준비 기간과 마감까지 남은 일수 비교</li>
       <li>출품 준비 체크리스트, 키워드 기반 도전 찾기</li>
      </ul>
     </div></Reveal>
     <Reveal delay={120}><div className="on-about-card">
      <h3>책임 있게 쓰기 위한 장치</h3>
      <ul>
       <li>후보는 서버가 가진 목록뿐이라 없는 공모전이나 가짜 링크를 만들 수 없음</li>
       <li>제목·링크·마감일은 AI가 아니라 서버 데이터에서 가져옴</li>
       <li>입력 내용은 저장하지 않고, OpenAI 키는 서버에서만 사용</li>
       <li>작품 점수 매기기·수상 가능성 예측은 하지 않음</li>
       <li>서버 환경변수 하나로 AI 기능을 끌 수 있음</li>
      </ul>
     </div></Reveal>
    </div>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">STATUS</p><h2>구현 상태와 한계</h2></Reveal>
    <div className="on-about-card" style={{ marginTop: 18 }}>
     <table className="on-status-table">
      <tbody>
       <tr><th><span className="on-tag-ok">구현</span></th><td>수상 아카이브·대회 성격·소식(수집한 데이터), 장학금(교내·교외 구분과 자가 진단), 대외활동 안내, 나의 도전 보드(브라우저 저장), AI 맞춤 추천, 닮은 선배 매칭, 출품 준비 체크리스트</td></tr>
       <tr><th><span className="on-tag-ok">구현 (DB 연동)</span></th><td>커뮤니티 글·댓글, 수상·출품 경험 인증 신청과 운영자 검수 (절차와 한계: <Link className="on-inline-link" href="/onus/policy">운영·인증 정책</Link>)</td></tr>
       <tr><th><span className="on-tag-no">미구현</span></th><td>글·댓글 신고·숨김 기능, 작품 업로드와 PDF 규격 점검, 인증된 선배에게 피드백 요청과 수정 체크리스트, 학교 계정·학번 연동</td></tr>
       <tr><th><span className="on-tag-demo">한계</span></th><td>사용자 검증(인터뷰) 결과가 아직 없고, 선배의 실행 단계·시도한 내용은 기록을 받지 못해 비어 있어요. 대회 정보는 수집 시점 기준이라 공식 요강 확인이 필요해요.</td></tr>
      </tbody>
     </table>
    </div>
   </section>

   <section className="on-section">
    <Reveal>
     <p className="on-eyebrow">TRY IT</p>
     <h2>직접 써 보세요</h2>
     <p className="on-section-lead"><Link className="on-inline-link" href="/onus/recommend">AI 추천</Link>에서 학과와 수업을 넣으면 닮은 선배와 준비 일정이 나오고, <Link className="on-inline-link" href="/onus/archive">수상 아카이브</Link>에서는 선배 작품을 한 표로 비교할 수 있어요.</p>
    </Reveal>
   </section>
  </main>
 );
}
