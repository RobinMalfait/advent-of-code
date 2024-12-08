export default function (blob: string) {
  let groups = new Map(
    blob
      .trim()
      .split('\n')
      .map((line) => parse(line.trim()))
  )

  let seen = new Set()
  let q = Array.from(groups.get(0))
  while (q.length > 0) {
    let current = q.shift()
    if (seen.has(current)) continue
    seen.add(current)

    for (let connection of groups.get(current)) {
      q.push(connection)
    }
  }

  return seen.size
}

function parse(input: string): [number, Set<number>] {
  let [id, connections] = input.split(' <-> ')
  return [Number(id), new Set(connections.split(', ').map(Number))]
}
