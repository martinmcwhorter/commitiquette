import type { DistinctQuestion } from 'inquirer';

export type Answers = {
  type?: string;
  scope?: string;
  subject?: string;
  body?: string;
  isBreaking?: boolean;
  breaking?: string;
  isIssue?: boolean;
  issue?: string;
};

export type Question = DistinctQuestion<Answers>;

export function headerTemplate(type?: string, scope?: string, subject?: string): string {
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

function renderSection(value: string | undefined): string {
  return value ? `\n${value}` : '';
}

export function commitTemplate(answers: Answers): string {
  let template = headerTemplate(answers.type, answers.scope, answers.subject);

  template += renderSection(answers.body);

  template += renderSection(answers.breaking);

  if (answers.breaking) {
    template += answers.issue ?? '';
  } else {
    template += renderSection(answers.issue);
  }

  return template;
}
