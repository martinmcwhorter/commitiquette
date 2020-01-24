import { Rules } from '@commitlint/load';
import { Question, Choice } from 'inquirer';

export function buildScope(rules: Rules, questions: Question[]): Question[] {

  let choices: Choice[] | undefined;
  if (rules['scope-enum']) {
    const [, , scopeEnum] = rules['scope-enum'];
    if (scopeEnum && scopeEnum.length > 0) {
      choices = scopeEnum;
    }
  }
  const question: Question = {
    name: 'scope',
    message: 'What is the scope of this change:\n',
    type: choices ? 'list' : 'input',
    choices: choices ? choices : undefined,
    when: () => {

      if (rules['scope-enum'] && rules['scope-enum'][2].length === 0) {
        return false;
      }

      if (rules['scope-empty'] && rules['scope-empty'][1] === 'always') {
        return false;
      }

      return true;
    }
  };
  return [...questions, question];
}
