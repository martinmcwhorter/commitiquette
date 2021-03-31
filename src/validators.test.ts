import { Level } from '@commitlint/load';
import { caseValidator, emptyValidator, maxLengthValidator, minLengthValidator, validate } from './validators';

describe('validators', () => {
  describe('validate', () => {
    test('should be valid if the rule does not exist', () => {
      const result = validate([
        {
          value: 'foo',
          rule: undefined,
          validator: () => false,
          message: () => 'bar',
        },
      ]);

      expect(result).toBe(true);
    });

    test('should be valid if the rule level is warn', () => {
      const result = validate([
        {
          value: 'foo',
          rule: [Level.Warn, 'always', undefined],
          validator: () => false,
          message: () => 'bar',
        },
      ]);

      expect(result).toBe(true);
    });

    test('should be valid if the rule level is disable', () => {
      const result = validate([
        {
          value: 'foo',
          rule: [Level.Disable, 'always', undefined],
          validator: () => false,
          message: () => 'bar',
        },
      ]);

      expect(result).toBe(true);
    });

    test('when applicable always, should return true when valid', () => {
      const result = validate([
        {
          value: 'foo',
          rule: [Level.Error, 'always', undefined],
          validator: () => true,
          message: () => 'bar',
        },
      ]);

      expect(result).toBe(true);
    });

    test('when applicable always, should return error message when invalid', () => {
      const result = validate([
        {
          value: 'foo',
          rule: [Level.Error, 'always', undefined],
          validator: () => false,
          message: () => 'error',
        },
      ]);

      expect(result).toBe('error');
    });

    test('when applicable never, should return error message when valid', () => {
      const result = validate([
        {
          value: 'foo',
          rule: [Level.Error, 'never', undefined],
          validator: () => true,
          message: () => 'error',
        },
      ]);

      expect(result).toBe('error');
    });

    test('when applicable never, should return true when invalid', () => {
      const result = validate([
        {
          value: 'foo',
          rule: [Level.Error, 'never', undefined],
          validator: () => false,
          message: () => 'error',
        },
      ]);

      expect(result).toBe(true);
    });

    test('should pass the ruleValue into the error message for interpolation', () => {
      const result = validate([
        {
          value: 'foo',
          rule: [Level.Error, 'never', 72],
          validator: () => true,
          message: (ruleValue) => `error ${ruleValue}`,
        },
      ]);

      expect(result).toBe('error 72');
    });

    test('should return multiline error message when multiple errors', () => {
      const result = validate([
        {
          value: 'foo',
          rule: [Level.Error, 'always', undefined],
          validator: () => false,
          message: () => 'foo',
        },
        {
          value: 'foo',
          rule: [Level.Error, 'always', undefined],
          validator: () => false,
          message: () => 'bar',
        },
        {
          value: 'foo',
          rule: [Level.Error, 'always', undefined],
          validator: () => false,
          message: () => 'baz',
        },
      ]);

      expect(result).toBe('foo\nbar\nbaz');
    });

    describe('caseValidator', () => {
      test('should return true when multiple cases are passed to caseValidator', () => {
        const result = validate([
          {
            value: 'foo',
            rule: [Level.Error, 'always', ['lower-case', 'camel-case']],
            validator: caseValidator,
            message: () => 'error',
          },
        ]);

        expect(result).toBe(true);
      });

      test('should return error message when multiple cases are passed to caseValidator', () => {
        const result = validate([
          {
            value: 'FOO',
            rule: [Level.Error, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
            validator: caseValidator,
            message: () => 'error',
          },
        ]);

        expect(result).toBe('error');
      });

      test('should return true message when multiple cases are passed to caseValidator', () => {
        const result = validate([
          {
            value: 'foo bar baz buz',
            rule: [Level.Error, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
            validator: caseValidator,
            message: () => 'error',
          },
        ]);

        expect(result).toBe(true);
      });
    });
  });

  describe('maxLengthValidator', () => {
    test('should return error message if max length is exceeded', () => {
      const result = maxLengthValidator(
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        72
      );

      expect(result).toBe(false);
    });

    test('should NOT return error message if max length is not exceeded', () => {
      const result = maxLengthValidator('a', 72);

      expect(result).toBe(true);
    });
  });

  describe('minLengthValidator', () => {
    test('should return error message if min length is not met', () => {
      const result = minLengthValidator('aa', 3);

      expect(result).toBe(false);
    });

    test('should NOT return error message if min length is met', () => {
      const result = minLengthValidator('aaa', 3);

      expect(result).toBe(true);
    });
  });

  describe('emptyValidator', () => {
    test('should be invalid, false, if not empty', () => {
      const result = emptyValidator('foo');

      expect(result).toBe(false);
    });

    test('should valid if empty', () => {
      const result = emptyValidator('');

      expect(result).toBe(true);
    });
  });

  describe('caseValidator', () => {
    test('should be valid if the value matches case', () => {
      const result = caseValidator('foo', 'lower-case');

      expect(result).toBe(true);
    });

    test('should be invalid if the value does not match case', () => {
      const result = caseValidator('FOO', 'lower-case');

      expect(result).toBe(false);
    });

    test('should match all when multiple array is passed', () => {
      const result = caseValidator('foo', ['camel-case', 'lower-case']);

      expect(result).toBe(true);
    });

    test('should be invalid when multiple array is passed', () => {
      const result = caseValidator('foo bar baz buz', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']);

      expect(result).toBe(false);
    });
  });
});
