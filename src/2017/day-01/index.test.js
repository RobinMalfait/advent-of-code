import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2017-01.txt'), 'utf8')

describe('Part 1', () => {
  // Part 1
  it.each([
    ['1122', 3],
    ['1111', 4],
    ['1234', 0],
    ['91212129', 9],
  ])('%s should result in "%s"', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('1047')
  })
})

describe('Part 2', () => {
  // Part 2
  it.each([
    ['1212', 6],
    ['1221', 0],
    ['123425', 4],
    ['123123', 12],
    ['12131415', 4],
  ])('%s should result in "%s"', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('982')
  })
})
