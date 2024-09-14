import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2017-05.txt'), 'utf8')

describe('Part 1', () => {
  // Part 1
  it.each([[[0, 3, 0, 1, -3].join('\n'), 5]])('%s should result in "%s"', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('336905')
  })
})

describe('Part 2', () => {
  // Part 2
  it.each([[[0, 3, 0, 1, -3].join('\n'), 10]])('%s should result in "%s"', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('21985262')
  })
})
