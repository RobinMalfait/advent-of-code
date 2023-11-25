import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2018-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['9 players; last marble is worth 25 points', 32],
    ['10 players; last marble is worth 1618 points', 8317],
    ['13 players; last marble is worth 7999 points', 146373],
    ['17 players; last marble is worth 1104 points', 2764],
    ['21 players; last marble is worth 6111 points', 54718],
    ['30 players; last marble is worth 5807 points', 37305],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`402398`)
  })
})

describe('Part 2', () => {
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`3426843186`)
  })
})
