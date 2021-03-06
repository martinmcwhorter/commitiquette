import type { TargetCaseType } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import { green, red } from 'chalk';
import { getLongest, pipeWith, valueFromRule, wordCase, maxLengthTransformerFactory } from './utils';

describe('utils', () => {
  describe('getLongest', () => {
    test('return longest string length in array', () => {
      const result = getLongest(['1', '333', '22']);

      expect(result).toBe(3);
    });
  });

  describe('pipeWith', () => {
    test('pipes value to function', () => {
      const result = pipeWith('hello ', x => (x += 'world'));

      expect(result).toBe('hello world');
    });

    test('pipes to many functions', () => {
      const increment = (x: number) => ++x;

      const result = pipeWith(5, increment, increment, increment);

      expect(result).toBe(8);
    });
  });

  describe('wordCase', () => {
    test.each<[string, TargetCaseType, string]>([
      ['FOO_BAR', 'lower-case', 'foo_bar'],
      ['FOO_BAR', 'lowercase', 'foo_bar'],
      ['FOO_BAR', 'lowerCase', 'foo_bar'],
      ['fooBar', 'snake-case', 'foo_bar'],
      ['fooBar', 'pascal-case', 'FooBar'],
      ['fooBar', 'sentence-case', 'Foo bar'],
      ['fooBar', 'sentencecase', 'Foo bar'],
      ['fooBar', 'start-case', 'Foo Bar'],
      ['fooBar', 'kebab-case', 'foo-bar'],
      ['fooBar', 'upper-case', 'FOOBAR'],
      ['fooBar', 'uppercase', 'FOOBAR'],
      ['foo_Bar', 'camel-case', 'fooBar'],
    ])('wordCase(%s, %s): %s', (value, rule, expected) => {
      const result = wordCase(value, rule);

      expect(result).toBe(expected);
    });

    describe('valueFromRule', () => {
      test('should return false if rule is undefined', () => {
        const result = valueFromRule(undefined);

        expect(result).toBeFalsy();
      });

      test('should return false if disabled', () => {
        const result = valueFromRule([RuleConfigSeverity.Disabled, 'always', 72]);

        expect(result).toBeFalsy();
      });

      test('should return false if applicable never', () => {
        const result = valueFromRule([RuleConfigSeverity.Error, 'never', 72]);

        expect(result).toBeFalsy();
      });

      test('should return value of rule', () => {
        const result = valueFromRule([RuleConfigSeverity.Error, 'always', 72]);

        expect(result).toBe(72);
      });
    });

    describe('maxLengthTransformerFactory', () => {
      test.each<[number | undefined, string, string]>([
        [3, 'foo', green('(3) foo')],
        [3, 'foo bar', red('(7) foo bar')],
        [undefined, 'foo', 'foo'],
      ])('should transform when length: %n to expected: %s', (length, value, expected) => {
        const factory = maxLengthTransformerFactory(length);

        const result = factory(value);

        expect(result).toBe(expected);
      });
    });
  });
});
