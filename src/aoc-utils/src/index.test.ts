import { describe, expect, it } from 'vitest'
import { factorial, gcd, lcm } from '.'

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
