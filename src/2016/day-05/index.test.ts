import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2016-05.txt'), 'utf8')

// Skipped because it takes too long
describe.skip('Part 1', () => {
  it.skip('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`"d4cd2ee1"`)
  })
})

describe.skip('Part 2', () => {
  it.each([['abc', '05ace8e3']])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`"f2c730e5"`)
  })
})
