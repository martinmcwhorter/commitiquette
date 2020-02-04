import { Rules } from '@commitlint/load';
import { Answers, DistinctQuestion } from 'inquirer';
import { pipeWith, valueFromRule } from './utils';
import { caseValidator, emptyValidator, maxLengthValidator, minLengthValidator, validate } from './validators';
import { fullStopFilter, wordCaseFilter } from './filters';

export function header(type: string, scope?: string, subject?: string): string {
  let header = `${type}`;
  if (scope) {
    header += `(${scope})`;
  }
  if (subject) {
    header += subject;
  }
  header += ': ';

  return header;
}

export function validatorFactory(rules: Rules) {
  return (
    value: string,
    answers: {
      type: string;
      scope: string;
    }
  ) => {
    const headerValue = header(answers.type, answers.scope);

    return validate([
      {
        value: headerValue,
        rule: rules['header-max-length'],
        validator: maxLengthValidator,
        message: length => `Header "${headerValue}" cannot be longer than ${length} chars`
      },
      {
        value,
        rule: rules['subject-empty'],
        validator: emptyValidator,
        message: () => 'Subject of commit must be supplied'
      },
      {
        value,
        rule: rules['subject-max-length'],
        validator: maxLengthValidator,
        message: length => `Subject maximum length of ${length} has been exceeded`
      },
      {
        value,
        rule: rules['subject-min-length'],
        validator: minLengthValidator,
        message: length => `Subject minimum length of ${length} has not been met`
      },
      {
        value,
        rule: rules['subject-empty'],
        validator: emptyValidator,
        message: () => 'Subject cannot be empty'
      },
      {
        value,
        rule: rules['subject-case'],
        validator: caseValidator,
        message: (ruleValue, applicable) =>
          `Subject must ${applicable == 'never' ? 'not' : 'ruleValue'} be in ${ruleValue}`
      }
    ]);
  };
}

export function filterFactory(rules: Rules) {
  return (value: string) =>
    pipeWith<string>(
      value,
      v => wordCaseFilter(v, rules['subject-case']),
      v => fullStopFilter(v, rules['subject-full-stop'])
    );
}

export function messageFactory(rules: Rules) {
  return (answers: Answers) => {
    const maxLength = valueFromRule(rules['header-min-length']);

    if (!maxLength) {
      return `Write a short, imperative tense description of the change:\n`;
    }

    return `Write a short, imperative tense description of the change (max ${maxLength -
      header(answers.type, answers.scope).length} chars):\n`;
  };
}

export function subjectMaker(questions: DistinctQuestion[], rules: Rules): DistinctQuestion[] {
  const question: DistinctQuestion = {
    message: messageFactory(rules),
    name: 'subject',
    type: 'input',
    validate: validatorFactory(rules),
    filter: filterFactory(rules)
  };

  return [...questions, question];
}
