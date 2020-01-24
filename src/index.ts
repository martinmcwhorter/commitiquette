import commitlintLoad from '@commitlint/load';
import { engine } from './engine';
import { Prompt, Commit } from 'inquirer';

export async function prompter(cz: { prompt: Prompt }, commit: Commit) {
  const clConfig = await commitlintLoad();
  engine(clConfig, cz.prompt, commit);
}
