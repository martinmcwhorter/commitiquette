import commitlintLoad from '@commitlint/load';
import { PromptModule, prompt } from 'inquirer';
import { Commit } from 'commitizen';
import { engine } from './engine';

export async function prompter(cz: { prompt: PromptModule }, commit: Commit) {
  const clConfig = await commitlintLoad();
  engine(clConfig, cz.prompt, commit);
}

/**
 * Hacking
 *
 * Uncomment the following line for simplified local development without commitizen.
 */
// prompter({ prompt }, value => console.log(value));
