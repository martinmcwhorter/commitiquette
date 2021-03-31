import { Rules, Level } from '@commitlint/load';

import { green, red } from 'chalk';
import { Answers } from '../commit-template';
import { validatorFactory, filterFactory, messageFactory, transformerFactory, subjectMaker } from './subject-maker';

describe('subject-maker', () => {
  describe('validatorFactory', () => {
    test.each<[Rules, string, Answers, string | true]>([
      [
        { 'header-max-length': [Level.Error, 'always', 3] },
        'too long',
        { type: 'feat' },
        'Header "feat: too long" cannot be longer than 3',
      ],
      [{ 'header-max-length': [Level.Error, 'always', 72] }, 'too long', { type: 'feat' }, true],
      [{ 'subject-empty': [Level.Error, 'never', undefined] }, '', {}, 'Subject cannot be empty'],
      [{ 'subject-empty': [Level.Error, 'never', undefined] }, 'foo', {}, true],
      [
        { 'subject-max-length': [Level.Error, 'always', 3] },
        'too long',
        {},
        'Subject maximum length of 3 has been exceeded',
      ],
      [{ 'subject-max-length': [Level.Error, 'always', 72] }, 'too long', {}, true],
      [{ 'subject-min-length': [Level.Error, 'always', 3] }, 'f', {}, 'Subject minimum length of 3 has not been met'],
      [{ 'subject-min-length': [Level.Error, 'always', 3] }, 'foo bar baz', {}, true],
      [{ 'subject-case': [Level.Error, 'never', 'upper-case'] }, 'FOO_BAR', {}, 'Subject must not be in upper-case'],
      [{ 'subject-case': [Level.Error, 'never', 'upper-case'] }, 'foo bar', {}, true],
      [{ 'subject-case': [Level.Error, 'always', 'upper-case'] }, 'FOO_BAR', {}, true],
      [{ 'subject-case': [Level.Error, 'always', 'upper-case'] }, 'foo bar', {}, 'Subject must be in upper-case'],
    ])(`should validate rule '%o', value '%s', answers: %o as expected '%s'`, (rules, value, answers, expected) => {
      const factory = validatorFactory(rules);

      const result = factory(value, answers);

      expect(result).toBe(expected);
    });
  });

  describe('fiterFactory', () => {
    test.each<[Rules, string, string]>([
      [{ 'subject-case': [Level.Error, 'always', 'camel-case'] }, 'FOO_BAR', 'fooBar'],
      [{ 'subject-full-stop': [Level.Error, 'never', '.'] }, 'foo bar.', 'foo bar'],
    ])(`should format rule: '%o', value: %s for expected '%s'`, (rules, value, expected) => {
      const factory = filterFactory(rules);

      const result = factory(value);

      expect(result).toBe(expected);
    });
  });

  describe('messageFactory', () => {
    test.each<[Rules, Answers, string]>([
      [
        { 'header-max-length': [Level.Error, 'always', 72] },
        { type: 'feat', scope: 'foo' },
        'Write a short, imperative tense description of the change (max 61 chars):\n',
      ],
      [{}, { type: 'feat', scope: 'foo' }, 'Write a short, imperative tense description of the change:\n'],
    ])(`should return message for rule: '%o', answers: '%o' as expected '%s'`, (rules, answers, expected) => {
      const factory = messageFactory(rules);

      const result = factory(answers);

      expect(result).toBe(expected);
    });
  });

  describe('transformerFactory', () => {
    test.each<[Rules, string, Answers, string]>([
      [{ 'header-max-length': [Level.Error, 'always', 14] }, 'foo', { type: 'feat', scope: 'bar' }, green('(3) foo')],
      [{ 'header-max-length': [Level.Error, 'always', 13] }, 'foo', { type: 'feat', scope: 'bar' }, red('(3) foo')],
      [{ 'subject-max-length': [Level.Error, 'always', 3] }, 'foo', {}, green('(3) foo')],
      [{ 'subject-max-length': [Level.Error, 'always', 2] }, 'foo', {}, red('(3) foo')],
      [{}, 'foo', {}, 'foo'],
    ])(
      `should transform for rules: '%o', value: '%o', answers: '%o' for expected: '%s'`,
      (rules, value, answers, expected) => {
        const factory = transformerFactory(rules);

        const result = factory(value, answers);

        expect(result).toBe(expected);
      }
    );
  });

  describe('subjectMaker', () => {
    test('should add question to questions array', () => {
      const result = subjectMaker([], {});

      expect(result[0].name).toBe('subject');
      expect(result[0].type).toBe('input');
    });
  });
});
