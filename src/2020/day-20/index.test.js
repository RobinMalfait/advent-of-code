import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let sample = promises.readFile(
  resolve(__dirname, '..', '..', '..', 'data', '2020-20.sample.txt'),
  'utf8'
)
let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-20.txt'), 'utf8')

describe('Part 1', () => {
  it.each([[sample, 1951 * 3079 * 2971 * 1171]])(
    'should produce the correct value for example %#',
    async (input, expected) => {
      expect(part1(await input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`104831106565027`)
  })
})

describe('Part 2', () => {
  it.each([[sample, 273]])(
    'should produce the correct value for example %#',
    async (input, expected) => {
      expect(part2(await input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`2093`)
  })
})
