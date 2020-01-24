export const pipeWith = <T>(arg: T, ...fns: ((a: T) => T)[]) => fns.reduce((v, f) => f(v), arg);

export function getLongest(array: string[]) {
  return array.reduce((x, y) => (x.length > y.length ? x : y)).length;
}
