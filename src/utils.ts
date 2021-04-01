import type { TargetCaseType, RuleConfigTuple } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import { camelCase, capitalCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case';
import { green, red } from 'chalk';

export function pipeWith<T>(arg: T, ...fns: ((a: T) => T)[]): T {
  return fns.reduce((v, f) => f(v), arg);
}

export function getLongest(array: string[]): number {
  return array.reduce((x, y) => (x.length > y.length ? x : y)).length;
}

/* istanbul ignore next */
export function assertNever(x: never): never {
  throw new Error('Unexpected object ' + x);
}

export function wordCase(value: string, rule: TargetCaseType): string {
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

export function valueFromRule<T>(rule: RuleConfigTuple<T> | undefined): undefined | T {
  if (rule == null) {
    return undefined;
  }

  const [level, applicable, value] = rule;

  if (level === RuleConfigSeverity.Disabled) {
    return undefined;
  }

  if (applicable === 'never') {
    return undefined;
  }

  return value;
}

export function maxLengthTransformerFactory(maxLength: number | undefined) {
  return (value: string): string => {
    if (maxLength) {
      const color = value.length <= maxLength ? green : red;
      return color(`(${value.length}) ${value}`);
    }

    return value;
  };
}
