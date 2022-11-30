import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(process.cwd(), 'data', '2020-21.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      [
        'mxmxvkd kfcds sqjhc nhms (contains dairy, fish)',
        'trh fvjkl sbzzf mxmxvkd (contains dairy)',
        'sqjhc fvjkl (contains soy)',
        'sqjhc mxmxvkd sbzzf (contains fish)',
      ].join('\n'),
      5,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`2230`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      [
        'mxmxvkd kfcds sqjhc nhms (contains dairy, fish)',
        'trh fvjkl sbzzf mxmxvkd (contains dairy)',
        'sqjhc fvjkl (contains soy)',
        'sqjhc mxmxvkd sbzzf (contains fish)',
      ].join('\n'),
      'mxmxvkd,sqjhc,fvjkl',
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`"qqskn,ccvnlbp,tcm,jnqcd,qjqb,xjqd,xhzr,cjxv"`)
  })
})
