import { Rules } from '@commitlint/load';
import { valueFromRule, maxLengthTransformerFactory, pipeWith } from '../utils';
import { Answers, Question } from '../commit-template';
import { validate, maxLengthValidator, minLengthValidator } from '../validators';
import { leadingBlankFilter, maxLineLengthFilter } from '../filters';

export function validatorFactory(rules: Rules) {
  return (value: string, answers: Answers) => {
    const breaking = answers.breaking ?? '';

    return validate([
      {
        value: value + breaking,
        rule: rules['footer-max-length'],
        validator: maxLengthValidator,
        message: length => 'Footer maximum length of ${length} has been exceeded'
      },
      {
        value: value + breaking,
        rule: rules['footer-min-length'],
        validator: minLengthValidator,
        message: length => `Footer minimum length of ${length} has not been met`
      }
    ]);
  };
}

export function filterFactory(rules: Rules) {
  return (value: string): string =>
    pipeWith<string>(
      value,
      v => leadingBlankFilter(v, rules['footer-leading-blank']),
      v => maxLineLengthFilter(v, rules['footer-max-line-length'])
    );
}

export function breakingChangeMessageFactory(rules: Rules) {
  return () => {
    const maxLength = valueFromRule(rules['footer-max-length']);

    if (!maxLength) {
      return `Describe the breaking changes:\n`;
    }

    return `Describe the breaking changes:\n (max ${maxLength} chars):\n`;
  };
}

export function issuesMessageFactory(rules: Rules) {
  return () => {
    const maxLength = valueFromRule(rules['footer-max-length']);

    if (!maxLength) {
      return `List issues fixed:\n`;
    }

    return `List issues fixed:\n (max ${maxLength} chars):\n`;
  };
}

function isFixCommit(answers: Answers) {
  return answers?.type == 'fix' ?? false;
}

export function issuesTransformerFactory(rules: Rules) {
  return (value: string, answers: Answers) => {
    const breaking = answers.breaking ?? '';

    const footerMaxLength = valueFromRule(rules['footer-max-length']);

    if (footerMaxLength) {
      return maxLengthTransformerFactory(footerMaxLength - breaking.length)(value);
    }

    return value;
  };
}

export function footerMaker(questions: Question[], rules: Rules): Question[] {
  const breakingQuestions: Question[] = [
    {
      type: 'confirm',
      name: 'isBreaking',
      message: 'Are there any breaking changes?',
      default: false
    },
    {
      type: 'input',
      name: 'breaking',
      message: breakingChangeMessageFactory(rules),
      when: answers => !!answers.isBreaking,
      validate: validatorFactory(rules),
      transformer: maxLengthTransformerFactory(valueFromRule(rules['footer-max-length'])),
      filter: filterFactory(rules)
    },
    {
      type: 'confirm',
      name: 'isIssue',
      message: 'Does this fix any issues?',
      when: answers => !isFixCommit(answers),
      default: false
    },
    {
      type: 'input',
      name: 'issue',
      message: issuesMessageFactory(rules),
      when: answers => isFixCommit(answers) || !!answers.isIssue,
      validate: validatorFactory(rules),
      transformer: issuesTransformerFactory(rules),
      filter: filterFactory(rules)
    }
  ];

  return [...questions, ...breakingQuestions];
}
