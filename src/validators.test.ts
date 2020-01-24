import { validate, maxLength } from "./validators"

describe('validators', ()=> {

  test('maxLength', () => {

    const result = validate([
      {
        rule: [2, 'always', 72],
        value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        validator: maxLength,
        message: length => `should be less than ${length}`
      }
    ]);

    expect(result).toBe('should be less than 72');
  });

})
