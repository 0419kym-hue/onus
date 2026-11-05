import Icon, { type IconName } from './Icons';

/** 안쪽 페이지 공통 머리말: 아이콘 칩 + 작은 제목 + 장식 오브젝트 */
export default function PageHead({ eyebrow, title, lead, icon, children }: { eyebrow: string; title: string; lead: string; icon: IconName; children?: React.ReactNode }) {
 return (
  <header className="on-pagehead">
   <div className="on-pagehead-inner">
    <p className="on-eyebrow on-ph-eyebrow"><span className="on-ph-ic"><Icon name={icon} /></span>{eyebrow}</p>
    <h1>{title}</h1>
    <p className="on-pagehead-lead">{lead}</p>
    {children}
   </div>
   <span className="on-ph-deco" aria-hidden="true"><i /><i /><i /></span>
  </header>
 );
}
