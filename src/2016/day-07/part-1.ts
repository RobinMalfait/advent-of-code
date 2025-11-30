import { windows } from 'aoc-utils'

export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .filter(supportsTLS).length
}

function parse(line: string): [outsides: string[][], insides: string[][]] {
  return line
    .split(/[\[\]]/g)
    .map((x) => x.split(''))
    .reduce(
      (acc, current, i) => {
        acc[i % 2 === 0 ? 0 : 1].push(current)
        return acc
      },
      [[] as string[][], [] as string[][]],
    )
}

function supportsTLS([outsides, insides]: ReturnType<typeof parse>) {
  return hasABBA(outsides) && !hasABBA(insides)
}

function hasABBA<T>(input: T[][]) {
  for (let group of input) {
    for (let [a, b, c, d] of windows(group, 4)) {
      if (a === d && b === c && a !== b) {
        return true
      }
    }
  }

  return false
}
