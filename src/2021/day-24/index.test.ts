import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2021-24.txt'), 'utf8')

describe.skip('Part 1', () => {
  it.each([
    [
      `
        inp x
        mul x -1
      `,
      123,
    ],
    // [
    //   `
    //     inp w
    //     add z w
    //     mod z 2
    //     div w 2
    //     add y w
    //     mod y 2
    //     div w 2
    //     add x w
    //     mod x 2
    //     div w 2
    //     mod w 2
    //   `,
    //   'TODO',
    // ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it.skip('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot()
  })
})

describe.skip('Part 2', () => {
  it.each([
    [
      `

      `,
      'TODO',
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it.skip('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot()
  })
})
