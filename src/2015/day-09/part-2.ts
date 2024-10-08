export default function (blob: string) {
  let data = blob
    .trim()
    .split('\n')
    .map((line) => {
      let r = line.match(/(?<from>\w+) to (?<to>\w+) = (?<distance>\d+)/)
      return [r.groups.from, r.groups.to, Number(r.groups.distance)] as const
    })

  let cities = new Set<string>()
  let distances = new Map<string, number>()

  for (let [from, to, distance] of data) {
    cities.add(from)
    cities.add(to)
    distances.set(key(from, to), distance)
    distances.set(key(to, from), distance)
  }

  let max = Number.NEGATIVE_INFINITY
  for (let path of permutations(Array.from(cities))) {
    let distance = 0

    for (let [a, b] of windows(2, path)) {
      distance += distances.get(key(a, b))
    }

    max = Math.max(max, distance)
  }

  return max
}

function key(from: string, to: string) {
  return `${from}->${to}`
}

function permutations<T>(input: T[]): T[][] {
  if (input.length === 0) {
    return [[]]
  }

  return input.reduce(
    (rows, value, i) =>
      rows.concat(
        permutations([...input.slice(0, i), ...input.slice(i + 1)]).map((x) => [value, ...x])
      ),
    []
  )
}

function* windows<T>(n: number, arr: T[]) {
  for (let i = 0; i <= arr.length - n; i++) {
    yield arr.slice(i, i + n)
  }
}
