import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/onus/PageHead';
import Reveal from '@/components/onus/Reveal';

export const metadata: Metadata = { title: '운영·인증 정책', description: '경험 인증을 누가 어떤 절차로 확인하는지, 익명 글·댓글의 악성 이용에 어떻게 대응하는지, 지금 구현된 것과 아직 아닌 것을 구분해 설명합니다.' };

export default function PolicyPage() {
 return (
  <main id="main">
   <PageHead eyebrow="POLICY" title="인증과 커뮤니티는 이렇게 운영해요" lead="경험 인증을 누가 어떤 절차로 확인하는지, 익명 글·댓글이 문제가 되면 어떻게 하는지 적었어요. 지금 구현된 것과 아직 아닌 것을 나눠서 그대로 공개해요." icon="badge" />

   <section className="on-section on-section-tight">
    <Reveal><p className="on-eyebrow">WHO</p><h2>누가 운영하나요</h2></Reveal>
    <div className="on-about-grid">
     <Reveal><div className="on-about-card">
      <h3>운영자 (구현됨)</h3>
      <ul>
       <li>운영자 이메일은 DB의 운영자 목록(<code>onus_admins</code>)에 직접 등록한 계정만 돼요. 목록은 일반 사용자가 읽거나 고칠 수 없어요.</li>
       <li>운영자 화면(<code>/onus/admin</code>)은 이메일 로그인 후 목록에 있는 계정에게만 신청 목록이 열려요. 다른 계정은 DB가 거부해요.</li>
      </ul>
     </div></Reveal>
     <Reveal delay={60}><div className="on-about-card">
      <h3>운영 주체 (제안)</h3>
      <p>지금은 ON:US 팀이 시범 운영해요. 학교가 정식으로 이어받는다면 학과 사무실·학생회 등 담당을 지정하고, 운영자 목록을 그 담당자 기준으로 바꾸는 것을 제안해요. 학교와 이 운영 방식을 합의한 것은 아니에요.</p>
     </div></Reveal>
    </div>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">VERIFY</p><h2>경험 인증 절차 (구현됨)</h2></Reveal>
    <ol className="on-policy-steps">
     <li><b>1 · 신청</b><span>수상 증명서나 출품(접수 완료) 확인서를 이미지·PDF(5MB 이하)로 올려요. 파일은 비공개 저장소에만 저장되고 운영자만 열 수 있어요.</span></li>
     <li><b>2 · 확인</b><span>운영자가 서류의 대회명·연도·수상 등급이 신청 내용과 같은지 보고, 다르면 서류 기준으로 고쳐요.</span></li>
     <li><b>3 · 승인 또는 반려</b><span>반려할 때는 사유를 꼭 적고, 신청자는 신청 때 받은 비밀 키로 결과와 사유를 확인해요.</span></li>
     <li><b>4 · 서류 삭제</b><span>승인·반려가 저장되면 서류 파일을 바로 지워요. 남는 것은 상태와 공개 문구뿐이에요.</span></li>
     <li><b>5 · 표시</b><span>승인된 인증만 글·댓글에 &ldquo;수상/출품 경험 인증&rdquo; 표시를 달 수 있어요. 승인되지 않은 인증으로 이 유형을 고르면 DB가 거부해요. 대회명·등급을 보일지는 신청자가 정해요.</span></li>
    </ol>
    <div className="on-note-card" style={{ marginTop: 14 }}>
     <strong>인증의 한계</strong>
     <ul>
      <li>서류 확인이며 본인 확인이 아니에요. 서류의 위조 여부는 판별하지 못해요.</li>
      <li>인증을 받지 않은 글쓴이의 유형(재학생·선배 등)은 스스로 고른 값이에요. 글을 쓸 때 선택 화면에서 "스스로 선택 (미인증)"이라고 안내해요.</li>
     </ul>
    </div>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">SUBMIT</p><h2>수상작 올리기와 수상증명서</h2></Reveal>
    <div className="on-note-card" style={{ marginTop: 14 }}>
     <ul>
      <li>누구나 <Link className="on-inline-link" href="/onus/submit">수상작 올리기</Link>에서 작품 이미지·공모전 정보와 함께 <strong>수상증명서</strong>(이미지·PDF, 5MB 이하)를 올릴 수 있어요. 증명서는 필수예요.</li>
      <li>증명서는 비공개 저장소에만 저장되고 운영자만 열 수 있어요. 올릴 때 &ldquo;수상 확인에만 쓰고 공개하지 않는다&rdquo;는 안내에 동의해야 하고, 승인·반려가 저장되면 파일을 삭제해요.</li>
      <li>운영자가 증명서와 작품명·대회명·등급이 맞는지, 작품 이미지에 개인정보가 없는지 확인한 작품만 수상 아카이브에 보여요. 닉네임만 공개되고 이름·학번·연락처는 받지 않아요.</li>
      <li>한계: 서류 확인이며 본인 확인이 아니에요. 증명서 위조 여부는 판별하지 못하고, 다른 사람의 상장을 올리는 것은 이용 약속 위반으로 보고 반려·삭제해요.</li>
     </ul>
    </div>
   </section>

   <section className="on-section">
    <Reveal><p className="on-eyebrow">COMMUNITY</p><h2>익명 글·댓글, 악성 이용 대응</h2></Reveal>
    <table className="on-status-table">
     <tbody>
      <tr><th><span className="on-tag-ok">구현</span></th><td>이름·학번·연락처를 받지 않음 · 닉네임(2~20자)과 글 길이 제한 · 분당 30건을 넘는 도배 차단(DB) · 글쓴이는 쓴 브라우저에서 자기 글·댓글 삭제 · 삭제용 비밀 키는 누구도 조회 불가</td></tr>
      <tr><th><span className="on-tag-ok">구현</span></th><td>운영자는 Supabase 관리 화면에서 문제 글·댓글을 직접 삭제할 수 있음</td></tr>
      <tr><th><span className="on-tag-no">미구현</span></th><td>화면의 신고 버튼, 신고 목록, 글 숨김 기능. 지금은 문제를 발견한 사람이 운영자에게 알려야 해요.</td></tr>
      <tr><th><span className="on-tag-demo">대응 기준 (안)</span></th><td>① 욕설·비방 ② 허위 수상·출품 주장 ③ 개인정보 노출 ④ 광고·스팸 → 운영자가 확인 후 삭제. 익명이라 작성자 제재는 어렵고, 반복되면 해당 기능을 잠시 닫는 것을 우선 선택해요.</td></tr>
     </tbody>
    </table>
    <p className="on-small" style={{ marginTop: 12 }}>다음 단계로 신고 접수와 숨김 처리, 인증을 받은 사람만 후기를 남기는 방식을 검토하고 있어요. 구현되기 전까지는 위 표처럼 &ldquo;미구현&rdquo;으로 표시해요.</p>
   </section>

   <section className="on-section">
    <Reveal><h2>더 보기</h2><p className="on-section-lead"><Link className="on-inline-link" href="/onus/verify">경험 인증 신청</Link> · <Link className="on-inline-link" href="/onus/about">서비스 소개</Link> · 보안 점검 결과는 저장소의 <code>docs/보안점검.md</code>에 있어요.</p></Reveal>
   </section>
  </main>
 );
}
