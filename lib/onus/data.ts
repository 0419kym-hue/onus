import { works } from './works';
import { contests } from './contests';
import { AWARD_ORDER, compareWorks } from './awards';
import type { Award, Contest, Work } from './types';

// 이 파일의 데이터는 코드에 들어 있는 큐레이션 자료(작품 제공자 본인의 수상 기록)입니다.
// DB 연결 실패를 대신 보여 주는 예시 데이터가 아닙니다. 이후 사용자가 직접 등록하는 작품은 DB에서 따로 읽을 예정입니다.
export const allContests: Contest[] = contests;

export function sortedWorks(): Work[] {
 return [...works].sort(compareWorks);
}
export function getWork(slug: string): Work | undefined {
 return works.find((x) => x.slug === slug);
}
export function getContest(slug: string): Contest | undefined {
 return contests.find((x) => x.slug === slug);
}
export function worksOfContest(slug: string): Work[] {
 return works.filter((x) => x.contestSlug === slug).sort(compareWorks);
}

// 통계는 하드코딩하지 않고 작품 기록에서 계산합니다.
export function stats() {
 const byAward = AWARD_ORDER.map((a) => [a, works.filter((x) => x.award === a).length] as [Award, number]).filter(([, n]) => n > 0);
 const years = [...new Set(works.map((x) => x.year))].sort((a, b) => b - a);
 const byYear = years.map((y) => [y, works.filter((x) => x.year === y).length] as [number, number]);
 const byContest = contests
  .map((c) => [c, works.filter((x) => x.contestSlug === c.slug).length] as [Contest, number])
  .filter(([, n]) => n > 0)
  .sort((a, b) => b[1] - a[1]);
 return { total: works.length, byAward, byYear, byContest };
}
