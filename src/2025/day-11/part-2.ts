import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  let map = new Map(
    blob
      .trim()
      .split('\n')
      .map((line) => parse(line.trim())),
  )

  let src = 'svr'
  let dst = 'out'

  let fft = 0b01
  let dac = 0b10
  let goal = fft | dac

  let count = new DefaultMap((current: string) => {
    return new DefaultMap((requirements: number) => {
      if (current === dst) {
        return requirements === goal ? 1 : 0
      }

      let paths = 0
      for (let next of map.get(current)) {
        let new_requirements = requirements
        if (next === 'fft') new_requirements |= fft
        if (next === 'dac') new_requirements |= dac

        paths += count.get(next).get(new_requirements)
      }

      return paths
    })
  })

  return count.get(src).get(0)
}

function parse(input: string) {
  let [start, destinations] = input.split(': ')
  return [start, destinations.split(' ')] as const
}
