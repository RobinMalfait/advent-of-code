import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-25.txt'), 'utf8')

describe('Part 1', () => {
  it.each([[['5764801', '17807724'].join('\n'), 14897079]])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`17673381`)
  })
})
