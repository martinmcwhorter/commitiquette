import { Rules } from '@commitlint/load';
import { ChoiceOptions, DistinctQuestion, ListQuestion } from 'inquirer';
import commitTypes from 'conventional-commit-types';
import { getLongest } from '../utils';
import { caseValidator, emptyValidator, maxLengthValidator, minLengthValidator, validate } from '../validators';
import { whenFactory } from '../when';
import { wordCaseFilter } from '../filters';

export function validatorFactory(rules: Rules) {
  return (value: string) => {
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
}

export function filterFactory(rules: Rules) {
  return (value: string) => wordCaseFilter(value, rules['type-case']);
}

export function choicesFactory(rules: Rules) {
  const [, , typeEnum] = rules['type-enum'] ?? [, , null];

  let choices: ChoiceOptions[] | undefined;
  if (typeEnum && typeEnum.length > 0) {
    const longest = getLongest(typeEnum);
    choices = typeEnum.map(value => ({
      name: `${value.padEnd(longest)} ${commitTypes?.types[value]?.description ?? ''}`,
      value: value,
      short: value
    }));
  }

  return choices;
}

export function typeMaker(questions: DistinctQuestion[], rules: Rules): DistinctQuestion[] {
  const question: ListQuestion = {
    name: 'type',
    message: "Select the type of change you're committing:\n",
    type: 'list',
    choices: choicesFactory(rules),
    validate: validatorFactory(rules),
    when: whenFactory(rules['type-enum'], rules['type-empty']),
    filter: filterFactory(rules)
  };

  return [...questions, question];
}
