import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2015-07.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        123 -> x
        456 -> y
        x AND y -> d
        x OR y -> e
        x LSHIFT 2 -> f
        y RSHIFT 2 -> g
        NOT x -> h
        NOT y -> i
      `,
      null,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`46065`)
  })
})

describe('Part 2', () => {
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`14134`)
  })
})
