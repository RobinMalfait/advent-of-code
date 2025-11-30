import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2019-18.txt'), 'utf8')

describe.skip('Part 1', () => {
  it.each([
    [
      `
        #########
        #b.A.@.a#
        #########
      `,
      8,
    ],
    [
      `
        #f.D.E.e.C.b.A.@.a.B.c.#
        ########################
        ######################.#
        #d.....................#
        ########################
      `,
      86,
    ],

    [
      `
        ########################
        #...............b.C.D.f#
        #.######################
        #.....@.a.B.c.d.A.e.F.g#
        ########################
      `,
      132,
    ],
    [
      `
        #################
        #i.G..c...e..H.p#
        ########.########
        #j.A..b...f..D.o#
        ########@########
        #k.E..a...g..B.n#
        ########.########
        #l.F..d...h..C.m#
        #################
      `,
      136,
    ],
    [
      `
        ########################
        #@..............ac.GI.b#
        ###d#e#f################
        ###A#B#C################
        ###g#h#i################
        ########################
      `,
      81,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it.skip('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot()
  })
})

describe.skip('Part 2', () => {
  it.skip.each([
    [
      `

      `,
      'TODO',
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it.skip('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot()
  })
})
