import { resolve } from 'node:path'

import { run, bench, group } from 'mitata'

import part1 from './part-1'
import part2 from './part-2'

let data = await Bun.file(resolve(__dirname, '..', '..', '..', 'data', '2023-10.txt')).text()

group({ name: '2023 — day 10', summary: false }, () => {
  bench('Part 1', () => part1(data))
  bench('Part 2', () => part2(data))
})

run()