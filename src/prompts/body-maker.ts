import { DistinctQuestion } from 'inquirer';
import { Rules } from '@commitlint/load';
import { validate, maxLengthValidator, minLengthValidator } from '../validators';
import { pipeWith } from '../utils';
import { leadingBlankFilter, maxLineLengthFilter } from '../filters';

export function validatorFactory(rules: Rules) {
  return (value: string) =>
    validate([
      {
        value,
        rule: rules['body-max-length'],
        validator: maxLengthValidator,
        message: length => `Body maximum length of ${length} has been exceeded`
      },
      {
        value,
        rule: rules['body-min-length'],
        validator: minLengthValidator,
        message: length => `Subject minimum length of ${length} has not been met`
      }
    ]);
}

export function filterFactory(rules: Rules) {
  return (value: string) =>
    pipeWith<string>(
      value,
      v => leadingBlankFilter(v, rules['body-leading-blank']),
      v => maxLineLengthFilter(v, rules['body-max-line-length']),
      v => v.replace(/\\n/g, '\n')
    );
}

export function transformerFactory() {
  return (value: string) => {
    return value.replace(/\\n/g, '\n');
  };
}

export function bodyMaker(questions: DistinctQuestion[], rules: Rules): DistinctQuestion[] {
  console.log(rules);
  const bodyQuestions: DistinctQuestion[] = [
    {
      type: 'input',
      name: 'body',
      message: 'Provide a longer description of the change: (press enter to skip, \\n for newline)\n',
      validate: validatorFactory(rules),
      filter: filterFactory(rules),
      transformer: transformerFactory()
    },
    {
      type: 'confirm',
      name: 'isBreaking',
      message: 'Are there any breaking changes?',
      default: false
    },
    {
      type: 'input',
      name: 'body',
      message:
        'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself: (press enter to skip, \\n for newline)\n',
      when: answers => answers.isBreaking && !answers.body.trim(),
      validate: validatorFactory(rules),
      transformer: transformerFactory()
    }
  ];

  return [...questions, ...bodyQuestions];
}
