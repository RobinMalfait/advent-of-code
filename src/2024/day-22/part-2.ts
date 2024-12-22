import { DefaultMap, windows } from 'aoc-utils'

export default function (blob: string) {
  let initialSecretNumbers = blob
    .trim()
    .split('\n')
    .map((line) => BigInt(line.trim()))

  let best = Number.NEGATIVE_INFINITY
  let sequences = new DefaultMap((_a: number) => {
    return new DefaultMap((_b: number) => {
      return new DefaultMap((_c: number) => {
        return new DefaultMap((_d: number) => {
          return { value: 0 }
        })
      })
    })
  })

  for (let secret of initialSecretNumbers) {
    let prices: number[] = []
    for (let _ of Array(2000)) {
      let next = compute(secret)
      let price = Number(next % 10n)
      prices.push(price)
      secret = next
    }

    let seen = new Set<{ value: number }>()
    for (let [a, b, c, d, e] of windows(prices, 5)) {
      let sequence = sequences
        .get(b - a)
        .get(c - b)
        .get(d - c)
        .get(e - d)

      if (seen.has(sequence)) continue
      seen.add(sequence)

      sequence.value += e

      if (sequence.value > best) {
        best = sequence.value
      }
    }
  }

  return best
}

function compute(secret: bigint) {
  secret = prune(mix(secret, secret * 64n))
  secret = prune(mix(secret, secret / 32n))
  secret = prune(mix(secret, secret * 2048n))
  return secret
}

function mix(secret: bigint, input: bigint) {
  return secret ^ input
}

function prune(input: bigint) {
  return input % 16_777_216n
}
