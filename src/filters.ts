import { Rule, Level } from "@commitlint/load";

export function leadingBlank(value: string, rule: Rule<void>): string {
  const [level, applicable] = rule;

  if (level === Level.Disable) {
    return value;
  }

  if (applicable === 'always') {
    return value.trimLeft();
  }

  return value;
}
