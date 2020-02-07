import { ListQuestion } from 'inquirer';
import { scopeMaker } from './scope-maker';

describe('scopeMaker', () => {
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
});
