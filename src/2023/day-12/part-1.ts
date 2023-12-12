import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  let records = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let total = 0
  for (let [springs, groups] of records) {
    total += combinations(springs, groups)
  }

  return total
}

function combinations(springs: string, groups: string, idx = 0) {
  // We are done, count it if it's valid
  if (idx === springs.length) {
    return checks.get(groups).test(springs) ? 1 : 0
  }

  if (springs[idx] === '?') {
    return (
      // Try to replace the `?` with `#`
      combinations(`${springs.slice(0, idx)}#${springs.slice(idx + 1)}`, groups, idx + 1) +
      // Try to replace the `?` with `.`
      combinations(`${springs.slice(0, idx)}.${springs.slice(idx + 1)}`, groups, idx + 1)
    )
  }

  // 🎶 Don't stop me now 🎶
  return combinations(springs, groups, idx + 1)
}

// I built a regex to check if a group is valid. I am sorry.
let checks = new DefaultMap((group) => {
  return new RegExp(
    `^(\\.*${group
      .split(',')
      .map((p) => `[#]{${p}}`)
      .join('[.]+')}\\.*)$`
  )
})

function parse(input: string) {
  return input.split(' ')
}
