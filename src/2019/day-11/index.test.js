import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2019-11.txt'), 'utf8')

describe('Part 1', () => {
  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(await part1(await data)).toMatchSnapshot()
  })
})

describe('Part 2', () => {
  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(await part2(await data)).toMatchSnapshot()
  })
})
