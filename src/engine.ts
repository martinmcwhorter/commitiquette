import { CommitlintConfig, Rules } from '@commitlint/load';
import { DistinctQuestion, PromptModule } from 'inquirer';
import { Commit } from 'commitizen';
import { pipeWith } from './utils';
import { typeMaker } from './type-maker';
import { buildBreakingChange } from './build-breaking-change';
import { bodyMaker } from './body-maker';
import { scopeMaker } from './scope-maker';
import { subjectMaker } from './subject-maker';

function buildQuestions(rules: Rules) {
  const combinedQuestions = pipeWith<DistinctQuestion[]>(
    [],
    x => typeMaker(x, rules),
    x => scopeMaker(x, rules),
    x => subjectMaker(x, rules),
    x => bodyMaker(x, rules),
    x => buildBreakingChange(rules, x)
  );

  return combinedQuestions;
}

export async function engine(config: CommitlintConfig, prompt: PromptModule, commit: Commit) {
  const questions = buildQuestions(config.rules);
  const answers = await prompt(questions);

  console.log(JSON.stringify(answers));
}
