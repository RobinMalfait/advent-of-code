import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2018-04.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        [1518-11-01 00:00] Guard #10 begins shift
        [1518-11-01 00:05] falls asleep
        [1518-11-01 00:25] wakes up
        [1518-11-01 00:30] falls asleep
        [1518-11-01 00:55] wakes up
        [1518-11-01 23:58] Guard #99 begins shift
        [1518-11-02 00:40] falls asleep
        [1518-11-02 00:50] wakes up
        [1518-11-03 00:05] Guard #10 begins shift
        [1518-11-03 00:24] falls asleep
        [1518-11-03 00:29] wakes up
        [1518-11-04 00:02] Guard #99 begins shift
        [1518-11-04 00:36] falls asleep
        [1518-11-04 00:46] wakes up
        [1518-11-05 00:03] Guard #99 begins shift
        [1518-11-05 00:45] falls asleep
        [1518-11-05 00:55] wakes up
      `,
      240,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('140932')
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        [1518-11-01 00:00] Guard #10 begins shift
        [1518-11-01 00:05] falls asleep
        [1518-11-01 00:25] wakes up
        [1518-11-01 00:30] falls asleep
        [1518-11-01 00:55] wakes up
        [1518-11-01 23:58] Guard #99 begins shift
        [1518-11-02 00:40] falls asleep
        [1518-11-02 00:50] wakes up
        [1518-11-03 00:05] Guard #10 begins shift
        [1518-11-03 00:24] falls asleep
        [1518-11-03 00:29] wakes up
        [1518-11-04 00:02] Guard #99 begins shift
        [1518-11-04 00:36] falls asleep
        [1518-11-04 00:46] wakes up
        [1518-11-05 00:03] Guard #99 begins shift
        [1518-11-05 00:45] falls asleep
        [1518-11-05 00:55] wakes up
      `,
      4455,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('51232')
  })
})
