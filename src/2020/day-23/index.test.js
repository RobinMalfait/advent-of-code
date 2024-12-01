import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1, { splitAtValue } from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2020-23.txt'), 'utf8')

describe('splitAtValue', () => {
  it.each([
    [
      [1, 3, 8, 9, 2, 5, 4, 6, 7],
      [3, 8, 9, 2, 5, 4, 6, 7],
    ],
    [
      [3, 8, 1, 9, 2, 5, 4, 6, 7],
      [9, 2, 5, 4, 6, 7, 3, 8],
    ],
    [
      [3, 8, 9, 2, 5, 4, 6, 7, 1],
      [3, 8, 9, 2, 5, 4, 6, 7],
    ],
  ])('should be possible to rotate an array', (input, output) => {
    expect(splitAtValue(input, 1)).toEqual(output)
  })
})

describe('Part 1', () => {
  it.each([
    ['389125467', 92658374, 10],
    ['389125467', 67384529, 100],
  ])('should produce the correct value for example %#', (input, expected, rounds) => {
    expect(part1(input, rounds)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('74698532')
  })
})

describe('Part 2', () => {
  it.each([['389125467', 934001 * 159792]])(
    'should produce the correct value for example %#',
    (input, expected) => {
      expect(part2(input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('286194102744')
  })
})
