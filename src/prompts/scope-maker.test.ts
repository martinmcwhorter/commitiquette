import { ListQuestion } from 'inquirer';
import type { RuleConfig, RuleConfigQuality, RulesConfig, TargetCaseType } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import { scopeMaker, filterFactory, validatorFactory, choicesFactory } from './scope-maker';

describe('scopeMaker', () => {
  describe('validatorFactory', () => {
    test.each<[string, Partial<RulesConfig<RuleConfigQuality.Qualified>>, string | true]>([
      ['', { 'scope-empty': [RuleConfigSeverity.Error, 'never'] }, 'Scope cannot be empty'],
      ['foo', { 'scope-empty': [RuleConfigSeverity.Error, 'never'] }, true],
      ['foo', { 'scope-max-length': [RuleConfigSeverity.Error, 'always', 72] }, true],
      [
        'foo bar',
        { 'scope-max-length': [RuleConfigSeverity.Error, 'always', 3] },
        'Scope maximum length of 3 has been exceeded',
      ],
      ['foo', { 'scope-min-length': [RuleConfigSeverity.Error, 'always', 3] }, true],
      [
        'f',
        { 'scope-min-length': [RuleConfigSeverity.Error, 'always', 3] },
        'Scope minimum length of 3 has not been met',
      ],
      ['foo', { 'scope-case': [RuleConfigSeverity.Error, 'always', 'lower-case'] }, true],
      ['foo', { 'scope-case': [RuleConfigSeverity.Error, 'always', 'upper-case'] }, 'Scope must be in upper-case'],
      ['foo', { 'scope-case': [RuleConfigSeverity.Error, 'never', 'lower-case'] }, 'Scope must not be in lower-case'],
      ['foo', { 'scope-case': [RuleConfigSeverity.Error, 'never', 'upper-case'] }, true],
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
      const scopeConfig = scopeMaker([], { 'scope-empty': [2, 'always'] })[0];

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
    it('should display choices if array scope enum is present', () => {
      const scopeConfig = scopeMaker([], { 'scope-enum': [2, 'always', ['foo', 'bar']] })[0] as ListQuestion;

      if (scopeConfig.choices) {
        expect(scopeConfig.choices).toEqual([
          {
            name: 'foo',
            value: 'foo',
          },
          {
            name: 'bar',
            value: 'bar',
          },
          {
            name: ':skip',
            value: '',
          },
        ]);
      }
    });
  });

  describe('choicesFactory', () => {
    it('should not allow non-empty scope when empty scope is required', () => {
      const scopeConfig = choicesFactory({
        'scope-empty': [2, 'always'],
      });

      expect(scopeConfig).toEqual([{ name: ':skip', value: '' }]);
    });

    it('should not allow skipping scope when is required', () => {
      const scopeConfig = choicesFactory({
        'scope-empty': [2, 'never'],
      });

      expect(scopeConfig).not.toContainEqual({ name: ':skip', value: '' });
    });
  });

  it('should allow skipping scope when "scope-empty" severity is "warn"', () => {
    const scopeConfig = choicesFactory({
      'scope-empty': [1, 'always'],
    });

    expect(scopeConfig).toContainEqual({ name: ':skip', value: '' });
  });

  it('should allow skipping scope when "scope-empty" rule is not set', () => {
    const scopeConfig = choicesFactory({});

    expect(scopeConfig).toContainEqual({ name: ':skip', value: '' });
  });

  describe('filterFactory', () => {
    test.each<[RuleConfig<RuleConfigQuality.Qualified, TargetCaseType>, string, string]>([
      [[RuleConfigSeverity.Error, 'always', 'camel-case'], 'FOO_BAR', 'fooBar'],
      [[RuleConfigSeverity.Error, 'never', 'camel-case'], 'FOO_BAR', 'FOO_BAR'],
    ])('should return case filtered string rule: %s, value: %s, expected: %s', (rule, value, expected) => {
      const rules = { 'scope-case': rule };
      const fixture = filterFactory(rules);

      const result = fixture(value);

      expect(result).toBe(expected);
    });
  });
});
