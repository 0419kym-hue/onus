import type { Journey } from './types';

// 선배의 준비 기간을 일 수와 화면 문구로 바꿉니다. 값이 없으면 undefined 이고, 추측해서 채우지 않습니다.
export function durationDays(j?: Journey): number | undefined {
 if (!j) return undefined;
 if (j.days) return j.days;
 if (j.weeks) return j.weeks * 7;
 return undefined;
}

export function durationLabel(j?: Journey): string | undefined {
 if (!j) return undefined;
 const approx = j.approx ? '약 ' : '';
 if (j.days) return `${approx}${j.days}일`;
 if (j.weeks) return `${approx}${j.weeks}주`;
 return undefined;
}
