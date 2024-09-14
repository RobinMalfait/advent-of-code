export function solve(grid) {
  let start = grid[0][0]
  let target = grid[grid.length - 1][grid[0].length - 1]

  let path = []
  let parent = new Map()

  let g = new Map(grid.flatMap((row) => row.map((node) => [node, Number.POSITIVE_INFINITY])))
  g.set(start, 0)

  let f = new Map(grid.flatMap((row) => row.map((node) => [node, Number.POSITIVE_INFINITY])))
  f.set(start, g.get(start) + manhatten(start, target))

  // Had this working with a normal array where I looked for the next node with
  // the best score, but that was just a bit too slow. ~4-5s which isn't bad
  // but my benchmark runs 100 times and wanted to improve that ...
  // So as one does... I cheated 🤫
  let open = new BinaryHeap((node) => f.get(node), [start])

  let dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ]

  while (open.size > 0) {
    let current = open.pop()

    if (current === target) {
      let node = current
      while (node !== start) {
        path.unshift(node)
        node = parent.get(node)
      }
      path.unshift(start)
      return path
    }

    for (let [dx, dy] of dirs) {
      let neighbor = grid?.[current.y + dy]?.[current.x + dx]
      if (!neighbor) continue

      let score = g.get(current) + neighbor.cost
      if (score < g.get(neighbor)) {
        parent.set(neighbor, current)
        g.set(neighbor, score)
        f.set(neighbor, score + manhatten(neighbor, target))
        open.push(neighbor)
      }
    }
  }

  // Ugh.
}

function manhatten(lhs, rhs) {
  return Math.abs(lhs.x - rhs.x) + Math.abs(lhs.y - rhs.y)
}

// I cheated and copied this implementation from another project where I played
// with Heaps and Priority Queues and what not. 🤫
class BinaryHeap {
  constructor(scoreFn, data = []) {
    this.data = data
    this.scoreFn = scoreFn
  }

  push(item) {
    this.data.push(item)
    this.sinkDown(this.data.length - 1)
  }

  pop() {
    let result = this.data[0]
    let end = this.data.pop()

    if (this.data.length > 0) {
      this.data[0] = end
      this.bubbleUp(0)
    }

    return result
  }

  get size() {
    return this.data.length
  }

  sinkDown(n) {
    let element = this.data[n]

    while (n > 0) {
      let parentN = ((n + 1) >> 1) - 1
      let parent = this.data[parentN]

      if (this.scoreFn(element) < this.scoreFn(parent)) {
        this.data[parentN] = element
        this.data[n] = parent
        n = parentN
      } else {
        break
      }
    }
  }

  bubbleUp(n) {
    let length = this.data.length
    let element = this.data[n]
    let elemScore = this.scoreFn(element)

    while (true) {
      let child2N = (n + 1) << 1
      let child1N = child2N - 1

      let swap = null
      let child1Score

      if (child1N < length) {
        let child1 = this.data[child1N]
        child1Score = this.scoreFn(child1)

        if (child1Score < elemScore) swap = child1N
      }

      if (child2N < length) {
        let child2 = this.data[child2N]
        let child2Score = this.scoreFn(child2)
        if (child2Score < (swap === null ? elemScore : child1Score)) swap = child2N
      }

      if (swap !== null) {
        this.data[n] = this.data[swap]
        this.data[swap] = element
        n = swap
      } else {
        break
      }
    }
  }
}
