import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(process.cwd(), 'data', '2021-13.txt'), 'utf8')
let test = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`
let test1 = `
3,0
5,1

fold along x=3
`

describe('Part 1', () => {
  it.each([
    [test, 17],
    [test1, 1],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`710`)
  })
})

describe('Part 2', () => {
  it.each([[test]])('should produce the correct value for example %#', (input) => {
    expect(part2(input)).toMatchInlineSnapshot(`
      "
      █████
      █   █
      █   █
      █   █
      █████
           
           
      "
    `)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`
      "
      ████ ███  █     ██  ███  █  █ █    ███  
      █    █  █ █    █  █ █  █ █  █ █    █  █ 
      ███  █  █ █    █    █  █ █  █ █    █  █ 
      █    ███  █    █ ██ ███  █  █ █    ███  
      █    █    █    █  █ █ █  █  █ █    █ █  
      ████ █    ████  ███ █  █  ██  ████ █  █ 
      "
    `)
  })
})
