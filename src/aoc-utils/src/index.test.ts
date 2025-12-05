import { describe, expect, it } from 'vitest'
import { factorial, gcd, lcm, Range } from '.'

describe('factorial', () => {
  it.each([
    [0, 1],
    [1, 1],
    [2, 2],
    [3, 6],
    [4, 24],
    [5, 120],
    [6, 720],
    [7, 5040],
  ])('should compute the factorial(%d) = %d', (input, expected) => {
    expect(factorial(input)).toEqual(expected)
  })
})

describe('math', () => {
  it.each([
    [1, 1, 1],
    [2, 2, 2],
    [2, 3, 6],
    [3, 4, 12],
    [4, 5, 20],
    [5, 6, 30],
    [6, 7, 42],
    [7, 8, 56],
    [8, 9, 72],
  ])('should compute the lcm(%d, %d) = %d', (a, b, expected) => {
    expect(lcm(a, b)).toEqual(expected)
  })

  it.each([
    [10, 100, 10],
    [10, 1000, 10],
    [10, 10000, 10],
    [10, 100000, 10],
    [100, 1000, 100],
    [100, 10000, 100],
    [100, 100000, 100],
    [1000, 10000, 1000],
    [1000, 100000, 1000],
    [10000, 100000, 10000],
  ])('should compute the gcd(%d, %d) = %d', (a, b, expected) => {
    expect(gcd(a, b)).toEqual(expected)
  })
})

describe('Range', () => {
  describe('Range.mergeOverlapping', () => {
    it.each([
      // […][…]
      [['1-5', '6-10'], ['1-10']],

      // […|…]
      [['1-5', '5-10'], ['1-10']],

      // […][…][…]
      [['1-2', '3-4', '5-10'], ['1-10']],

      // […] […]
      [
        ['1-5', '7-10'],
        ['1-5', '7-10'],
      ],

      // [……………]
      //   […]
      [['1-10', '2-3'], ['1-10']],

      // [……] [……]
      //   [………]
      [['1-3', '2-4', '3-7'], ['1-7']],

      // Out of order
      [['1-10', '15-20', '17-25', '8-16'], ['1-25']],

      [['1-2', '1-3', '1-4', '1-5'], ['1-5']],
    ])('should merge overlapping ranges %s → %s', (ranges, result) => {
      expect(Range.mergeOverlapping(ranges.map(Range.fromString))).toEqual(
        result.map(Range.fromString),
      )
    })
  })
})
