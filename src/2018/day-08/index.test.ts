import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2018-08.txt'), 'utf8')

describe('Part 1', () => {
  it.each([['2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2', 138]])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`37439`)
  })
})

describe('Part 2', () => {
  it.each([['2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2', 66]])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`20815`)
  })
})
