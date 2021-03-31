import { Rules } from '@commitlint/load';
import { ChoiceOptions, ListQuestion } from 'inquirer';
import { types, CommitType } from 'conventional-commit-types';
import { getLongest } from '../utils';
import { caseValidator, emptyValidator, maxLengthValidator, minLengthValidator, validate } from '../validators';
import { whenFactory } from '../when';
import { wordCaseFilter } from '../filters';
import { Question, Answers } from '../commit-template';

export function validatorFactory(rules: Rules) {
  return (value: string) => {
    return validate([
      {
        value,
        rule: rules['type-max-length'],
        validator: maxLengthValidator,
        message: (length) => `Type maximum length of ${length} has been exceeded`,
      },
      {
        value,
        rule: rules['type-min-length'],
        validator: minLengthValidator,
        message: (length) => `Type minimum length of ${length} has not been met`,
      },
      {
        value,
        rule: rules['type-empty'],
        validator: emptyValidator,
        message: () => 'Type cannot be empty',
      },
      {
        value,
        rule: rules['type-case'],
        validator: caseValidator,
        message: (ruleValue, applicable) => `Type must ${applicable == 'never' ? 'not ' : ''}be in ${ruleValue}`,
      },
    ]);
  };
}

export function filterFactory(rules: Rules) {
  return (value: string) => wordCaseFilter(value, rules['type-case']);
}

export function choicesFactory(rules: Rules, commitTypes: CommitType) {
  const [, , typeEnum] = rules['type-enum'] ?? [, , null];

  let choices: ChoiceOptions[] | undefined;
  if (typeEnum && typeEnum.length > 0) {
    const longest = getLongest(typeEnum);
    choices = typeEnum.map((value) => ({
      name: `${value.padEnd(longest)}: ${commitTypes[value]?.description ?? ''}`,
      value: value,
      short: value,
    }));
  }

  return (
    choices ||
    Object.keys(commitTypes).map((commitType) => ({
      name: `${commitType}: ${commitTypes[commitType].description ?? ''}`,
      value: commitType,
      short: commitType,
    }))
  );
}

export function typeMaker(questions: Question[], rules: Rules): Question[] {
  const question: ListQuestion<Answers> = {
    name: 'type',
    message: "Select the type of change you're committing:\n",
    type: 'list',
    choices: choicesFactory(rules, types),
    validate: validatorFactory(rules),
    when: whenFactory(rules['type-enum'], rules['type-empty']),
    filter: filterFactory(rules),
  };

  return [...questions, question];
}
