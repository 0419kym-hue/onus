// ON:US 수상작 이미지를 웹용으로 변환합니다. 원본 폴더(../수상)는 읽기만 하고 수정하지 않습니다.
// 원본 파일 이름에 개인정보가 들어 있을 수 있어서 이 파일에는 이름 앞부분(접두사)만 적습니다.
// 출력 파일 이름에는 실명·학번이 들어가지 않습니다.
// 실행: node scripts/onus-images.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(process.cwd(), '..', '수상');
const OUT = path.resolve(process.cwd(), 'public', 'onus', 'works');
const PDF_OUT = path.resolve(process.cwd(), 'public', 'onus', 'pdf');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PDF_OUT, { recursive: true });

// slug → 원본 파일 이름의 앞부분. 첫 번째 파일이 목록 표지로도 쓰입니다.
const MAP = {
  'pulse-field': ['PULSE FIELD 도시의 흐름을 감지하는 반응형 트램 정거장_1', 'PULSE FIELD 도시의 흐름을 감지하는 반응형 트램 정거장_2'],
  'ripple-beacon': ['RIPPLE BEACON 스마트 연결형 구명부표_1', 'RIPPLE BEACON 스마트 연결형 구명부표_2'],
  'step-grip-assist': ['STEP GRIP ASSIST 2.0_1', 'STEP GRIP ASSIST 2.0_2'],
  'urban-wetland-archive': ['경남 K-디자인어워드1_'],
  'thermal-commons': ['경남 K-디자인어워드2_'],
  'cadence': ['국제색채공모전_'],
  'woven-time': ['국제조형학회공모전_'],
  'the-last-voice': ['AI 건축 국제공모전1_'],
  'bioscape-hanbat': ['한밭수목원 (1)', '한밭수목원2'],
  'chronoscape': ['대전시립미술관 (1)', '대전시립미술관2'],
  'mirage': ['드론.jpg', '드론2 (1)'],
};

const files = fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.jpg'));
const report = [];
for (const [slug, prefixes] of Object.entries(MAP)) {
  for (let i = 0; i < prefixes.length; i++) {
    const hits = files.filter((f) => f.startsWith(prefixes[i]));
    if (hits.length !== 1) { report.push(`확인 필요: ${slug} #${i + 1} — 일치하는 파일 ${hits.length}개`); continue; }
    const input = path.join(SRC, hits[0]);
    const meta = await sharp(input, { limitInputPixels: false }).metadata();
    // 상세용: 가로 1600px 이하, 세로 비율 유지
    const full = path.join(OUT, `${slug}-${i + 1}.webp`);
    await sharp(input, { limitInputPixels: false }).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(full);
    // 표지용(첫 번째 이미지만): 4:5 비율로 위쪽 기준 잘라내기
    if (i === 0) {
      await sharp(input, { limitInputPixels: false }).resize({ width: 900, height: 1125, fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(path.join(OUT, `${slug}-cover.webp`));
    }
    report.push(`${slug}-${i + 1}.webp  원본 ${meta.width}x${meta.height} → ${Math.round(fs.statSync(full).size / 1024)}KB`);
  }
}

// PDF(미래 서초): 이름이 '미래 서초'로 시작하고 .pdf 로 끝나는 파일을 그대로 복사
const pdf = fs.readdirSync(SRC).find((f) => f.startsWith('미래 서초') && f.toLowerCase().endsWith('.pdf'));
if (pdf) {
  fs.copyFileSync(path.join(SRC, pdf), path.join(PDF_OUT, 'future-seocho.pdf'));
  report.push('future-seocho.pdf 복사');
} else report.push('확인 필요: 미래 서초 PDF를 찾지 못했어요');

console.log(report.join('\n'));
