import type { TargetCaseType, RuleConfigTuple, RuleConfigCondition } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import { wordCase } from './utils';

type ValidateRulesWithRuleValue = (value: string, ruleValue: number) => boolean;
type ValidateRulesWithCaseValue = (value: string, ruleValue: TargetCaseType, inclusive?: boolean) => boolean;
type ValidatorRulesWithoutValue = (value: string) => boolean;
type Validator = ValidateRulesWithRuleValue | ValidatorRulesWithoutValue | ValidateRulesWithCaseValue;

export function validate(
  validators: {
    value: string;
    rule: RuleConfigTuple<number | TargetCaseType | TargetCaseType[] | undefined> | undefined;
    validator: Validator;
    message: (length?: number | TargetCaseType | TargetCaseType[], applicable?: RuleConfigCondition) => string;
  }[]
): string | true {
  const errorMessages: string[] = validators
    .map(v => {
      if (v.rule === undefined) {
        return true;
      }

      const [level, applicable, ruleValue] = v.rule;

      if (level !== RuleConfigSeverity.Error) {
        return true;
      }

      let valid: boolean;
      if (Array.isArray(ruleValue) && applicable === 'never') {
        valid = v.validator(v.value, ruleValue as never, false);
      } else {
        valid = v.validator(v.value, ruleValue as never);
      }

      if (applicable === 'never') {
        valid = !valid;
      }

      if (!valid) {
        return v.message(ruleValue, applicable);
      }

      return true;
    })
    .filter(message => message !== true) as string[];

  if (errorMessages.length === 0) {
    return true;
  }

  return errorMessages.join('\n');
}

export function maxLengthValidator(value: string, length: number): boolean {
  return value.length <= length;
}

export function maxLineLengthValidator(value: string, length: number): boolean {
  return value.split(/\r?\n/).every(line => maxLengthValidator(line, length));
}

export function minLengthValidator(value: string, length: number): boolean {
  return value.length >= length;
}

export function emptyValidator(value: string): boolean {
  return value.length < 1;
}

export function caseValidator(value: string, rule: TargetCaseType | TargetCaseType[], inclusive = true): boolean {
  if (typeof rule === 'string') {
    return value == wordCase(value, rule);
  }

  if (inclusive) {
    return rule.every(r => wordCase(value, r) === value);
  }

  return rule.some(r => wordCase(value, r) === value);
}
