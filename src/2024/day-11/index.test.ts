import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2024-11.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['125 17', 6, 22],
    ['125 17', 25, 55312],
  ])('should produce the correct value for example %#', (input, blinks, expected) => {
    expect(part1(input, blinks)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"218079"`)
  })
})

describe('Part 2', () => {
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"259755538429618"`)
  })
})
