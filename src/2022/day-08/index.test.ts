import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2022-08.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `            
        30373
        25512
        65332
        33549
        35390
      `,
      21,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`1688`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `            
        30373
        25512
        65332
        33549
        35390
      `,
      8,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`410400`)
  })
})
