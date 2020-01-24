import { getLongest, pipeWith } from "./utils"

describe('getLongest', () => {

  test('return longest string lenth in array', () => {

    const result = getLongest(['1', '22'])

    expect(result).toBe(2);
  })

})

describe('pipeWith', () => {

  test('pipes value to function', () => {

    const result = pipeWith('hello ', x => x += 'world');

    expect(result).toBe('hello world');
  })

  test('pipes to many functions', () => {

    const increment = (x: number) => ++x;

    const result = pipeWith(5, increment, increment, increment);

    expect(result).toBe(8);
  })
})
