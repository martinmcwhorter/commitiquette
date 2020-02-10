import { Rules } from '@commitlint/load';
import { validate, maxLengthValidator, minLengthValidator } from '../validators';
import { pipeWith, maxLengthTransformerFactory, valueFromRule } from '../utils';
import { leadingBlankFilter, maxLineLengthFilter } from '../filters';
import { Question } from '../commit-template';

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
        message: length => `Body minimum length of ${length} has not been met`
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

export function transformerFactory(rules: Rules) {
  const maxLength = valueFromRule(rules['body-max-length']);

  const maxLenTransformer = maxLength ? maxLengthTransformerFactory(maxLength) : (value: string) => value;

  return (value: string) => {
    return pipeWith(
      value,
      v => v.replace(/\\n/g, '\n'),
      v => maxLenTransformer(v)
    );
  };
}

export function bodyMaker(questions: Question[], rules: Rules): Question[] {
  console.log(rules);
  const bodyQuestions: Question[] = [
    {
      type: 'input',
      name: 'body',
      message: 'Provide a longer description of the change: (press enter to skip, \\n for newline)\n',
      validate: validatorFactory(rules),
      filter: filterFactory(rules),
      transformer: transformerFactory(rules)
    }
  ];

  return [...questions, ...bodyQuestions];
}
