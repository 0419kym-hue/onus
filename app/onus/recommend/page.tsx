import type { Metadata } from 'next';
import Link from 'next/link';
import AiRecommend from '@/components/onus/AiRecommend';
import Icon, { type IconName } from '@/components/onus/Icons';
import PageHead from '@/components/onus/PageHead';
import Reveal from '@/components/onus/Reveal';
import { aiEnabled } from '@/lib/onus/flags';
import { externalContests } from '@/lib/onus/external-contests';

export const metadata: Metadata = { title: 'AI 맞춤 공모전 추천', description: '전공과 관심사, 경험을 적으면 지금 접수 중인 공모전 중에서 AI가 참가 자격까지 따져 추천해 드려요.' };
export const dynamic = 'force-dynamic'; // 마감이 지난 공모전은 빼고 오늘 기준으로 추천하기 위해 요청 시점의 날짜를 씁니다.

const STEPS: { icon: IconName; title: string; desc: string }[] = [
 { icon: 'chat', title: '학과와 수업을 알려요', desc: '학과, 수강 중·수강한 수업, 관심사를 적어 주세요. 시간표를 붙여넣어도 돼요.' },
 { icon: 'spark', title: 'AI가 골라요', desc: '접수 중인 공모전 중 수업과 분야, 참가 자격이 맞는 곳을 고르고 마감일 기준 준비 일정을 제안해요.' },
 { icon: 'trophy', title: '선배의 길을 따라가요', desc: '같은 분야로 수상한 선배 작품을 보고, 공식 안내로 이동하거나 도전 보드에 담아요.' },
];

export default function RecommendPage() {
 const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
 const live = externalContests.filter((x) => x.deadline >= today).length;
 return (
  <main id="main">
   <PageHead eyebrow="AI RECOMMEND" title="나에게 맞는 공모전, AI가 골라 줘요" lead={`지금 접수 중인 공모전 ${live}개 중에서 전공·관심사·경험에 맞는 곳을 추천해요. 대학생 참가 가능 여부도 함께 따져 드려요.`} icon="spark" mascot />
   <section className="on-section on-section-tight on-narrow-wide">
    {aiEnabled() ? <AiRecommend today={today} /> : <div className="on-empty" role="status"><strong>AI 추천은 지금 꺼져 있어요</strong><p>대신 <Link className="on-inline-link" href="/onus">첫 화면의 "나에게 맞는 도전 찾기"</Link>(키워드 규칙 기반)와 <Link className="on-inline-link" href="/onus/contests">공모전 모음</Link>을 이용해 주세요.</p></div>}
   </section>
   <section className="on-section">
    <Reveal><p className="on-eyebrow">HOW IT WORKS</p><h2>이렇게 추천해요</h2></Reveal>
    <ol className="on-steps2">
     {STEPS.map((s, i) => (
      <li key={s.title}>
       <Reveal delay={i * 60}>
        <div className="on-step2">
         <span className="on-step2-n">{i + 1}</span>
         <span className="on-step2-ic"><Icon name={s.icon} /></span>
         <strong>{s.title}</strong>
         <p>{s.desc}</p>
        </div>
       </Reveal>
      </li>
     ))}
    </ol>
    <Reveal>
     <div className="on-note-card">
      <strong>알아 두세요</strong>
      <ul>
       <li>AI가 만든 추천이라 틀릴 수 있어요. 참가 자격과 일정은 공식 안내에서 꼭 확인해 주세요.</li>
       <li>입력한 내용은 추천을 만드는 데에만 쓰이고 저장되지 않아요. 이름·연락처는 적지 마세요.</li>
       <li>공모전 목록은 수집 시점 기준이에요. 키워드로 직접 고르고 싶다면 <Link className="on-inline-link" href="/onus/contests">공모전 모음</Link>을 이용해 보세요.</li>
      </ul>
     </div>
    </Reveal>
   </section>
  </main>
 );
}
