import { resolve } from 'node:path'

import { bench, run } from 'mitata'

import part1 from './part-1'

let data = await Bun.file(resolve(__dirname, '../../../data/2024-25.txt')).text()

bench('Part 1', () => part1(data))

await run()
