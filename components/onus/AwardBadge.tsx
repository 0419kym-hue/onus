import { awardKind, awardTone } from '@/lib/onus/awards';
import type { Award } from '@/lib/onus/types';

export default function AwardBadge({ award, large = false }: { award: Award; large?: boolean }) {
 return (
  <span className={`on-badge on-badge-${awardTone(award)}${large ? ' on-badge-lg' : ''}`}>
   <span className="on-badge-kind">{awardKind(award)}</span>
   {award}
  </span>
 );
}
