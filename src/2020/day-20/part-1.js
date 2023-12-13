export default function (blob) {
  let tiles = blob
    .trim()
    .split('\n\n')
    .map((tile) => {
      let [name, ...tileData] = tile.split('\n')
      let id = Number(/Tile (?<id>\d+):/.exec(name).groups.id)

      let grid = tileData.map((row) => row.split(''))

      let top = grid[0].join('')
      let right = grid.map((row) => row[row.length - 1]).join('')
      let bottom = grid[grid.length - 1].join('')
      let left = grid.map((row) => row[0]).join('')

      return {
        id,
        neighbours: 0,
        edges: new Set([top, right, bottom, left]),
        flippedEdges: new Set(
          [top, right, bottom, left].map((edge) => edge.split('').reverse().join(''))
        ),
      }
    })

  for (let tile of tiles) {
    for (let other of tiles) {
      if (tile === other) continue

      for (let edge of tile.edges) {
        if (other.edges.has(edge) || other.flippedEdges.has(edge)) {
          tile.neighbours++
        }
      }
    }
  }

  let product = 1
  for (let tile of tiles) {
    // Corners will only match with 2 neighbours, pieces in the middle along
    // the edge will match with 3 neighbours, in the middle of the puzzle,
    // pieces will match with 4 neighbours.
    if (tile.neighbours === 2) product *= tile.id
  }

  return product
}
