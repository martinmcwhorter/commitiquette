import { Rules } from '@commitlint/load';
import { red, green } from 'chalk';
import { pipeWith, valueFromRule } from '../utils';
import { caseValidator, emptyValidator, maxLengthValidator, minLengthValidator, validate } from '../validators';
import { fullStopFilter, wordCaseFilter } from '../filters';
import { headerTemplate, Answers, Question } from '../commit-template';

export function validatorFactory(rules: Rules) {
  return (value: string, answers: Answers) => {
    const headerValue = headerTemplate(answers.type, answers.scope, value);

    return validate([
      {
        value: headerValue,
        rule: rules['header-max-length'],
        validator: maxLengthValidator,
        message: (length) => `Header "${headerValue}" cannot be longer than ${length}`,
      },
      {
        value,
        rule: rules['subject-max-length'],
        validator: maxLengthValidator,
        message: (length) => `Subject maximum length of ${length} has been exceeded`,
      },
      {
        value,
        rule: rules['subject-min-length'],
        validator: minLengthValidator,
        message: (length) => `Subject minimum length of ${length} has not been met`,
      },
      {
        value,
        rule: rules['subject-empty'],
        validator: emptyValidator,
        message: () => 'Subject cannot be empty',
      },
      {
        value,
        rule: rules['subject-case'],
        validator: caseValidator,
        message: (ruleValue, applicable) => `Subject must ${applicable == 'never' ? 'not ' : ''}be in ${ruleValue}`,
      },
    ]);
  };
}

export function filterFactory(rules: Rules) {
  return (value: string) =>
    pipeWith<string>(
      value,
      (v) => wordCaseFilter(v, rules['subject-case']),
      (v) => fullStopFilter(v, rules['subject-full-stop'])
    );
}

export function messageFactory(rules: Rules) {
  return (answers: Answers) => {
    const maxLength = valueFromRule(rules['header-max-length']);

    if (!maxLength) {
      return `Write a short, imperative tense description of the change:\n`;
    }

    return `Write a short, imperative tense description of the change (max ${
      maxLength - headerTemplate(answers.type, answers.scope).length
    } chars):\n`;
  };
}

export function transformerFactory(rules: Rules) {
  const filter = filterFactory(rules);

  return (value: string, answers: Answers) => {
    const headerMaxLength = valueFromRule(rules['header-max-length']);

    if (headerMaxLength) {
      const color =
        filter(value).length <= headerMaxLength - headerTemplate(answers.type, answers.scope).length ? green : red;
      return color(`(${value.length}) ${value}`);
    }

    const subjectMaxLength = valueFromRule(rules['subject-max-length']);
    if (subjectMaxLength) {
      const color = filter(value).length <= subjectMaxLength ? green : red;
      return color(`(${value.length}) ${value}`);
    }

    return value;
  };
}

export function subjectMaker(questions: Question[], rules: Rules): Question[] {
  const filter = filterFactory(rules);

  const question: Question = {
    message: messageFactory(rules),
    name: 'subject',
    type: 'input',
    validate: validatorFactory(rules),
    filter,
    transformer: transformerFactory(rules),
  };

  return [...questions, question];
}
