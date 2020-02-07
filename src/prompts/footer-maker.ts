import { Rules } from '@commitlint/load';
import { DistinctQuestion } from 'inquirer';
import { leadingBlankFilter } from '../filters';

export function footerMaker(questions: DistinctQuestion[], rules: Rules): DistinctQuestion[] {
  const breakingQuestions: DistinctQuestion[] = [];

  return [...questions, ...breakingQuestions];
}
