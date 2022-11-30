import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(process.cwd(), 'data', '2020-07.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      [
        'light red bags contain 1 bright white bag, 2 muted yellow bags.',
        'dark orange bags contain 3 bright white bags, 4 muted yellow bags.',
        'bright white bags contain 1 shiny gold bag.',
        'muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.',
        'shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.',
        'dark olive bags contain 3 faded blue bags, 4 dotted black bags.',
        'vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.',
        'faded blue bags contain no other bags.',
        'dotted black bags contain no other bags.',
      ].join('\n'),
      4,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input, 'shiny gold')).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data, 'shiny gold')).toMatchInlineSnapshot(`177`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      [
        'light red bags contain 1 bright white bag, 2 muted yellow bags.',
        'dark orange bags contain 3 bright white bags, 4 muted yellow bags.',
        'bright white bags contain 1 shiny gold bag.',
        'muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.',
        'shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.',
        'dark olive bags contain 3 faded blue bags, 4 dotted black bags.',
        'vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.',
        'faded blue bags contain no other bags.',
        'dotted black bags contain no other bags.',
      ].join('\n'),
      32,
    ],
    [
      [
        'shiny gold bags contain 2 dark red bags.',
        'dark red bags contain 2 dark orange bags.',
        'dark orange bags contain 2 dark yellow bags.',
        'dark yellow bags contain 2 dark green bags.',
        'dark green bags contain 2 dark blue bags.',
        'dark blue bags contain 2 dark violet bags.',
        'dark violet bags contain no other bags.',
      ].join('\n'),
      126,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input, 'shiny gold')).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data, 'shiny gold')).toMatchInlineSnapshot(`34988`)
  })
})
