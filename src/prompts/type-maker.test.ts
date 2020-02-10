import { Level, Rules } from '@commitlint/load';
import { filterFactory, choicesFactory, validatorFactory, typeMaker } from './type-maker';

jest.mock('conventional-commit-types');

describe('type-maker', () => {
  describe('validatorFactory', () => {
    test.each<[Rules, string, string | true]>([
      [{ 'type-empty': [Level.Error, 'never', undefined] }, '', 'Type cannot be empty'],
      [{ 'type-empty': [Level.Error, 'never', undefined] }, 'foo', true],
      [{ 'type-max-length': [Level.Error, 'always', 3] }, 'too long', 'Type maximum length of 3 has been exceeded'],
      [{ 'type-max-length': [Level.Error, 'always', 72] }, 'too long', true],
      [{ 'type-min-length': [Level.Error, 'always', 3] }, 'f', 'Type minimum length of 3 has not been met'],
      [{ 'type-min-length': [Level.Error, 'always', 3] }, 'foo bar baz', true],
      [{ 'type-case': [Level.Error, 'never', 'upper-case'] }, 'FOO_BAR', 'Type must not be in upper-case'],
      [{ 'type-case': [Level.Error, 'never', 'upper-case'] }, 'foo bar', true],
      [{ 'type-case': [Level.Error, 'always', 'upper-case'] }, 'FOO_BAR', true],
      [{ 'type-case': [Level.Error, 'always', 'upper-case'] }, 'foo bar', 'Type must be in upper-case']
    ])(`should validate rule '%o', value '%s', expected '%s'`, (rules, value, expected) => {
      const factory = validatorFactory(rules);

      const result = factory(value);

      expect(result).toBe(expected);
    });
  });

  describe('filterFactory', () => {
    test('should return filter that applies given type-case rule', () => {
      const factory = filterFactory({ 'type-case': [Level.Error, 'always', 'camel-case'] });

      const result = factory('FOO_BAR');

      expect(result).toBe('fooBar');
    });
  });

  describe('choicesFactory', () => {
    describe('should return undefined if type-enum undefined', () => {
      const result = choicesFactory({}, {});

      expect(result).toBeUndefined();
    });

    describe('should return choices if type-enum exits', () => {
      const result = choicesFactory({ 'type-enum': [Level.Error, 'always', ['foo', 'bar', 'baz']] }, {});

      expect(result).toEqual([
        {
          name: 'foo ',
          short: 'foo',
          value: 'foo'
        },
        {
          name: 'bar ',
          short: 'bar',
          value: 'bar'
        },
        {
          name: 'baz ',
          short: 'baz',
          value: 'baz'
        }
      ]);

      describe('should return choices with conventional-conmmit-types descriptions', () => {
        const result = choicesFactory(
          { 'type-enum': [Level.Error, 'always', ['foo', 'bar', 'baz']] },
          {
            foo: { description: 'Fooey', title: '' },
            bar: { description: 'Barey', title: '' },
            baz: { description: 'Bazey', title: '' }
          }
        );

        expect(result).toEqual([
          {
            name: 'foo Fooey',
            short: 'foo',
            value: 'foo'
          },
          {
            name: 'bar Barey',
            short: 'bar',
            value: 'bar'
          },
          {
            name: 'baz Bazey',
            short: 'baz',
            value: 'baz'
          }
        ]);
      });

      describe('should pad the name to match the longest', () => {
        const result = choicesFactory(
          { 'type-enum': [Level.Error, 'always', ['foo', 'bar', 'baz', 'very-long']] },
          {
            foo: { description: 'Fooey', title: '' },
            bar: { description: 'Barey', title: '' },
            baz: { description: 'Bazey', title: '' },
            'very-long': { description: 'Longey', title: '' }
          }
        );

        expect(result).toEqual([
          {
            name: 'foo       Fooey',
            short: 'foo',
            value: 'foo'
          },
          {
            name: 'bar       Barey',
            short: 'bar',
            value: 'bar'
          },
          {
            name: 'baz       Bazey',
            short: 'baz',
            value: 'baz'
          },
          {
            name: 'very-long Longey',
            short: 'very-long',
            value: 'very-long'
          }
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
