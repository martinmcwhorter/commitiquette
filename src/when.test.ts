import { Level, Rule } from '@commitlint/load';
import { emptyWhen, enumWhen, whenFactory } from './when';

describe('when', () => {
  describe('enumWhen', () => {
    test('should return true if rule undefined', () => {
      const result = enumWhen(undefined);

      expect(result).toBe(true);
    });

    test('should return true if level is disable', () => {
      const result = enumWhen([Level.Disable, 'always', []]);

      expect(result).toBe(true);
    });

    test('should return true if applicable is never', () => {
      const result = enumWhen([Level.Error, 'never', []]);

      expect(result).toBe(true);
    });

    test('should return true when array not empty', () => {
      const result = enumWhen([Level.Error, 'always', ['foo']]);

      expect(result).toBe(true);
    });

    test('should return false when array empty', () => {
      const result = enumWhen([Level.Error, 'always', []]);

      expect(result).toBe(false);
    });
  });

  describe('emptyWhen', () => {
    test('should return true if rule undefined', () => {
      const result = emptyWhen(undefined);

      expect(result).toBe(true);
    });

    test('should return true if level is disable', () => {
      const result = emptyWhen([Level.Disable, 'always', undefined]);

      expect(result).toBe(true);
    });

    test('should return true if applicable is never', () => {
      const result = emptyWhen([Level.Error, 'never', undefined]);

      expect(result).toBe(true);
    });

    test('should return false if applicable is always', () => {
      const result = emptyWhen([Level.Error, 'always', undefined]);

      expect(result).toBe(false);
    });
  });

  describe('whenFactory', () => {
    const hidePromptEnumRule: Rule<string[]> | undefined = [Level.Error, 'always', []];
    const hidePromptEmptyRule: Rule<undefined> | undefined = [Level.Error, 'always', undefined];

    test.each<[Rule<string[]> | undefined, Rule<undefined> | undefined, boolean]>([
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
