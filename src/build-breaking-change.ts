import { Rules } from '@commitlint/load';
import { Question } from 'inquirer';

export function buildBreakingChange(rules: Rules, questions: Question[]): Question[] {

  const breakingQuestions: Question[] = [
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
      when: (answers: {
        isBreaking: boolean;
        body: string;
      }) => answers.isBreaking && !answers.body
    }
  ];

  return [...questions, ...breakingQuestions];
}
