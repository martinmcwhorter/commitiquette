import { Answers, DistinctQuestion } from 'inquirer';

export type PromptAnswers = {
  type?: string;
  scope?: string;
  subject?: string;
  body?: string;
  isBreaking?: boolean;
  isIssue?: boolean;
  footer?: string;
};

export type Question = DistinctQuestion<PromptAnswers>;

export function header(type?: string, scope?: string, subject?: string): string {
  let header = `${type}`;
  if (scope) {
    header += `(${scope})`;
  }

  header += ': ';

  if (subject) {
    header += subject;
  }

  return header;
}

export function commitTemplate(answers: Answers) {
  const head = header(answers.type, answers.scope, answers.subject);

  const template = head + answers.breakingChange ? answers.breakingBody : answers.body;

  return template;
}
