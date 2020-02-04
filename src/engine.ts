import { CommitlintConfig, Rules } from '@commitlint/load';
import { DistinctQuestion, PromptModule } from 'inquirer';
import { Commit } from 'commitizen';
import { pipeWith } from './utils';
import { typeMaker } from './type-maker';
import { buildBreakingChange } from './build-breaking-change';
import { buildBody } from './build-body';
import { buildScope } from './build-scope';
import { subjectMaker } from './subject-maker';

function buildQuestions(rules: Rules) {
  const combinedQuestions = pipeWith<DistinctQuestion[]>(
    [],
    x => typeMaker(x, rules),
    x => buildScope(rules, x),
    x => subjectMaker(x, rules),
    x => buildBody(rules, x),
    x => buildBreakingChange(rules, x)
  );

  return combinedQuestions;
}

export async function engine(config: CommitlintConfig, prompt: PromptModule, commit: Commit) {
  const questions = buildQuestions(config.rules);
  const answers = await prompt(questions);

  console.log(JSON.stringify(answers));
}
