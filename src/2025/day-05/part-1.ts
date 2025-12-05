import { Range } from 'aoc-utils'

export default function (blob: string) {
  let [rawRanges, rawIds] = blob.trim().split('\n\n')

  let ranges = rawRanges.split('\n').map(Range.fromString)
  let ids = rawIds.split('\n').map(Number)

  let fresh = 0
  for (let id of ids) {
    for (let range of ranges) {
      if (range.contains(id)) {
        fresh += 1
        break
      }
    }
  }

  return fresh
}
