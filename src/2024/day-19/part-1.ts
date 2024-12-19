import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  let { available, desired } = parse(blob)

  let compute = new DefaultMap((input: string) => {
    for (let part of available) {
      if (input === part) {
        return true
      }

      if (input.startsWith(part)) {
        if (compute.get(input.slice(part.length))) {
          return true
        }
      }
    }

    return false
  })

  let total = 0
  for (let target of desired) {
    total += Number(compute.get(target))
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
