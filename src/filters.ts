import type { TargetCaseType, RuleConfigTuple, QualifiedRules } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import wordWrap from 'word-wrap';
import { wordCase } from './utils';

export function leadingBlankFilter(value: string, rule: RuleConfigTuple<undefined> | undefined): string {
  if (rule === undefined) {
    return value;
  }

  if (!value) {
    return value;
  }

  const [level, applicable] = rule;

  if (level === RuleConfigSeverity.Disabled) {
    return value;
  }

  if (applicable === 'always') {
    return '\n' + value.trimLeft();
  }

  return value.trimLeft();
}

export function fullStopFilter(value: string, rule: QualifiedRules['subject-full-stop'] | undefined): string {
  if (rule === undefined) {
    return value;
  }

  const [level, applicable, ruleValue = '.'] = rule;

  if (level === RuleConfigSeverity.Disabled) {
    return value;
  }

  if (applicable === 'never') {
    return value.trimRight().endsWith(ruleValue) ? value.trimRight().slice(0, -1) : value;
  }

  return value.trimRight().endsWith(ruleValue) ? value : value.trimRight() + ruleValue;
}

export function wordCaseFilter(
  value: string,
  rule: RuleConfigTuple<TargetCaseType | TargetCaseType[]> | undefined
): string {
  if (rule == null) {
    return value;
  }

  const [level, applicable, ruleValue] = rule;

  if (typeof ruleValue !== 'string') {
    return value;
  }

  if (level === RuleConfigSeverity.Disabled) {
    return value;
  }

  if (applicable === 'never') {
    return value;
  }

  return wordCase(value, ruleValue);
}

export function maxLineLengthFilter(value: string, rule: RuleConfigTuple<number> | undefined): string {
  if (rule == null) {
    return value;
  }

  const [level, applicable, ruleValue] = rule;

  if (level === RuleConfigSeverity.Disabled) {
    return value;
  }

  if (applicable === 'never') {
    return value;
  }

  return wordWrap(value, { width: ruleValue, indent: '' });
}
