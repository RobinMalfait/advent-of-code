import { resolve } from 'node:path'

import { bench, run } from 'mitata'

import part1 from './part-1'
import part2 from './part-2'

let data = await Bun.file(resolve(__dirname, '../../../data/2025-04.txt')).text()

bench('Part 1', () => part1(data))
bench('Part 2', () => part2(data))

await run()
