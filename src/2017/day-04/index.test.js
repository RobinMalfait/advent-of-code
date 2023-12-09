import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2017-04.txt'), 'utf8')

describe('Part 1', () => {
  // Part 1
  it.each([
    ['aa bb cc dd ee', 1],
    ['aa bb cc dd aa', 0],
    ['aa bb cc dd aaa', 1],
  ])('%s should result in "%s"', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`386`)
  })
})

describe('Part 2', () => {
  // Part 2
  it.each([
    ['abcde fghij', 1],
    ['abcde xyz ecdab', 0],
    ['a ab abc abd abf abj', 1],
    ['iiii oiii ooii oooi oooo', 1],
    ['oiii ioii iioi iiio', 0],
  ])('%s should result in "%s"', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`208`)
  })
})
