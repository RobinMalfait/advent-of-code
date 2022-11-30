const run = require('./part-2.js')

const { createInterface } = require('readline')
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })

;(async () => {
  for await (const program of rl) {
    console.clear()
    const result = await run(program)
    console.log('result:', result)
  }
})().catch((err) => console.error(err))
