import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2022-01.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        1000
        2000
        3000

        4000

        5000
        6000

        7000
        8000
        9000

        10000
      `,
      24000,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`64929`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        1000
        2000
        3000

        4000

        5000
        6000

        7000
        8000
        9000

        10000
      `,
      45000,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`193697`)
  })
})
