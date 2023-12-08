import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

import { run, bench, group } from 'mitata'

import part1 from './part-1'
import part2 from './part-2'

let data = readFileSync(resolve('..', '..', '..', 'data', '{{YEAR}}-{{DAY}}.txt'), 'utf8')

group({ name: '{{YEAR}} — day {{DAY}}', summary: false }, () => {
  bench('Part 1', () => part1(data))
  bench('Part 2', () => part2(data))
})

run()
