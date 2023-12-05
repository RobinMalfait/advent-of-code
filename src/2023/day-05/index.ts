import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

import part1 from './part-1'
import part2 from './part-2'

async function main() {
  let data = await readFile(resolve('../../..', 'data', '2023-05.txt'), 'utf8')

  // Part 1
  {
    console.time('Part 1')
    let result = part1(data)
    console.log('Result:', result)
    console.timeEnd('Part 1')
  }

  // Part 2
  {
    console.time('Part 2')
    let result = part2(data)
    console.log('Result:', result)
    console.timeEnd('Part 2')
  }
}

main()
