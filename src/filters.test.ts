import { RuleConfigSeverity } from '@commitlint/types';
import { fullStopFilter, leadingBlankFilter, maxLineLengthFilter, wordCaseFilter } from './filters';

describe('filters', () => {
  describe('leadingBlankFilter', () => {
    test('preserves leading blank line', () => {
      const result = leadingBlankFilter('\nfoo', [2, 'always']);

      expect(result).toBe('\nfoo');
    });

    test('adds leading blank line', () => {
      const result = leadingBlankFilter('foo', [2, 'always']);

      expect(result).toBe('\nfoo');
    });

    test('removes leading blank line', () => {
      const result = leadingBlankFilter('\nfoo', [2, 'never']);

      expect(result).toBe('foo');
    });

    test('preserves no empty line', () => {
      const result = leadingBlankFilter('foo', [2, 'never']);

      expect(result).toBe('foo');
    });

    test('disable does not change value', () => {
      const result = leadingBlankFilter('foo', [0, 'always']);

      expect(result).toBe('foo');
    });

    test('does not add blank line to empty string', () => {
      const result = leadingBlankFilter('', [2, 'always']);

      expect(result).toBe('');
    });
  });

  describe('fullStopFilter', () => {
    test('removes full stop', () => {
      const result = fullStopFilter('foo.', [2, 'never', '.']);

      expect(result).toBe('foo');
    });

    test('returns original value if no fullstop present', () => {
      const result = fullStopFilter(' foo ', [2, 'never', '.']);

      expect(result).toBe(' foo ');
    });

    test('preserves full stop', () => {
      const result = fullStopFilter('foo.', [2, 'always', '.']);

      expect(result).toBe('foo.');
    });

    test('adds full stop', () => {
      const result = fullStopFilter('foo', [2, 'always', '.']);

      expect(result).toBe('foo.');
    });

    test('disable does not change value', () => {
      const result = fullStopFilter('foo.', [0, 'never', '.']);

      expect(result).toBe('foo.');
    });
  });

  describe('wordCaseFilter', () => {
    test('should change when rule level is not Disable and applicability is not never', () => {
      const result = wordCaseFilter('foo', [RuleConfigSeverity.Error, 'always', 'upper-case']);

      expect(result).toBe('FOO');
    });

    test('should NOT change when rule level is Disable', () => {
      const result = wordCaseFilter('foo', [RuleConfigSeverity.Disabled, 'always', 'upper-case']);

      expect(result).toBe('foo');
    });

    test('should NOT change when rule applicability is not never', () => {
      const result = wordCaseFilter('foo', [RuleConfigSeverity.Error, 'never', 'upper-case']);

      expect(result).toBe('foo');
    });

    test('should return the value unchanged if the rule does not exist', () => {
      const result = wordCaseFilter('FOO_bar', undefined);

      expect(result).toBe('FOO_bar');
    });

    test('should not change when rule is array of cases', () => {
      const result = wordCaseFilter('foo', [RuleConfigSeverity.Error, 'always', ['upper-case', 'lower-case']]);

      expect(result).toBe('foo');
    });
  });

  describe('maxLineLengthFilter', () => {
    test('should change when rule level is not Disable and applicability is not never', () => {
      const result = maxLineLengthFilter('foo bar baz buz', [RuleConfigSeverity.Error, 'always', 4]);

      expect(result).toBe('foo \nbar \nbaz \nbuz');
    });

    test('should NOT change when rule level is Disable', () => {
      const result = maxLineLengthFilter('foo bar baz buz', [RuleConfigSeverity.Disabled, 'always', 4]);

      expect(result).toBe('foo bar baz buz');
    });

    test('should NOT change when rule applicability is not never', () => {
      const result = maxLineLengthFilter('foo bar baz buz', [RuleConfigSeverity.Error, 'never', 4]);

      expect(result).toBe('foo bar baz buz');
    });
  });
});
