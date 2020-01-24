import { Rules } from '@commitlint/load';
import { Question } from 'inquirer';
import { validate, maxLength } from './validators';

export function buildSubject(rules: Rules, questions: Question[]): Question[] {

  const question: Question = {
    message: 'Write a short, imperative tense description of the change:\n',
    name: 'subject',
    type: 'input',
    validate(value: string, answers: {
      type: string;
      scope?: string;
    }) {

      let header = `${answers.type}`;
      if (answers.scope) {
        header += `(${answers.scope})`;
      }
      header += `: ${value}`;

      const messages = validate([
        {
          value,
          rule: rules['subject-max-length'],
          validator: maxLength,
          message: (length) => `Subject cannot be longer than ${length} chars`
        },
        {
          value: header,
          rule: rules['header-max-length'],
          validator: maxLength,
          message: (length) => `Header "${header}" cannot be longer than ${length} chars`
        }
      ]);

      return messages;
    }
  };

  return [...questions, question];
}
