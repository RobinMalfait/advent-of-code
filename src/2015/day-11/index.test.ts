import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2015-11.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['abcdefgh', 'abcdffaa'],
    ['ghijklmn', 'ghjaabcc'],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`"cqjxxyzz"`)
  })
})

describe('Part 2', () => {
  it('should produce the correct value for the input data', async () => {
    expect(part2('cqjxxyzz')).toMatchInlineSnapshot(`"cqkaabcc"`)
  })
})
