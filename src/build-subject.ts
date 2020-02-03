import { Rules } from '@commitlint/load';
import { DistinctQuestion } from 'inquirer';
import { validate, maxLengthValidator, emptyValidator, minLengthValidator, caseValidator } from './validators';
import { wordCaseFilter } from './filters';

export function buildSubject(rules: Rules, questions: DistinctQuestion[]): DistinctQuestion[] {
  const validateSubject = (
    value: string,
    answers: {
      type: string;
      Subject?: string;
    }
  ) => {
    let header = `${answers.type}`;
    if (answers.Subject) {
      header += `(${answers.Subject})`;
    }
    header += `: ${value}`;
    return validate([
      {
        value: header,
        rule: rules['header-max-length'],
        validator: maxLengthValidator,
        message: length => `Header "${header}" cannot be longer than ${length} chars`
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

  const question: DistinctQuestion = {
    message: 'Write a short, imperative tense description of the change:\n',
    name: 'subject',
    type: 'input',
    validate: validateSubject,
    filter: value => wordCaseFilter(value, rules['subject-case'])
  };

  return [...questions, question];
}
