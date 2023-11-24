export default function (blob: string, liters: number = 150) {
  let buckets = blob
    .trim()
    .split('\n')
    .map((line) => Number(line.trim()))

  let byContainersCount = new Map<number, number>()
  let lowestNumber = Infinity
  for (let combo of combinations(buckets)) {
    if (combo.reduce((a, b) => a + b, 0) === liters) {
      lowestNumber = Math.min(lowestNumber, combo.length)
      byContainersCount.set(combo.length, (byContainersCount.get(combo.length) ?? 0) + 1)
    }
  }
  return byContainersCount.get(lowestNumber)
}

function combinations<T>(input: T[]) {
  let result = [[]]
  for (let value of input) {
    let copy = [...result]
    for (let parents of copy) {
      result.push(parents.concat(value))
    }
  }
  return result
}
