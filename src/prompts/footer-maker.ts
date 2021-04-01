import type { QualifiedRules } from '@commitlint/types';
import { valueFromRule, maxLengthTransformerFactory, pipeWith } from '../utils';
import type { Answers, Question } from '../commit-template';
import { validate, maxLengthValidator, minLengthValidator } from '../validators';
import { leadingBlankFilter, maxLineLengthFilter } from '../filters';

const BREAKING_CHANGE = 'BREAKING CHANGE: ';

export function validatorFactory(rules: QualifiedRules): (value: string, answers: Answers) => string | true {
  return (value: string, answers: Answers) => {
    const breaking = answers.breaking ?? '';

    return validate([
      {
        value: value + breaking,
        rule: rules['footer-max-length'],
        validator: maxLengthValidator,
        message: length => `Footer maximum length of ${length} has been exceeded`,
      },
      {
        value: value + breaking,
        rule: rules['footer-min-length'],
        validator: minLengthValidator,
        message: length => `Footer minimum length of ${length} has not been met`,
      },
    ]);
  };
}

export function filterFactory(rules: QualifiedRules, prefix = '') {
  return (value: string): string =>
    pipeWith<string>(
      value,
      v => prefix + v,
      v => leadingBlankFilter(v, rules['footer-leading-blank']),
      v => maxLineLengthFilter(v, rules['footer-max-line-length'])
    );
}

export function breakingChangeMessageFactory(rules: QualifiedRules): () => string {
  return () => {
    const maxLength = valueFromRule(rules['footer-max-length']);
    const MESSAGE = 'Describe the breaking changes';

    if (!maxLength) {
      return `${MESSAGE}:\n`;
    }

    return `${MESSAGE} (max ${maxLength} chars):\n`;
  };
}

export function issuesMessageFactory(rules: QualifiedRules): () => string {
  return () => {
    const maxLength = valueFromRule(rules['footer-max-length']);
    const MESSAGE = 'Add issue references (e.g. "fix #123", "re #123".)';

    if (!maxLength) {
      return `${MESSAGE}:\n`;
    }

    return `${MESSAGE} (max ${maxLength} chars):\n`;
  };
}

function isFixCommit(answers: Answers) {
  return answers?.type == 'fix' ?? false;
}

export function breakingTransformFactory(rules: QualifiedRules, prefix: string): (value: string) => string {
  return (value: string) => {
    const footerMaxLength = valueFromRule(rules['footer-max-length']);

    if (footerMaxLength) {
      return maxLengthTransformerFactory(footerMaxLength - prefix.length)(value);
    }

    return value;
  };
}

export function issuesTransformerFactory(rules: QualifiedRules): (value: string, answers: Answers) => string {
  return (value: string, answers: Answers) => {
    const breaking = answers.breaking ?? '';

    const footerMaxLength = valueFromRule(rules['footer-max-length']);

    if (footerMaxLength) {
      return maxLengthTransformerFactory(footerMaxLength - breaking.length)(value);
    }

    return value;
  };
}

export function footerMaker(questions: Question[], rules: QualifiedRules): Question[] {
  const footerQuestions: Question[] = [
    {
      type: 'confirm',
      name: 'isBreaking',
      message: 'Are there any breaking changes?',
      default: false,
    },
    {
      type: 'input',
      name: 'breaking',
      message: breakingChangeMessageFactory(rules),
      when: answers => !!answers.isBreaking,
      validate: validatorFactory(rules),
      transformer: breakingTransformFactory(rules, BREAKING_CHANGE),
      filter: filterFactory(rules, BREAKING_CHANGE),
    },
    {
      type: 'confirm',
      name: 'isIssue',
      message: 'Does this fix Does this change affect any open issues?',
      when: answers => !isFixCommit(answers),
      default: false,
    },
    {
      type: 'input',
      name: 'issue',
      message: issuesMessageFactory(rules),
      when: answers => isFixCommit(answers) || !!answers.isIssue,
      validate: validatorFactory(rules),
      transformer: issuesTransformerFactory(rules),
      filter: filterFactory(rules),
    },
  ];

  return [...questions, ...footerQuestions];
}
