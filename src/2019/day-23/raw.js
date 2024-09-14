const part2 = require('./part-2.js')

const { createInterface } = require('node:readline')
const rl = createInterface({ input: process.stdin, crlfDelay: Number.POSITIVE_INFINITY })
;(async () => {
  for await (const program of rl) {
    console.clear()
    const result = await part2(program)
    console.log('result:', result)
  }
})().catch((err) => console.error(err))
