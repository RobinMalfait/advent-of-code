import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2015-16.txt'), 'utf8')

describe('Part 1', () => {
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`"103"`)
  })
})

describe('Part 2', () => {
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`"405"`)
  })
})
