const part2 = require('./part-2.js')

const { createInterface } = require('readline')
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })

;(async () => {
  for await (const program of rl) {
    console.clear()
    const result = await part2(program)
    console.log('result:', result)
  }
})().catch((err) => console.error(err))
