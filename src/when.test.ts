import type { RuleConfigTuple } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import { emptyWhen, enumWhen, whenFactory } from './when';

describe('when', () => {
  describe('enumWhen', () => {
    test('should return true if rule undefined', () => {
      const result = enumWhen(undefined);

      expect(result).toBe(true);
    });

    test('should return true if level is disable', () => {
      const result = enumWhen([RuleConfigSeverity.Disabled, 'always', []]);

      expect(result).toBe(true);
    });

    test('should return true if applicable is never', () => {
      const result = enumWhen([RuleConfigSeverity.Error, 'never', []]);

      expect(result).toBe(true);
    });

    test('should return true when array not empty', () => {
      const result = enumWhen([RuleConfigSeverity.Error, 'always', ['foo']]);

      expect(result).toBe(true);
    });

    test('should return false when array empty', () => {
      const result = enumWhen([RuleConfigSeverity.Error, 'always', []]);

      expect(result).toBe(false);
    });
  });

  describe('emptyWhen', () => {
    test('should return true if rule undefined', () => {
      const result = emptyWhen(undefined);

      expect(result).toBe(true);
    });

    test('should return true if level is disable', () => {
      const result = emptyWhen([RuleConfigSeverity.Disabled, 'always']);

      expect(result).toBe(true);
    });

    test('should return true if applicable is never', () => {
      const result = emptyWhen([RuleConfigSeverity.Error, 'never']);

      expect(result).toBe(true);
    });

    test('should return false if applicable is always', () => {
      const result = emptyWhen([RuleConfigSeverity.Error, 'always']);

      expect(result).toBe(false);
    });
  });

  describe('whenFactory', () => {
    const hidePromptEnumRule: RuleConfigTuple<string[]> | undefined = [RuleConfigSeverity.Error, 'always', []];
    const hidePromptEmptyRule: RuleConfigTuple<undefined> | undefined = [RuleConfigSeverity.Error, 'always'];

    test.each<[RuleConfigTuple<string[]> | undefined, RuleConfigTuple<undefined> | undefined, boolean]>([
      [undefined, undefined, true],
      [undefined, hidePromptEmptyRule, false],
      [hidePromptEnumRule, undefined, false],
      [hidePromptEnumRule, hidePromptEmptyRule, false],
    ])('%o, %o', (enumRule, emptyRule, expected) => {
      const result = whenFactory(enumRule, emptyRule)();

      expect(result).toBe(expected);
    });
  });
});
