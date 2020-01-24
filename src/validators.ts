import { Rule, Level, Applicability } from "@commitlint/load";

export function validate(
  validators: {
    value: string | null,
    rule: Rule<number | null> | undefined,
    validator: (value: string, ruleValue: number, applicable: Applicability) => boolean,
    message: (length: number | number) => string
  }[]): string | true {

    const errorMessages: string[] = validators.map(v => {

      if (v.rule == undefined) {
        return true;
      }

      const [level, applicable, length] = v.rule;

      if (level !== Level.Error) {
        return true;
      }

      if (length == null) {
        return true;
      }

      if (v.value == null) {
        if (applicable === 'never') {
          return true;
        } else {
          return v.message(length);
        }
      }

      const valid = v.validator(v.value, length, applicable);

      if (!valid) {
        return v.message(length);
      }

      return true;

    }).filter(message => message !== true) as string[];

    if (errorMessages.length === 0) {
      return true;
    }

    return errorMessages.join('\n');
}


export function maxLength(value: string, length: number, applicable: Applicability): boolean {

  if (value.length <= length) {
    return applicable === 'always';
  }

  return false
}

export function maxLineLenth(value: string, length: number, applicable: Applicability): boolean {

  return value.split(/\r?\n/).every(line => maxLength(line, length, applicable));
}

