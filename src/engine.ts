import type { QualifiedConfig, QualifiedRules } from '@commitlint/types';
import type { PromptModule } from 'inquirer';
import type { Commit } from 'commitizen';
import { pipeWith } from './utils';
import { typeMaker } from './prompts/type-maker';
import { footerMaker } from './prompts/footer-maker';
import { bodyMaker } from './prompts/body-maker';
import { scopeMaker } from './prompts/scope-maker';
import { subjectMaker } from './prompts/subject-maker';
import { Question, commitTemplate } from './commit-template';

function buildQuestions(rules: QualifiedRules) {
  const combinedQuestions = pipeWith<Question[]>(
    [],
    (x) => typeMaker(x, rules),
    (x) => scopeMaker(x, rules),
    (x) => subjectMaker(x, rules),
    (x) => bodyMaker(x, rules),
    (x) => footerMaker(x, rules)
  );

  return combinedQuestions;
}

export async function engine(config: QualifiedConfig, prompt: PromptModule, commit: Commit): Promise<void> {
  const questions = buildQuestions(config.rules);

  const answers = await prompt(questions);

  const message = commitTemplate(answers);

  return commit(message);
}
