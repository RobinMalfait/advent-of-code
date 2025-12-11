import { I } from 'aoc-utils'
import { resolve } from 'node:path'

import part1 from './part-1'
import part2 from './part-2'

async function main() {
  let data = await Bun.file(resolve(__dirname, '../../../data/2025-11.txt')).text()

  // Part 1
  console.log(
    'Part 1:',
    I.span('Part 1', () => part1(data)),
  )

  // Part 2
  console.log(
    'Part 2:',
    I.span('Part 2', () => part2(data)),
  )

  I.report()
}

main()
