import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2016-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['ADVENT', 6],
    ['A(1x5)BC', 7],
    ['(3x3)XYZ', 9],
    ['A(2x2)BCD(2x2)EFG', 11],
    ['(6x1)(1x3)A', 6],
    ['X(8x2)(3x3)ABCY', 18],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('152851')
  })
})

describe('Part 2', () => {
  it.each([
    ['(3x3)XYZ', 'XYZXYZXYZ'.length],
    ['X(8x2)(3x3)ABCY', 'XABCABCABCABCABCABCY'.length],
    ['(27x12)(20x12)(13x14)(7x10)(1x12)A', 241920],
    ['(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN', 445],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('11797310782')
  })
})
