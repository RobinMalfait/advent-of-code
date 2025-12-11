import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  let map = new Map(
    blob
      .trim()
      .split('\n')
      .map((line) => parse(line.trim())),
  )

  let src = 'you'
  let dst = 'out'

  let count = new DefaultMap((current: string) => {
    if (current === dst) {
      return 1
    }

    let paths = 0
    for (let next of map.get(current)) {
      paths += count.get(next)
    }
    return paths
  })

  return count.get(src)
}

function parse(input: string) {
  let [start, destinations] = input.split(': ')
  return [start, destinations.split(' ')] as const
}
