import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2020-18.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['1 + 2 * 3 + 4 * 5 + 6', 71],
    ['1 + (2 * 3) + (4 * (5 + 6))', 51],
    ['2 * 3 + (4 * 5)', 26],
    ['5 + (8 * 3 + 9 + 3 * 4 * 3)', 437],
    ['5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', 12240],
    ['((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', 13632],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('6811433855019')
  })
})

describe('Part 2', () => {
  it.each([
    ['1 + 2 * 3 + 4 * 5 + 6', 231],
    ['1 + (2 * 3) + (4 * (5 + 6))', 51],
    ['2 * 3 + (4 * 5)', 46],
    ['5 + (8 * 3 + 9 + 3 * 4 * 3)', 1445],
    ['5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', 669060],
    ['((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', 23340],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('129770152447927')
  })
})
