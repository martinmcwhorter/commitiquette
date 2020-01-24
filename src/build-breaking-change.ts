import { Rules } from '@commitlint/load';
import { DistinctQuestion } from 'inquirer';

export function buildBreakingChange(rules: Rules, questions: DistinctQuestion[]): DistinctQuestion[] {
  const breakingQuestions: DistinctQuestion[] = [
    {
      type: 'confirm',
      name: 'isBreaking',
      message: 'Are there any breaking changes?',
      default: false
    },
    {
      type: 'input',
      name: 'breakingBody',
      message: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself: ',
      when: answers => answers.isBreaking && !answers.body
    }
  ];

  return [...questions, ...breakingQuestions];
}
