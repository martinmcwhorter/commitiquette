import commitlintLoad from '@commitlint/load';
import { PromptModule } from 'inquirer';
import { Commit } from 'commitizen';
import { engine } from './engine';

export async function prompter(cz: { prompt: PromptModule }, commit: Commit): Promise<void> {
  const clConfig = await commitlintLoad();
  engine(clConfig, cz.prompt, commit);
}

/**
 * Hacking
 *
 * Uncomment the following lines for simplified local development without commitizen.
 */
// import { prompt } from 'inquirer';
// prompter({ prompt }, value => console.log(value));
