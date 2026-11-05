// 기능 스위치. 해커톤 트랙 규정상 AI 기능을 꺼야 하면 Vercel 환경변수 ONUS_AI_DISABLED=true 로 설정하고 다시 배포합니다.
export const aiEnabled = () => process.env.ONUS_AI_DISABLED !== 'true';
