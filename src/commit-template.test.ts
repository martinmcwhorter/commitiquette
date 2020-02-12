import { Answers, headerTemplate, commitTemplate } from './commit-template';

describe('commit-template', () => {
  describe('headerTemplate', () => {
    test.each<[Answers, string]>([
      [{ type: 'foo', scope: 'bar', subject: 'baz' }, 'foo(bar): baz'],
      [{ type: 'foo' }, 'foo: '],
      [{ type: 'foo', subject: 'bar' }, 'foo: bar']
    ])(`should convert answers %o to template '%s'`, (answers, expected) => {
      const result = headerTemplate(answers.type, answers.scope, answers.subject);

      expect(result).toBe(expected);
    });
  });

  describe('commitTemplate', () => {
    test.each<[Answers, string]>([
      [
        { type: 'foo', scope: 'bar', subject: 'baz', body: '\nbody', breaking: '\nfooter' },
        `foo(bar): baz\n\nbody\n\nfooter`
      ],
      [{ type: 'foo', subject: 'bar' }, 'foo: bar'],
      [{ type: 'foo', subject: 'bar', breaking: '\nbaz', issue: '\nbuz' }, 'foo: bar\n\nbaz\nbuz']
    ])(`should convert answers %o to template '%s'`, (answers, expected) => {
      const result = commitTemplate(answers);

      expect(result).toBe(expected);
    });
  });
});
