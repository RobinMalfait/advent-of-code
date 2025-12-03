import { DefaultMap } from 'aoc-utils'

export default function (blob: string, digits = 2) {
  let banks = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let joltage = 0

  for (let bank of banks) {
    let cache = new DefaultMap((idx: number) => {
      return new DefaultMap((used: number) => {
        // Used all the available digits already
        if (used === digits) return 0

        // Bad bank, reached end without using enough digits
        if (idx === bank.length) return -Infinity

        // Try using this digit
        let current = bank[idx] * 10 ** (digits - used - 1)
        let x = current + cache.get(idx + 1).get(used + 1)

        // Try skipping this digit
        let y = cache.get(idx + 1).get(used)

        // Pick the best option
        return Math.max(x, y)
      })
    })

    joltage += cache.get(0).get(0)
  }

  return joltage
}

function parse(input: string) {
  return input.split('').map(Number)
}
