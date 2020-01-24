import { Rules } from '@commitlint/load';
import { DistinctQuestion } from 'inquirer';

export function buildBody(rules: Rules, questions: DistinctQuestion[]): DistinctQuestion[] {
  const question: DistinctQuestion = {
    type: 'input',
    name: 'body',
    message: 'Provide a longer description of the change:'
  };

  return [...questions, question];
}
