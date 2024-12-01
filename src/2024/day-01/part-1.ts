import { sum, transpose } from '../../aoc-utils/src'

export default function (blob: string) {
  let [a, b] = transpose(
    blob
      .trim()
      .split('\n')
      .map((line) => parse(line.trim()))
  )

  a.sort((a, z) => a - z)
  b.sort((a, z) => a - z)

  return sum(a.map((x, i) => Math.abs(x - b[i])))
}

function parse(input: string) {
  return input.split(/\s+/).map(Number)
}
