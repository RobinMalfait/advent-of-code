export default function (blob: string, start = 'S', target = 'E') {
  return solve(blob, start, target)
}

function solve(data: string, start: string, target: string): number {
  let grid = data
    .trim()
    .split('\n')
    .map((line) => line.trim().split(''))
  let graph = new Map<string, string[]>()

  let start_point = null
  let possible_targets = []

  for (let [row_idx, row] of grid.entries()) {
    for (let [col_idx, value] of row.entries()) {
      let point = createPoint(col_idx, row_idx)

      if (value === start) {
        start_point = point
      }

      if (value == target) {
        possible_targets.push(point)
      }

      graph.set(point, [])

      for (let [dc, dr] of [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ]) {
        let n_col_idx = col_idx + dc
        let n_row_idx = row_idx + dr

        let n_value = grid[n_row_idx]?.[n_col_idx]
        if (n_value === undefined) continue
        let neighbour = createPoint(n_col_idx, n_row_idx)

        if (
          start.charCodeAt(0) > target.charCodeAt(0)
            ? val(n_value) <= val(value) || val(n_value) - val(value) == 1
            : val(value) <= val(n_value) || val(value) - val(n_value) == 1
        ) {
          graph.set(point, [...(graph.get(point) ?? []), neighbour])
        }
      }
    }
  }

  return bfs(graph, start_point, possible_targets).length - 1
}

function bfs(graph: Map<string, string[]>, start: string, targets: string[]): string[] {
  let parent = new Map()
  let visited = [start]
  let queue = [start]

  while (queue.length > 0) {
    let node = queue.shift()

    if (targets.includes(node)) {
      let path = [node]
      let current = node
      while (parent.has(current)) {
        path.unshift(parent.get(current))
        current = parent.get(current)
      }
      return path
    }

    for (let neighbour of graph.get(node) ?? []) {
      if (!visited.includes(neighbour)) {
        queue.push(neighbour)
        parent.set(neighbour, node)
        visited.push(neighbour)
      }
    }
  }

  return []
}

function val(input: string) {
  return ({ S: 'a', E: 'z' }[input] ?? input).charCodeAt(0)
}

function createPoint(x: number, y: number) {
  return [x, y].join(',')
}
