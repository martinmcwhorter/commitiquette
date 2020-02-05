import { Case, Level, Rule } from '@commitlint/load';
import wordWrap from 'word-wrap';
import { wordCase } from './utils';

export function leadingBlankFilter(value: string, rule: Rule<undefined> | undefined): string {
  if (rule == null) {
    return value;
  }

  const [level, applicable] = rule;

  if (level === Level.Disable) {
    return value;
  }

  if (applicable === 'always') {
    return '\n' + value.trimLeft();
  }

  return value.trimLeft();
}

export function fullStopFilter(value: string, rule: Rule<string> | undefined): string {
  if (rule == null) {
    return value;
  }

  const [level, applicable, ruleValue] = rule;

  if (level === Level.Disable) {
    return value;
  }

  if (applicable === 'never') {
    return value.trimRight().endsWith(ruleValue) ? value.trimRight().slice(0, -1) : value;
  }

  return value.trimRight().endsWith(ruleValue) ? value : value.trimRight() + ruleValue;
}

export function wordCaseFilter(value: string, rule: Rule<Case | Case[]> | undefined): string {
  if (rule == null) {
    return value;
  }

  const [level, applicable, ruleValue] = rule;

  if (typeof ruleValue !== 'string') {
    return value;
  }

  if (level === Level.Disable) {
    return value;
  }

  if (applicable === 'never') {
    return value;
  }

  return wordCase(value, ruleValue);
}

export function maxLineLengthFilter(value: string, rule: Rule<number> | undefined): string {
  if (rule == null) {
    return value;
  }

  const [level, applicable, ruleValue] = rule;

  if (level === Level.Disable) {
    return value;
  }

  if (applicable === 'never') {
    return value;
  }

  return wordWrap(value, { width: ruleValue, indent: '' });
}
