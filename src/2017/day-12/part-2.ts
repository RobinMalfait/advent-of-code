export default function (blob: string) {
  let groups = new Map(
    blob
      .trim()
      .split('\n')
      .map((line) => parse(line.trim()))
  )

  let count = 0
  while (groups.size > 0) {
    let seen = new Set<number>()
    let first = Array.from(groups.keys())[0]

    let q = [first]
    while (q.length > 0) {
      let current = q.shift()
      if (seen.has(current)) continue
      seen.add(current)

      for (let connection of groups.get(current)) {
        q.push(connection)
      }
    }

    for (let id of seen) {
      groups.delete(id)
    }

    count++
  }

  return count
}

function parse(input: string): [number, Set<number>] {
  let [id, connections] = input.split(' <-> ')
  return [Number(id), new Set(connections.split(', ').map(Number))]
}
