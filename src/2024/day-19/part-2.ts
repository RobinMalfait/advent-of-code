import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  let { available, desired } = parse(blob)

  let compute = new DefaultMap((input: string) => {
    let total = 0

    for (let part of available) {
      if (input === part) {
        total += 1
      } else if (input.startsWith(part)) {
        total += compute.get(input.slice(part.length))
      }
    }

    return total
  })

  let total = 0
  for (let target of desired) {
    total += compute.get(target)
  }
  return total
}

function parse(input: string) {
  let [available, desired] = input.trim().split('\n\n')

  return {
    available: available.trim().split(', '),
    desired: desired
      .trim()
      .split('\n')
      .map((x) => x.trim()),
  }
}
