import { I } from 'aoc-utils'
import { resolve } from 'node:path'

import part1 from './part-1'

async function main() {
  let data = await Bun.file(resolve(__dirname, '../../../data/2025-12.txt')).text()

  // Part 1
  console.log(
    'Part 1:',
    I.span('Part 1', () => part1(data)),
  )

  I.report()
}

main()
