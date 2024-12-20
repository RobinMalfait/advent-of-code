import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2018-10.txt'), 'utf8')

describe('Part 1', () => {
  it('should produce the correct value for example %#', (input) => {
    expect(
      part1(`
        position=< 9,  1> velocity=< 0,  2>
        position=< 7,  0> velocity=<-1,  0>
        position=< 3, -2> velocity=<-1,  1>
        position=< 6, 10> velocity=<-2, -1>
        position=< 2, -4> velocity=< 2,  2>
        position=<-6, 10> velocity=< 2, -2>
        position=< 1,  8> velocity=< 1, -1>
        position=< 1,  7> velocity=< 1,  0>
        position=<-3, 11> velocity=< 1, -2>
        position=< 7,  6> velocity=<-1, -1>
        position=<-2,  3> velocity=< 1,  0>
        position=<-4,  3> velocity=< 2,  0>
        position=<10, -3> velocity=<-1,  1>
        position=< 5, 11> velocity=< 1, -2>
        position=< 4,  7> velocity=< 0, -1>
        position=< 8, -2> velocity=< 0,  1>
        position=<15,  0> velocity=<-2,  0>
        position=< 1,  6> velocity=< 1,  0>
        position=< 8,  9> velocity=< 0, -1>
        position=< 3,  3> velocity=<-1,  1>
        position=< 0,  5> velocity=< 0, -1>
        position=<-2,  2> velocity=< 2,  0>
        position=< 5, -2> velocity=< 1,  2>
        position=< 1,  4> velocity=< 2,  1>
        position=<-2,  7> velocity=< 2, -2>
        position=< 3,  6> velocity=<-1, -1>
        position=< 5,  0> velocity=< 1,  0>
        position=<-6,  0> velocity=< 2,  0>
        position=< 5,  9> velocity=< 1, -2>
        position=<14,  7> velocity=<-2,  0>
        position=<-3,  6> velocity=< 2, -1>
      `)
    ).toMatchInlineSnapshot(`
      "
      █░░░█░░███
      █░░░█░░░█░
      █░░░█░░░█░
      █████░░░█░
      █░░░█░░░█░
      █░░░█░░░█░
      █░░░█░░░█░
      █░░░█░░███
      "
    `)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`
      "
      ░████░░░░████░░░█░░░░░░░██████░░█░░░░░░░█░░░░█░░░████░░░██████
      █░░░░█░░█░░░░█░░█░░░░░░░░░░░░█░░█░░░░░░░█░░░░█░░█░░░░█░░█░░░░░
      █░░░░░░░█░░░░░░░█░░░░░░░░░░░░█░░█░░░░░░░█░░░░█░░█░░░░░░░█░░░░░
      █░░░░░░░█░░░░░░░█░░░░░░░░░░░█░░░█░░░░░░░█░░░░█░░█░░░░░░░█░░░░░
      █░░░░░░░█░░░░░░░█░░░░░░░░░░█░░░░█░░░░░░░██████░░█░░░░░░░█████░
      █░░███░░█░░███░░█░░░░░░░░░█░░░░░█░░░░░░░█░░░░█░░█░░░░░░░█░░░░░
      █░░░░█░░█░░░░█░░█░░░░░░░░█░░░░░░█░░░░░░░█░░░░█░░█░░░░░░░█░░░░░
      █░░░░█░░█░░░░█░░█░░░░░░░█░░░░░░░█░░░░░░░█░░░░█░░█░░░░░░░█░░░░░
      █░░░██░░█░░░██░░█░░░░░░░█░░░░░░░█░░░░░░░█░░░░█░░█░░░░█░░█░░░░░
      ░███░█░░░███░█░░██████░░██████░░██████░░█░░░░█░░░████░░░██████
      "
    `)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        position=< 9,  1> velocity=< 0,  2>
        position=< 7,  0> velocity=<-1,  0>
        position=< 3, -2> velocity=<-1,  1>
        position=< 6, 10> velocity=<-2, -1>
        position=< 2, -4> velocity=< 2,  2>
        position=<-6, 10> velocity=< 2, -2>
        position=< 1,  8> velocity=< 1, -1>
        position=< 1,  7> velocity=< 1,  0>
        position=<-3, 11> velocity=< 1, -2>
        position=< 7,  6> velocity=<-1, -1>
        position=<-2,  3> velocity=< 1,  0>
        position=<-4,  3> velocity=< 2,  0>
        position=<10, -3> velocity=<-1,  1>
        position=< 5, 11> velocity=< 1, -2>
        position=< 4,  7> velocity=< 0, -1>
        position=< 8, -2> velocity=< 0,  1>
        position=<15,  0> velocity=<-2,  0>
        position=< 1,  6> velocity=< 1,  0>
        position=< 8,  9> velocity=< 0, -1>
        position=< 3,  3> velocity=<-1,  1>
        position=< 0,  5> velocity=< 0, -1>
        position=<-2,  2> velocity=< 2,  0>
        position=< 5, -2> velocity=< 1,  2>
        position=< 1,  4> velocity=< 2,  1>
        position=<-2,  7> velocity=< 2, -2>
        position=< 3,  6> velocity=<-1, -1>
        position=< 5,  0> velocity=< 1,  0>
        position=<-6,  0> velocity=< 2,  0>
        position=< 5,  9> velocity=< 1, -2>
        position=<14,  7> velocity=<-2,  0>
        position=<-3,  6> velocity=< 2, -1>

      `,
      3,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('10144')
  })
})
