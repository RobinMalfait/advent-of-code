import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2024-17.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        Register A: 729
        Register B: 0
        Register C: 0

        Program: 0,1,5,4,3,0
      `,
      '4,6,3,5,6,3,5,2,1,0',
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"7,3,5,7,5,7,4,3,0"`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        Register A: 2024
        Register B: 0
        Register C: 0

        Program: 0,3,5,4,3,0
      `,
      117440,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"105734774294938"`)
  })
})
