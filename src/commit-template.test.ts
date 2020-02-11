import { PromptAnswers, headerTemplate, commitTemplate } from './commit-template';

describe('commit-template', () => {
  describe('headerTemplate', () => {
    test.each<[PromptAnswers, string]>([
      [{ type: 'foo', scope: 'bar', subject: 'baz' }, 'foo(bar): baz'],
      [{ type: 'foo' }, 'foo: '],
      [{ type: 'foo', subject: 'bar' }, 'foo: bar']
    ])(`should convert answers %o to template '%s'`, (answers, expected) => {
      const result = headerTemplate(answers.type, answers.scope, answers.subject);

      expect(result).toBe(expected);
    });
  });

  describe('headerTemplate', () => {
    test.each<[PromptAnswers, string]>([
      [{ type: 'foo', scope: 'bar', subject: 'baz', body: '\nbody', footer: '\nfooter' }, `foo(bar): baz\nbody\nfooter`]
    ])(`should convert answers %o to template '%s'`, (answers, expected) => {
      const result = commitTemplate(answers);

      expect(result).toBe(expected);
    });
  });
});
