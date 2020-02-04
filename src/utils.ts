import { Case, Rule, Level } from '@commitlint/load';
import { snakeCase, pascalCase, sentenceCase, capitalCase, paramCase, camelCase } from 'change-case';

export const pipeWith = <T>(arg: T, ...fns: ((a: T) => T)[]) => fns.reduce((v, f) => f(v), arg);

export function getLongest(array: string[]) {
  return array.reduce((x, y) => (x.length > y.length ? x : y)).length;
}

/* istanbul ignore next */
export function assertNever(x: never): never {
  throw new Error('Unexpected object ' + x);
}

export function wordCase(value: string, rule: Case): string {
  switch (rule) {
    case 'lower-case':
    case 'lowerCase':
    case 'lowercase':
      return value.toLowerCase();
    case 'snake-case':
      return snakeCase(value);
    case 'pascal-case':
      return pascalCase(value);
    case 'sentence-case':
    case 'sentencecase':
      return sentenceCase(value);
    case 'start-case':
      return capitalCase(value);
    case 'kebab-case':
      return paramCase(value);
    case 'upper-case':
    case 'uppercase':
      return value.toUpperCase();
    case 'camel-case':
      return camelCase(value);
    /* istanbul ignore next */
    default:
      return assertNever(rule);
  }
}

export function valueFromRule<T>(rule: Rule<T> | undefined): false | T {
  if (rule == null) {
    return false;
  }

  const [level, applicable, value] = rule;

  if (level == Level.Disable) {
    return false;
  }

  if (applicable == 'never') {
    return false;
  }

  return value;
}
