import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2021-12.txt'), 'utf8')
let test1 = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`
let test2 = `
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`
let test3 = `
fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`

describe('Part 1', () => {
  it.each(
    [
      [test1, 10],
      [test2, 19],
      [test3, 226],
    ].slice(0, 1)
  )('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('3495')
  })
})

describe('Part 2', () => {
  it.each([
    [test1, 36],
    [test2, 103],
    [test3, 3509],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('94849')
  })
})
