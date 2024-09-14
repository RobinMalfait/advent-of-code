import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2021-16.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['D2FE28', 6],
    ['38006F45291200', 9],
    ['EE00D40C823060', 14],
    ['8A004A801A8002F478', 16],
    ['620080001611562C8802118E34', 12],
    ['C0015000016115A2E0802F182340', 23],
    ['A0016C880162017C3686B18A3D4780', 31],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('971')
  })
})

describe('Part 2', () => {
  it.each([
    ['C200B40A82', 3],
    ['880086C3E88112', 7],
    ['CE00C43D881120', 9],
    ['D8005AC2A8F0', 1],
    ['F600BC2D8F', 0],
    ['9C005AC2F8F0', 0],
    ['9C0141080250320F1802104A08', 1],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('831996589851')
  })
})
