import Mascot3D from './Mascot3D';

/** 하이유 크루 세 명(빛나리·나리·나래)을 서로 떨어뜨려 각자 입체로 움직이게 보여 줍니다. */
export default function MascotTrio({ className = '' }: { className?: string }) {
 return (
  <div className={`on-trio ${className}`} role="group" aria-label="한양여자대학교 마스코트 하이유 크루(빛나리, 나리, 나래)">
   <Mascot3D className="on-trio-a" src="/onus/brand/hywu-crew-bitnari.webp" alt="빛나리" width={278} height={327} dur={5.2} delay={0} sway={1} />
   <Mascot3D className="on-trio-b" src="/onus/brand/hywu-crew-nari.webp" alt="나리" width={214} height={226} dur={4.4} delay={1.6} sway={1.25} />
   <Mascot3D className="on-trio-c" src="/onus/brand/hywu-crew-narae.webp" alt="나래" width={277} height={287} dur={6} delay={3} sway={0.9} />
  </div>
 );
}
