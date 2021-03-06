import type { RuleConfigQuality, RulesConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import { green, red } from 'chalk';
import { validatorFactory, filterFactory, transformerFactory, bodyMaker } from './body-maker';

describe('body-maker', () => {
  describe('validatorFactory', () => {
    test.each<[Partial<RulesConfig<RuleConfigQuality.Qualified>>, string, string | true]>([
      [
        { 'body-max-length': [RuleConfigSeverity.Error, 'always', 3] },
        'too long',
        'Body maximum length of 3 has been exceeded',
      ],
      [{ 'body-max-length': [RuleConfigSeverity.Error, 'always', 72] }, 'too long', true],
      [
        { 'body-min-length': [RuleConfigSeverity.Error, 'always', 3] },
        'f',
        'Body minimum length of 3 has not been met',
      ],
      [{ 'body-min-length': [RuleConfigSeverity.Error, 'always', 3] }, 'foo bar baz', true],
    ])(`should validate rule '%o', value '%s', expected '%s'`, (rules, value, expected) => {
      const factory = validatorFactory(rules);

      const result = factory(value);

      expect(result).toBe(expected);
    });
  });

  describe('filterFactory', () => {
    test.each<[Partial<RulesConfig<RuleConfigQuality.Qualified>>, string, string]>([
      [{ 'body-leading-blank': [RuleConfigSeverity.Error, 'always'] }, 'foo bar', '\nfoo bar'],
      [{ 'body-max-line-length': [RuleConfigSeverity.Error, 'always', 4] }, 'foo bar baz buz', 'foo \nbar \nbaz \nbuz'],
    ])(`should format rule: '%o', value: %s for expected '%s'`, (rules, value, expected) => {
      const factory = filterFactory(rules);

      const result = factory(value);

      expect(result).toBe(expected);
    });

    it('should prepend body with and leading empty line', () => {
      const rules: Partial<RulesConfig<RuleConfigQuality.Qualified>> = {
        'body-leading-blank': [RuleConfigSeverity.Error, 'always'],
        'body-max-line-length': [RuleConfigSeverity.Error, 'never', Infinity],
      };
      const userTypedBody = 'my message should be prepended with an empty new line';

      const result = filterFactory(rules)(userTypedBody);

      expect(result).toBe('\nmy message should be prepended with an empty new line');
    });
  });

  describe('transformerFactory', () => {
    test.each<[Partial<RulesConfig<RuleConfigQuality.Qualified>>, string, string]>([
      [{ 'body-max-length': [RuleConfigSeverity.Error, 'always', 4] }, 'foo', green('(3) foo')],
      [{ 'body-max-length': [RuleConfigSeverity.Error, 'always', 2] }, 'foo', red('(3) foo')],
      [{}, 'foo\\nbar', 'foo\nbar'],
      [{}, 'foo', 'foo'],
    ])(`should transform for rules: '%o', value: '%o' for expected: '%s'`, (rules, value, expected) => {
      const factory = transformerFactory(rules);

      const result = factory(value);

      expect(result).toBe(expected);
    });

    describe('bodyMaker', () => {
      test('should return body input', () => {
        const result = bodyMaker([], {});

        expect(result[0].type).toBe('input');
        expect(result[0].name).toBe('body');
        expect(result[0].message).toBe(
          'Provide a longer description of the change: (press enter to skip, \\n for newline)\n'
        );
      });
    });
  });
});
