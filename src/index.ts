import commitlintLoad from '@commitlint/load';
import { engine } from './engine';
import { PromptModule } from 'inquirer';
import { Commit } from 'commitizen';

export async function prompter(cz: { prompt: PromptModule }, commit: Commit) {
  const clConfig = await commitlintLoad();
  engine(clConfig, cz.prompt, commit);
}
