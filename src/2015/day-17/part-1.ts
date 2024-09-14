export default function (blob: string, liters = 150) {
  let buckets = blob
    .trim()
    .split('\n')
    .map((line) => Number(line.trim()))

  let count = 0
  for (let combo of combinations(buckets)) {
    if (combo.reduce((a, b) => a + b, 0) === liters) {
      count += 1
    }
  }
  return count
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
