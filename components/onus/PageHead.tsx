import Icon, { type IconName } from './Icons';
import Mascot3D from './Mascot3D';

/** 안쪽 페이지 공통 머리말: 아이콘 칩 + 작은 제목 + 장식 오브젝트 */
export default function PageHead({ eyebrow, title, lead, icon, mascot, children }: { eyebrow: string; title: string; lead: string; icon: IconName; mascot?: boolean; children?: React.ReactNode }) {
 return (
  <header className="on-pagehead">
   <div className="on-pagehead-inner">
    <p className="on-eyebrow on-ph-eyebrow"><span className="on-ph-ic"><Icon name={icon} /></span>{eyebrow}</p>
    <h1>{title}</h1>
    <p className="on-pagehead-lead">{lead}</p>
    {children}
   </div>
   {mascot
    ? <Mascot3D className="on-ph-crew" src="/onus/brand/hywu-crew.webp" alt="한양여자대학교 마스코트 하이유 크루(나리, 나래, 빛나리)" width={262} height={239} />
    : <span className="on-ph-deco" aria-hidden="true"><i /><i /><i /></span>}
  </header>
 );
}
