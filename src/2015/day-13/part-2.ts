export default function (blob: string) {
  let configuration = blob
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .map(parse)

  let people = new Set<string>(['me'])
  let lookup: Record<string, Record<string, number>> = {}
  for (let { lhs, rhs, amount } of configuration) {
    lookup.me ??= {}
    lookup.me[lhs] = 0
    lookup.me[rhs] = 0
    lookup[lhs] ??= {}
    lookup[lhs].me = 0
    lookup[lhs][rhs] = amount
    people.add(lhs)
    people.add(rhs)
  }

  let results: number[] = []
  for (let arrangement of permutations(Array.from(people))) {
    let sum = 0
    for (let [idx, person] of arrangement.entries()) {
      let lhs = arrangement[(idx + arrangement.length - 1) % arrangement.length]
      sum += lookup[person][lhs]

      let rhs = arrangement[(idx + arrangement.length + 1) % arrangement.length]
      sum += lookup[person][rhs]
    }

    results.push(sum)
  }

  return results.reduce((a, b) => Math.max(a, b))
}

function parse(line: string) {
  let parts = line.slice(0, -1).split(' ')
  let lhs = parts.at(0)
  let operand = parts.at(2)
  let amount = Number(parts.at(3))
  let rhs = parts.at(-1)

  return { amount: operand === 'lose' ? -amount : amount, lhs, rhs }
}

function permutations<T>(input: T[]): T[][] {
  if (input.length === 0) {
    return [[]]
  }

  return input.reduce((rows, value, i) => {
    return rows.concat(
      permutations([...input.slice(0, i), ...input.slice(i + 1)]).map((x) => [value, ...x])
    )
  }, [])
}
