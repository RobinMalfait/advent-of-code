import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2023-07.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483
      `,
      6440,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`250453939`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483
      `,
      5905,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`248652697`)
  })
})
