import { CommitlintConfig, Rules } from '@commitlint/load';
import { DistinctQuestion, PromptModule } from 'inquirer';
import { Commit } from 'commitizen';
import { pipeWith } from './utils';
import { typeMaker } from './prompts/type-maker';
import { footerMaker } from './prompts/footer-maker';
import { bodyMaker } from './prompts/body-maker';
import { scopeMaker } from './prompts/scope-maker';
import { subjectMaker } from './prompts/subject-maker';

function buildQuestions(rules: Rules) {
  const combinedQuestions = pipeWith<DistinctQuestion[]>(
    [],
    x => typeMaker(x, rules),
    x => scopeMaker(x, rules),
    x => subjectMaker(x, rules),
    x => bodyMaker(x, rules),
    x => footerMaker(x, rules)
  );

  return combinedQuestions;
}

export async function engine(config: CommitlintConfig, prompt: PromptModule, commit: Commit) {
  const questions = buildQuestions(config.rules);
  const answers = await prompt(questions);

  console.log(JSON.stringify(answers));
}
