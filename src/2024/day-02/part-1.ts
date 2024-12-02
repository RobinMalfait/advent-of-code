import { windows } from 'aoc-utils'

export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .filter((level) => isSafeLevel(level)).length
}

enum Trend {
  Unknown = 0,
  Increasing = 1,
  Decreasing = 2,
}

export function isSafeLevel(level: number[]) {
  let trend = Trend.Unknown

  for (let [a, b] of windows(level, 2)) {
    if (a === b) return false

    if (trend === Trend.Increasing && a > b) return false
    if (trend === Trend.Decreasing && a < b) return false

    if (trend === Trend.Unknown && a > b) trend = Trend.Decreasing
    if (trend === Trend.Unknown && a < b) trend = Trend.Increasing

    let diff = Math.abs(a - b)
    if (0 > diff || diff > 3) return false
  }

  return true
}

function parse(input: string) {
  return input.split(/\s+/).map(Number)
}
