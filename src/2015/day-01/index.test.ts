import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2015-01.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['(())', 0],
    ['()()', 0],
    ['(((', 3],
    ['(()(()(', 3],
    ['))(((((', 3],
    ['())', -1],
    ['))(', -1],
    [')))', -3],
    [')())())', -3],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`280`)
  })
})

describe('Part 2', () => {
  it.each([
    [')', 1],
    ['()())', 5],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`1797`)
  })
})
