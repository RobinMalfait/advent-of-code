import { DefaultMap, sum, transpose } from 'aoc-utils'

export default function (blob: string) {
  let [a, b] = transpose(
    blob
      .trim()
      .split('\n')
      .map((line) => parse(line.trim())),
  )

  let counts = new DefaultMap<number, number>(() => 0)

  for (let x of b) {
    counts.set(x, counts.get(x) + 1)
  }

  return sum(a.map((x) => x * counts.get(x)))
}

function parse(input: string) {
  return input.split(/\s+/).map(Number)
}
