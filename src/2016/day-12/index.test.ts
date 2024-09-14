import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2016-12.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        cpy 41 a
        inc a
        inc a
        dec a
        jnz a 2
        dec a
      `,
      42,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('318083')
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        cpy 41 a
        inc a
        inc a
        dec a
        jnz a 2
        dec a
      `,
      42,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('9227737')
  })
})
