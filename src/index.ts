import commitlintLoad from '@commitlint/load';
import { PromptModule, prompt } from 'inquirer';
import { Commit } from 'commitizen';
import { engine } from './engine';

export async function prompter(cz: { prompt: PromptModule }, commit: Commit) {
  const clConfig = await commitlintLoad();
  engine(clConfig, cz.prompt, commit);
}

prompter({ prompt }, value => console.log(value));
