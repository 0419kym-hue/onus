'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer, MeshTransmissionMaterial, RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const BLUE = '#3182f6';

function Scene({ light }: { light: boolean }) {
 const root = useRef<THREE.Group>(null);
 const knot = useRef<THREE.Mesh>(null);
 const ring = useRef<THREE.Mesh>(null);
 const { viewport } = useThree();
 const wide = viewport.width > 7;

 const satellites = useMemo(
  () => Array.from({ length: light ? 5 : 9 }, (_, i) => {
   const a = (i / (light ? 5 : 9)) * Math.PI * 2;
   const r = 2.3 + (i % 3) * 0.45;
   return { p: [Math.cos(a) * r, Math.sin(a * 1.3) * 1.5, Math.sin(a) * r * 0.6 - 0.5] as [number, number, number], s: 0.22 + (i % 4) * 0.08, cube: i % 2 === 0, i };
  }),
  [light],
 );

 useFrame((state, dt) => {
  const g = root.current;
  if (!g) return;
  const sy = typeof window === 'undefined' ? 0 : Math.min(window.scrollY / 700, 1.4);
  const tx = wide ? viewport.width * 0.2 : 0;
  g.position.x = THREE.MathUtils.damp(g.position.x, tx - sy * 1.2, 4, dt);
  g.position.y = THREE.MathUtils.damp(g.position.y, (wide ? 0 : 1.1) + sy * 1.6, 4, dt);
  g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.55 + sy * 1.2, 3, dt);
  g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.35, 3, dt);
  const sc = wide ? 1 : 0.7;
  g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, sc * (1 - sy * 0.25), 4, dt));
  if (knot.current) { knot.current.rotation.x += dt * 0.25; knot.current.rotation.y += dt * 0.35; }
  if (ring.current) ring.current.rotation.z += dt * 0.18;
 });

 return (
  <>
   <ambientLight intensity={0.4} />
   <pointLight position={[4, 4, 4]} intensity={60} color="#8fc0ff" />
   <pointLight position={[-5, -2, 3]} intensity={40} color="#2a6df0" />
   <group ref={root}>
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
     <mesh ref={knot}>
      <torusKnotGeometry args={[1.05, 0.34, light ? 140 : 256, light ? 20 : 36, 2, 3]} />
      {light ? (
       <meshPhysicalMaterial color={BLUE} metalness={0.3} roughness={0.12} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.4} />
      ) : (
       <MeshTransmissionMaterial backside samples={4} resolution={512} thickness={0.9} chromaticAberration={0.12} anisotropicBlur={0.2} distortion={0.25} distortionScale={0.4} temporalDistortion={0.1} roughness={0.05} color="#bcd8ff" attenuationColor={BLUE} attenuationDistance={1.6} />
      )}
     </mesh>
    </Float>
    <mesh ref={ring} rotation={[Math.PI / 2.6, 0, 0]}>
     <torusGeometry args={[2.1, 0.025, 16, 160]} />
     <meshBasicMaterial color="#9cc7ff" transparent opacity={0.65} />
    </mesh>
    {satellites.map((s) => (
     <Float key={s.i} speed={1 + (s.i % 3) * 0.4} rotationIntensity={1.2} floatIntensity={1.6}>
      <group position={s.p}>
       {s.cube ? (
        <RoundedBox args={[s.s * 2, s.s * 2, s.s * 2]} radius={s.s * 0.45} smoothness={4}>
         <meshPhysicalMaterial color={s.i % 4 === 0 ? '#ffffff' : BLUE} metalness={0.2} roughness={0.15} clearcoat={1} envMapIntensity={1.3} />
        </RoundedBox>
       ) : (
        <mesh>
         <sphereGeometry args={[s.s, 32, 32]} />
         <meshPhysicalMaterial color={s.i % 3 === 0 ? '#6cb0ff' : '#ffffff'} metalness={0.1} roughness={0.1} clearcoat={1} envMapIntensity={1.4} />
        </mesh>
       )}
      </group>
     </Float>
    ))}
   </group>
   <Sparkles count={light ? 40 : 90} scale={[14, 8, 6]} size={3} speed={0.3} opacity={0.7} color="#bcd8ff" />
   {/* 외부 HDR 다운로드 없이 로컬 라이트폼으로 반사 환경을 만듭니다 */}
   <Environment resolution={256}>
    <Lightformer form="rect" intensity={4} position={[0, 5, -6]} scale={[14, 4, 1]} color="#ffffff" />
    <Lightformer form="rect" intensity={3} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 5, 1]} color="#6cb0ff" />
    <Lightformer form="ring" intensity={3} position={[5, 2, 4]} scale={4} color="#3182f6" />
   </Environment>
  </>
 );
}

export default function Hero3D({ light }: { light: boolean }) {
 return (
  <Canvas dpr={light ? [1, 1.4] : [1, 2]} camera={{ position: [0, 0, 7.5], fov: 42 }} gl={{ antialias: !light, alpha: true, powerPreference: 'high-performance' }}>
   <Scene light={light} />
  </Canvas>
 );
}
