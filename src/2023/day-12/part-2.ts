import { memoize } from 'aoc-utils'

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

let combinations = memoize((springs: string, groups: number[]) => {
  // No more springs available, it's valid if no more broken groups are left
  if (springs.length === 0) {
    return groups.length === 0 ? 1 : 0
  }

  // No more groups, it's valid if we don't have any more broken springs
  if (groups.length === 0) {
    return springs.includes('#') ? 0 : 1
  }

  let result = 0
  let spring = springs[0]
  let groupSize = groups[0]

  // 1 or more working springs (`.`) should exist before reaching the next group, a `?` can still
  // turn into a `.` so we have to check that as well.
  if (spring === '.' || spring === '?') {
    let remainingSprings = springs.slice(1)
    result += combinations(remainingSprings, groups)
  }

  // If the spring is a `#`, then we have to verify that it is a valid group. If it is a `?` then we
  // have to check both `#` and `.` and validate those cases as well.
  if (spring === '#' || spring === '?') {
    // Enough springs left to fill the group
    let enoughSpringsAvailable = groupSize <= springs.length

    // All springs in the current group must (eventually) be broken. For now they should all be `#`
    // or `?`. If a `.` would be in the current group, it means that we have 2 or more groups not a
    // contiguous group of broken springs.
    let allSpringsInGroupAreBroken = /^[#?]+$/.test(springs.slice(0, groupSize))

    // If there are groups after the current group, it means that the next spring after the current
    // group should be a `.` (or a `?` for now). Otherwise if it was a `#` then this would be one
    // big group and not 2 separate groups.
    let springAfterGroupIsWorking =
      groupSize === springs.length || // This is currently the last group
      /[.?]/.test(springs[groupSize]) // The spring after the current group should be working

    if (enoughSpringsAvailable && allSpringsInGroupAreBroken && springAfterGroupIsWorking) {
      let remainingGroups = groups.slice(1)
      let remainingSprings = springs.slice(groupSize + 1)

      result += combinations(remainingSprings, remainingGroups)
    }
  }

  return result
})

function parse(input: string) {
  let [springs, groups] = input.split(' ')

  // Is this horrible? Yes.
  springs = `${springs}?`.repeat(5).slice(0, -1)
  groups = `${groups},`.repeat(5).slice(0, -1)

  return [springs, groups.split(',').map(Number)] as const
}
