import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2022-20.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        1
        2
        -3
        3
        -2
        0
        4
      `,
      3,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toBe(14_526)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        1
        2
        -3
        3
        -2
        0
        4
      `,
      1_623_178_306,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toBe(9_738_258_246_847)
  })
})
