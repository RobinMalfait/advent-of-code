import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-02.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['1-3 a: abcde', 1],
    ['1-3 b: cdefg', 0],
    ['2-9 c: ccccccccc', 1],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('517')
  })
})

describe('Part 2', () => {
  it.each([
    ['1-3 a: abcde', 1],
    ['1-3 b: cdefg', 0],
    ['2-9 c: ccccccccc', 0],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('284')
  })
})
