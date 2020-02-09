import { ListQuestion } from 'inquirer';
import { Rule, Case, Level, Rules } from '@commitlint/load';
import { scopeMaker, filterFactory, validatorFactory } from './scope-maker';

describe('scopeMaker', () => {
  describe('validatorFactory', () => {
    test.each<[string, Rules, string | true]>([
      ['', { 'scope-empty': [Level.Error, 'never', undefined] }, 'Scope cannot be empty'],
      ['foo', { 'scope-empty': [Level.Error, 'never', undefined] }, true],
      ['foo', { 'scope-max-length': [Level.Error, 'always', 72] }, true],
      ['foo bar', { 'scope-max-length': [Level.Error, 'always', 3] }, 'Scope maximum length of 3 has been exceeded'],
      ['foo', { 'scope-min-length': [Level.Error, 'always', 3] }, true],
      ['f', { 'scope-min-length': [Level.Error, 'always', 3] }, 'Scope minimum length of 3 has not been met'],
      ['foo', { 'scope-case': [Level.Error, 'always', 'lower-case'] }, true],
      ['foo', { 'scope-case': [Level.Error, 'always', 'upper-case'] }, 'Scope must be in upper-case'],
      ['foo', { 'scope-case': [Level.Error, 'never', 'lower-case'] }, 'Scope must not be in lower-case'],
      ['foo', { 'scope-case': [Level.Error, 'never', 'upper-case'] }, true]
    ])('value: %s, rule: %o, expected: %s', (value, rules, expected) => {
      const fixture = validatorFactory(rules);

      const result = fixture(value);

      expect(result).toBe(expected);
    });
  });

  describe('when', () => {
    test('should not prompt when empty array []', () => {
      const scopeConfig = scopeMaker([], { 'scope-enum': [2, 'always', []] })[0];

      if (typeof scopeConfig.when == 'function') {
        const result = scopeConfig.when({});
        expect(result).toBeFalsy();
      }
    });

    test('should not prompt when scope-empty', () => {
      const scopeConfig = scopeMaker([], { 'scope-empty': [2, 'always', undefined] })[0];

      if (typeof scopeConfig.when == 'function') {
        const result = scopeConfig.when({});
        expect(result).toBe(false);
      }
    });

    test('should prompt by default', () => {
      const scopeConfig = scopeMaker([], {})[0];

      if (typeof scopeConfig.when == 'function') {
        const result = scopeConfig.when({});
        expect(result).toBeTruthy();
      }
    });
  });

  describe('choices', () => {
    test('should display choices if array scope enum is present', () => {
      const scopeConfig = scopeMaker([], { 'scope-enum': [2, 'always', ['foo', 'bar']] })[0] as ListQuestion;

      if (scopeConfig.choices) {
        expect(scopeConfig.choices).toEqual(['foo', 'bar']);
      }
    });
  });

  describe('filterFactory', () => {
    test.each<[Rule<Case>, string, string]>([
      [[Level.Error, 'always', 'camel-case'], 'FOO_BAR', 'fooBar'],
      [[Level.Error, 'never', 'camel-case'], 'FOO_BAR', 'FOO_BAR']
    ])('should return case filtered string rule: %s, value: %s, expected: %s', (rule, value, expected) => {
      const rules = { 'scope-case': rule };
      const fixture = filterFactory(rules);

      const result = fixture(value);

      expect(result).toBe(expected);
    });
  });
});