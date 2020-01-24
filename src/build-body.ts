import { Rules } from '@commitlint/load';
import { Question } from 'inquirer';

export function buildBody(rules: Rules, questions: Question[]): Question[] {

  const question: Question = {
    type: 'input',
    name: 'body',
    message: 'Provide a longer description of the change:'
  };

  return [...questions, question];
}
