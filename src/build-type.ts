import { Rules } from '@commitlint/load';
import { ChoiceOptions, ListQuestion, DistinctQuestion } from 'inquirer';
import commitTypes from 'conventional-commit-types';
import { getLongest } from './utils';
import { validate, emptyValidator, maxLengthValidator, minLengthValidator, caseValidator } from './validators';
import { whenFactory } from './when';
import { wordCaseFilter } from './filters';

export function buildType(rules: Rules, questions: DistinctQuestion[]): DistinctQuestion[] {
  const [, , typeEnum] = rules['type-enum'] ?? [, , null];

  const validateType = (value: string) => {
    return validate([
      {
        value,
        rule: rules['type-empty'],
        validator: emptyValidator,
        message: () => 'Type of commit must be supplied'
      },
      {
        value,
        rule: rules['type-max-length'],
        validator: maxLengthValidator,
        message: length => `Type maximum length of ${length} has been exceeded`
      },
      {
        value,
        rule: rules['type-min-length'],
        validator: minLengthValidator,
        message: length => `Type minimum length of ${length} has not been met`
      },
      {
        value,
        rule: rules['type-empty'],
        validator: emptyValidator,
        message: () => 'Type cannot be empty'
      },
      {
        value,
        rule: rules['type-case'],
        validator: caseValidator,
        message: (ruleValue, applicable) =>
          `Type must ${applicable == 'never' ? 'not' : 'ruleValue'} be in ${ruleValue}`
      }
    ]);
  };

  const filter = (value: string) => wordCaseFilter(value, rules['type-case']);

  let choices: ChoiceOptions[] | undefined;
  if (typeEnum && typeEnum.length > 0) {
    const longest = getLongest(typeEnum);
    choices = typeEnum.map(value => ({
      name: `${value.padEnd(longest)} ${commitTypes?.types[value]?.description ?? ''}`,
      value: value,
      short: value
    }));
  }

  const name = 'type';
  const message = "Select the type of change you're committing:\n";

  const question: ListQuestion = {
    name,
    message,
    type: 'list',
    choices,
    validate: validateType,
    when: whenFactory(rules['type-enum'], rules['type-empty']),
    filter
  };

  return [...questions, question];
}
