import { buildScope } from './build-scope';

describe('buildScope', () => {

  describe('when', () => {

    test('should not prompt when empty array []', () => {

      const scopeConfig = buildScope({'scope-enum': [2, 'always', []]}, [])[0];

      if (scopeConfig.when) {
        const result = scopeConfig.when<any>({});
        expect(result).toBeFalsy();
      }
    })

    test('should not prompt when scope-empty', () => {

      const scopeConfig = buildScope({'scope-empty': [2, 'always', undefined]}, [])[0];

      if (scopeConfig.when) {
        const result = scopeConfig.when(null);
        expect(result).toBeFalsy();
      }
    })

    test('should prompt by default', () => {

      const scopeConfig = buildScope({}, [])[0];


      if (scopeConfig.when) {
        const result = scopeConfig.when(null);
        expect(result).toBeTruthy();
      }

    })
  })

  describe('choices', () => {

    test('should display choices if array scope enum is present', () => {

      const scopeConfig = buildScope({'scope-enum': [2, 'always', ['foo', 'bar']]}, [])[0];

      if (scopeConfig.choices) {
        expect(scopeConfig.choices).toEqual(['foo', 'bar']);
      }

    })
  })
})
