import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2022-02.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        A Y
        B X
        C Z
      `,
      15,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`10994`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        A Y
        B X
        C Z
      `,
      12,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`12526`)
  })
})
