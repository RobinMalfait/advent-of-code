import run from './part-2'

import { createInterface } from 'node:readline'
const rl = createInterface({ input: process.stdin, crlfDelay: Number.POSITIVE_INFINITY })
;(async () => {
  for await (const program of rl) {
    console.clear()
    const result = await run(program)
    console.log('result:', result)
  }
})().catch((err) => console.error(err))
