export default function (blob: string) {
  let list = blob
    .trim()
    .split('\n\n')
    .flatMap((block) => block.split('\n').map((x) => JSON.parse(x)))
    .concat([[[2]]])
    .concat([[[6]]])
    .sort(compare)
    .map(identity)

  return (
    (list.findIndex((x) => x === identity([[2]])) + 1) *
    (list.findIndex((x) => x === identity([[6]])) + 1)
  )
}

function identity(input: unknown) {
  return JSON.stringify(input)
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
