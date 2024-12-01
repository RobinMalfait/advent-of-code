import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2015-12.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['[1,2,3]', 6],
    ['{"a":2,"b":4}', 6],
    ['[[[3]]]', 3],
    ['{"a":{"b":4},"c":-1}', 3],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('111754')
  })
})

describe('Part 2', () => {
  it.each([
    ['[1,2,3]', 6],
    ['[1,{"c":"red","b":2},3]', 4],
    ['{"d":"red","e":[1,2,3,4],"f":5}', 0],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('65402')
  })
})
