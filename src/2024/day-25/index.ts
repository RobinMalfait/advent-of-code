import { resolve } from 'node:path'

import part1 from './part-1'

async function main() {
  let data = await Bun.file(resolve(__dirname, '../../../data/2024-25.txt')).text()

  // Part 1
  {
    console.time('Part 1')
    let result = part1(data)
    console.log('Result:', result)
    console.timeEnd('Part 1')
  }
}

main()
