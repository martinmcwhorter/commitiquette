import { Level, Rule } from '@commitlint/load';

export function enumWhen(rule: Rule<string[]> | undefined) {
  if (rule == null) {
    return true;
  }

  const [level, applicable, value] = rule;

  if (level == Level.Disable) {
    return true;
  }

  const emptyEnum = value.length == 0;

  if (applicable == 'always') {
    return !emptyEnum;
  }

  return true;
}

export function emptyWhen(rule: Rule<undefined> | undefined) {
  if (rule == null) {
    return true;
  }

  const [level, applicable] = rule;

  if (level == Level.Disable) {
    return true;
  }

  return applicable == 'never';
}

export function whenFactory(
  enumRule: Rule<string[]> | undefined,
  emptyRule: Rule<undefined> | undefined
): () => boolean {
  return () => {
    // return false if either of the rules return false
    return ![enumWhen(enumRule), emptyWhen(emptyRule)].includes(false);
  };
}
