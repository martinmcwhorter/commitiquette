import type { RuleConfigQuality, RulesConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import { types } from 'conventional-commit-types';

import { filterFactory, choicesFactory, validatorFactory, typeMaker } from './type-maker';

jest.mock('conventional-commit-types');

describe('type-maker', () => {
  describe('validatorFactory', () => {
    test.each<[Partial<RulesConfig<RuleConfigQuality.Qualified>>, string, string | true]>([
      [{ 'type-empty': [RuleConfigSeverity.Error, 'never'] }, '', 'Type cannot be empty'],
      [{ 'type-empty': [RuleConfigSeverity.Error, 'never'] }, 'foo', true],
      [
        { 'type-max-length': [RuleConfigSeverity.Error, 'always', 3] },
        'too long',
        'Type maximum length of 3 has been exceeded',
      ],
      [{ 'type-max-length': [RuleConfigSeverity.Error, 'always', 72] }, 'too long', true],
      [
        { 'type-min-length': [RuleConfigSeverity.Error, 'always', 3] },
        'f',
        'Type minimum length of 3 has not been met',
      ],
      [{ 'type-min-length': [RuleConfigSeverity.Error, 'always', 3] }, 'foo bar baz', true],
      [{ 'type-case': [RuleConfigSeverity.Error, 'never', 'upper-case'] }, 'FOO_BAR', 'Type must not be in upper-case'],
      [{ 'type-case': [RuleConfigSeverity.Error, 'never', 'upper-case'] }, 'foo bar', true],
      [{ 'type-case': [RuleConfigSeverity.Error, 'always', 'upper-case'] }, 'FOO_BAR', true],
      [{ 'type-case': [RuleConfigSeverity.Error, 'always', 'upper-case'] }, 'foo bar', 'Type must be in upper-case'],
    ])(`should validate rule '%o', value '%s', expected '%s'`, (rules, value, expected) => {
      const factory = validatorFactory(rules);

      const result = factory(value);

      expect(result).toBe(expected);
    });
  });

  describe('filterFactory', () => {
    test('should return filter that applies given type-case rule', () => {
      const factory = filterFactory({ 'type-case': [RuleConfigSeverity.Error, 'always', 'camel-case'] });

      const result = factory('FOO_BAR');

      expect(result).toBe('fooBar');
    });
  });

  describe('choicesFactory', () => {
    describe('should return commitTypes as choices if type-enum undefined', () => {
      const result = choicesFactory({}, types);

      expect(result).toEqual([
        {
          name: 'feat: A new feature',
          short: 'feat',
          value: 'feat',
        },
        {
          name: 'fix: A bug fix',
          short: 'fix',
          value: 'fix',
        },
        {
          name: 'docs: Documentation only changes',
          short: 'docs',
          value: 'docs',
        },
        {
          name: 'style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
          short: 'style',
          value: 'style',
        },
        {
          name: 'refactor: A code change that neither fixes a bug nor adds a feature',
          short: 'refactor',
          value: 'refactor',
        },
        {
          name: 'perf: A code change that improves performance',
          short: 'perf',
          value: 'perf',
        },
        {
          name: 'test: Adding missing tests or correcting existing tests',
          short: 'test',
          value: 'test',
        },
        {
          name: 'build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
          short: 'build',
          value: 'build',
        },
        {
          name: 'ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
          short: 'ci',
          value: 'ci',
        },
        {
          name: "chore: Other changes that don't modify src or test files",
          short: 'chore',
          value: 'chore',
        },
        {
          name: 'revert: Reverts a previous commit',
          short: 'revert',
          value: 'revert',
        },
      ]);
    });

    describe('should return choices if type-enum exits', () => {
      const result = choicesFactory({ 'type-enum': [RuleConfigSeverity.Error, 'always', ['foo', 'bar', 'baz']] }, {});

      expect(result).toEqual([
        {
          name: 'foo: ',
          short: 'foo',
          value: 'foo',
        },
        {
          name: 'bar: ',
          short: 'bar',
          value: 'bar',
        },
        {
          name: 'baz: ',
          short: 'baz',
          value: 'baz',
        },
      ]);

      describe('should return choices with conventional-conmmit-types descriptions', () => {
        const result = choicesFactory(
          { 'type-enum': [RuleConfigSeverity.Error, 'always', ['foo', 'bar', 'baz']] },
          {
            foo: { description: 'Fooey', title: '' },
            bar: { description: 'Barey', title: '' },
            baz: { description: 'Bazey', title: '' },
          }
        );

        expect(result).toEqual([
          {
            name: 'foo: Fooey',
            short: 'foo',
            value: 'foo',
          },
          {
            name: 'bar: Barey',
            short: 'bar',
            value: 'bar',
          },
          {
            name: 'baz: Bazey',
            short: 'baz',
            value: 'baz',
          },
        ]);
      });

      describe('should pad the name to match the longest', () => {
        const result = choicesFactory(
          { 'type-enum': [RuleConfigSeverity.Error, 'always', ['foo', 'bar', 'baz', 'very-long']] },
          {
            foo: { description: 'Fooey', title: '' },
            bar: { description: 'Barey', title: '' },
            baz: { description: 'Bazey', title: '' },
            'very-long': { description: 'Longey', title: '' },
          }
        );

        expect(result).toEqual([
          {
            name: 'foo      : Fooey',
            short: 'foo',
            value: 'foo',
          },
          {
            name: 'bar      : Barey',
            short: 'bar',
            value: 'bar',
          },
          {
            name: 'baz      : Bazey',
            short: 'baz',
            value: 'baz',
          },
          {
            name: 'very-long: Longey',
            short: 'very-long',
            value: 'very-long',
          },
        ]);
      });
    });

    describe('typeMaker', () => {
      test('should return ', () => {
        const result = typeMaker([], {});

        expect(result[0].name).toBe('type');
        expect(result[0].message).toBe("Select the type of change you're committing:\n");
        expect(result[0].type).toBe('list');
      });
    });
  });
});
