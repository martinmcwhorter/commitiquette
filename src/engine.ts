import { CommitlintConfig, Rules } from '@commitlint/load';
import { pipeWith } from './utils';
import { PromptModule, DistinctQuestion } from 'inquirer';
import { buildType } from './build-type';
import { buildBreakingChange } from './build-breaking-change';
import { buildBody } from './build-body';
import { buildSubject } from './build-subject';
import { buildScope } from './build-scope';
import { Commit } from 'commitizen';

function buildQuestions(rules: Rules) {
  const combinedQuestions = pipeWith<DistinctQuestion[]>(
    [],
    x => buildType(rules, x),
    x => buildScope(rules, x),
    x => buildSubject(rules, x),
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
