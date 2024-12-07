import part2 from './part-2'

import { createInterface } from 'node:readline'
const rl = createInterface({ input: process.stdin, crlfDelay: Number.POSITIVE_INFINITY })
;(async () => {
  for await (let program of rl) {
    console.clear()
    let result = await part2(program)
    console.log('result:', result)
  }
})().catch((err) => console.error(err))
