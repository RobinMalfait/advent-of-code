import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  let { replacements, molecule } = parse(blob)
  let state = new DefaultMap(
    (current) => new DefaultMap((steps: number) => [current, steps] as const)
  )
  let q = new Set([state.get('e').get(1)])

  for (let pair of q) {
    let [current, steps] = pair
    for (let [from, to] of replacements) {
      for (let i = 0; i < current.length; i++) {
        if (current.slice(i, i + from.length) === from) {
          let result = current.slice(0, i) + to + current.slice(i + from.length)

          // Found a match!
          if (result === molecule) {
            return steps
          }

          q.add(state.get(result).get(steps + 1))
        }
      }
    }
  }

  return -1
}

function parse(input: string) {
  let [replacements, molecule] = input.trim().split('\n\n')

  return {
    replacements: replacements.split('\n').map((line) => line.trim().split(' => ')),
    molecule: molecule.trim(),
  }
}
