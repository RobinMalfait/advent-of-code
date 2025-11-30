export default function (blob: string) {
  return blob
    .trim()
    .split('\n\n')
    .map((block) => block.split('\n').map((x) => JSON.parse(x)))
    .map(([left, right], i) => (compare(left, right) === -1 ? i + 1 : 0))
    .reduce((total, current) => total + current)
}

function compare(lhs: number | number[], rhs: number | number[]): number {
  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    lhs = lhs.slice()
    rhs = rhs.slice()
    while (true) {
      if (lhs.length === 0 && rhs.length > 0) return -1
      if (lhs.length > 0 && rhs.length === 0) return 1
      if (lhs.length === 0 && rhs.length === 0) return 0

      let result = compare(lhs.shift(), rhs.shift())
      if (result !== 0) return result
    }
  }

  if (typeof lhs === 'number' && typeof rhs === 'number') {
    if (lhs < rhs) return -1
    if (lhs > rhs) return 1
    return 0
  }

  return compare(
    [].concat(lhs).filter((x) => x != null),
    [].concat(rhs).filter((x) => x != null),
  )
}
