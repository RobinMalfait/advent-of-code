import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2017-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['{}', 1],
    ['{{{}}}', 6],
    ['{{},{}}', 5],
    ['{{{},{},{{}}}}', 16],
    ['{<a>,<a>,<a>,<a>}', 1],
    ['{{<ab>},{<ab>},{<ab>},{<ab>}}', 9],
    ['{{<!!>},{<!!>},{<!!>},{<!!>}}', 9],
    ['{{<a!>},{<a!>},{<a!>},{<ab>}}', 3],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`9662`)
  })
})

describe('Part 2', () => {
  it.each([
    ['<>', 0],
    ['<random characters>', 17],
    ['<<<<>', 3],
    ['<{!>}>', 2],
    ['<!!>', 0],
    ['<!!!>>', 0],
    ['<{o"i!a,<{i<a>', 10],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`4903`)
  })
})
