export default function (blob) {
  let map = blob
    .trim()
    .split('\n')
    .map((line) => line.split('-'))

  // Build graph
  let graph = new Map()
  for (let [a, b] of map) {
    // A -> B
    if (!graph.has(a)) graph.set(a, [])
    graph.get(a).push(b)

    // B -> A
    if (!graph.has(b)) graph.set(b, [])
    graph.get(b).push(a)
  }

  let start = 'start'
  let end = 'end'

  function countPaths(from, path = []) {
    if (from === end) return 1

    let count = 0
    for (let to of graph.get(from)) {
      let _path = path.slice()

      if (to.toLowerCase() === to && path.includes(to)) continue
      _path.push(to)

      count += countPaths(to, _path)
    }

    return count
  }

  return countPaths(start, [start])
}
