import { Rules } from '@commitlint/load';
import { DistinctQuestion } from 'inquirer';

export function buildScope(rules: Rules, questions: DistinctQuestion[]): DistinctQuestion[] {
  let choices: string[] | undefined;
  if (rules['scope-enum']) {
    const [, , scopeEnum] = rules['scope-enum'];
    if (scopeEnum && scopeEnum.length > 0) {
      choices = scopeEnum;
    }
  }

  const name = 'scope';
  const message = 'What is the scope of this change:\n';
  const when = () => {
    if (rules['scope-enum'] && rules['scope-enum'][2].length === 0) {
      return false;
    }

    if (rules['scope-empty'] && rules['scope-empty'][1] === 'always') {
      return false;
    }

    return true;
  };

  let question: DistinctQuestion;
  if (choices) {
    question = {
      name,
      message,
      when,
      choices,
      type: 'list'
    };
  } else {
    question = {
      name,
      message,
      when,
      type: 'input'
    };
  }

  return [...questions, question];
}
