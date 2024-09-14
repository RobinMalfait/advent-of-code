// Day 6: Universal Orbit Map

module.exports = function calculateOrbitalTransfers(input, start, target) {
  const graph = new Graph()

  for (let value of input.split('\n')) {
    let [k, v] = value.split(')')

    graph.addVertex(k)
    graph.addVertex(v)

    graph.addEdge(k, v)
  }

  // -2: to exclude start & target
  // -1: because we want the edges, not the nodes
  //     A-B are 2 nodes, but 1 edge
  return graph.path(start, target).length - 2 - 1
}

class Graph {
  constructor() {
    this.vertices = []
    this.edges = {}
  }

  addVertex(vertex) {
    if (this.vertices.includes(vertex)) {
      return
    }

    this.vertices.push(vertex)
    this.edges[vertex] = []
  }

  addEdge(vertexA, vertexB) {
    this.edges[vertexB].push(vertexA)
    this.edges[vertexA].push(vertexB)
  }

  path(start, target) {
    const queue = [start]
    const visited = [start]
    const parent = {}

    while (queue.length) {
      const vertex = queue.shift()

      for (let vertex_from_edge of this.edges[vertex]) {
        if (visited.includes(vertex_from_edge)) {
          continue
        }

        visited.push(vertex_from_edge)
        queue.push(vertex_from_edge)
        parent[vertex_from_edge] = vertex
      }
    }

    if (!visited.includes(target)) {
      return []
    }

    const path = [target]
    let node = parent[target]
    path.push(node)
    while (parent[node] !== undefined) {
      path.push(parent[node])
      node = parent[node]
    }

    return path.reverse()
  }
}
