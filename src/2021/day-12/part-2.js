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

  function countPaths(from, path = [], seen = true) {
    if (from === end) return 1

    let count = 0
    for (let to of graph.get(from)) {
      let _seen = seen
      let _path = path.slice()

      if (to.toLowerCase() === to) {
        if (path.includes(to)) {
          if (_seen && to !== start && to !== end) {
            _seen = false
          } else {
            continue
          }
        } else _path.push(to)
      }

      count += countPaths(to, _path, _seen)
    }

    return count
  }

  return countPaths(start, [start])
}
