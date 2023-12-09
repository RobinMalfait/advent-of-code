import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-03.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      [
        '..##.......',
        '#...#...#..',
        '.#....#..#.',
        '..#.#...#.#',
        '.#...##..#.',
        '..#.##.....',
        '.#.#.#....#',
        '.#........#',
        '#.##...#...',
        '#...##....#',
        '.#..#...#.#',
      ].join('\n'),
      [3, 1],
      7,
    ],
  ])('should produce the correct value for example %#', (map, slope, expected) => {
    expect(part1(map, slope)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data, [3, 1])).toMatchInlineSnapshot(`292`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      [
        '..##.......',
        '#...#...#..',
        '.#....#..#.',
        '..#.#...#.#',
        '.#...##..#.',
        '..#.##.....',
        '.#.#.#....#',
        '.#........#',
        '#.##...#...',
        '#...##....#',
        '.#..#...#.#',
      ].join('\n'),
      [
        [1, 1],
        [3, 1],
        [5, 1],
        [7, 1],
        [1, 2],
      ],
      336,
    ],
  ])('should produce the correct value for example %#', (map, slopes, expected) => {
    expect(part2(map, slopes)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(
      part2(await data, [
        [1, 1],
        [3, 1],
        [5, 1],
        [7, 1],
        [1, 2],
      ])
    ).toMatchInlineSnapshot(`9354744432`)
  })
})
