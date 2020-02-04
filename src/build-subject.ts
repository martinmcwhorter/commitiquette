import { Rules, Level } from '@commitlint/load';
import { DistinctQuestion } from 'inquirer';
import { validate, maxLengthValidator, emptyValidator, minLengthValidator, caseValidator } from './validators';
import { wordCaseFilter, fullStopFilter } from './filters';
import { pipeWith, valueFromRule } from './utils';
import inquirer = require('inquirer');

export function buildSubject(rules: Rules, questions: DistinctQuestion[]): DistinctQuestion[] {
  const header = (type: string, scope?: string, subject?: string) => {
    let header = `${type}`;
    if (scope) {
      header += `(${scope})`;
    }
    if (subject) {
      header += subject;
    }
    header += ': ';

    return header;
  };

  const validateSubject = (
    value: string,
    answers: {
      type: string;
      scope: string;
    }
  ) => {
    const headerValue = header(answers.type, answers.scope);

    console.log('RULES', rules);

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

  const filter = (value: string) => {
    const result: string = pipeWith<string>(
      value,
      v => wordCaseFilter(v, rules['subject-case']),
      v => fullStopFilter(v, rules['subject-full-stop'])
    );

    console.log('RESLUT', result);
    return result;
  };

  const message = (answers: inquirer.Answers) => {
    const maxLength = valueFromRule(rules['header-min-length']);

    if (!maxLength) {
      return `Write a short, imperative tense description of the change:\n`;
    }

    return `Write a short, imperative tense description of the change (max ${maxLength -
      header(answers.type, answers.scope).length} chars):\n`;
  };

  const question: DistinctQuestion = {
    message,
    name: 'subject',
    type: 'input',
    validate: validateSubject,
    filter
  };

  return [...questions, question];
}
