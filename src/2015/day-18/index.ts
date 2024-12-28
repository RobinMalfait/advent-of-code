import { resolve } from 'node:path'

import part1 from './part-1'
import part2 from './part-2'

async function main() {
  let data = await Bun.file(resolve(__dirname, '../../../data/2015-18.txt')).text()

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
