import type { RuleConfigTuple } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';

export function enumWhen(rule: RuleConfigTuple<string[]> | undefined): boolean {
  if (rule === undefined) {
    return true;
  }

  const [level, applicable, value] = rule;

  if (level === RuleConfigSeverity.Disabled) {
    return true;
  }

  const emptyEnum = value?.length === 0;

  if (applicable === 'always') {
    return !emptyEnum;
  }

  return true;
}

export function emptyWhen(rule: RuleConfigTuple<undefined> | undefined): boolean {
  if (rule === undefined) {
    return true;
  }

  const [level, applicable] = rule;

  if (level === RuleConfigSeverity.Disabled) {
    return true;
  }

  return applicable === 'never';
}

export function whenFactory(
  enumRule: RuleConfigTuple<string[]> | undefined,
  emptyRule: RuleConfigTuple<undefined> | undefined
): () => boolean {
  return () => {
    // return false if either of the rules return false
    return ![enumWhen(enumRule), emptyWhen(emptyRule)].includes(false);
  };
}
