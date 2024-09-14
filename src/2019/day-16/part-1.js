// Day 16: Flawed Frequency Transmission

import { range, sum } from '../utils'

export default function fft(input, phases = 1) {
  return range(phases)
    .reduce((previous_value) => {
      const parts = `${previous_value}`.split('').map(Number)

      return range(parts.length)
        .map((index) => {
          const new_base = calculateBase(index + 1)

          return lastDigit(
            sum(parts.map((value, index) => value * new_base[(index + 1) % new_base.length]))
          )
        }, [])
        .join('')
    }, input)
    .slice(0, 8)
}

function lastDigit(value) {
  return value > 0 ? value % 10 : (value % 10) * -1
}

const s = new Map()
function calculateBase(factor = 1) {
  if (s.has(factor)) {
    return s.get(factor)
  }
  const base = [0, 1, 0, -1]
    .map((value) => range(factor).map(() => value))
    .flat(Number.POSITIVE_INFINITY)

  s.set(factor, base)

  return base
}
