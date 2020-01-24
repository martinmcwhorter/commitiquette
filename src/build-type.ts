import { Rules } from '@commitlint/load';
import { Question, Choice } from 'inquirer';
import commitTypes from 'conventional-commit-types'
import { getLongest } from './utils';

export function buildType(rules: Rules, questions: Question[]): Question[] {
  const [, , typeEnum] = rules['type-enum'] ?? [, , null];

  let choices: Choice[] | undefined;
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

  const question: Question = {
    name,
    message,
    type: 'list',
    choices
  };

  return [...questions, question];
}


