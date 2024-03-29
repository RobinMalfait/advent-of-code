import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2019-24.txt'), 'utf8')

describe('Part 1', () => {
  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(await part1(await data)).toMatchSnapshot()
  })
})

describe.skip('Part 2', () => {
  it('should produce the correct value for the input data', async () => {
    const input = ['....#', '#..#.', '#.?##', '..#..', '#....'].join('\n')

    expect(await part2(input, 10)).toEqual(99)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(await part2(await data, 200)).toMatchSnapshot()
  })
})
