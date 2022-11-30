export default function (blob, days = 100) {
  let tiles = blob
    .trim()
    .split('\n')
    .map((line) => line.split(/(e|se|sw|w|nw|ne)/).filter(Boolean))
    .map((steps) => move(steps))

  let blackTiles = new Set()
  let dirs = [
    [-1, 1, 0], // w
    [0, 1, -1], // nw
    [1, 0, -1], // ne
    [1, -1, 0], // e
    [0, -1, 1], // se
    [-1, 0, 1], // sw
  ]

  for (let coord of tiles) {
    if (blackTiles.has(coord)) blackTiles.delete(coord)
    else blackTiles.add(coord)
  }

  for (let i = 0; i < days; i++) {
    let next = new Set(blackTiles)
    let todo = new Set()

    for (let coord of blackTiles) {
      todo.add(coord)
      let [x, y, z] = coord.split(',').map(Number)
      for (let [dx, dy, dz] of dirs) todo.add([x + dx, y + dy, z + dz].join(','))
    }

    for (let coord of todo) {
      let blackNeighbourCount = 0
      let [x, y, z] = coord.split(',').map(Number)

      for (let [dx, dy, dz] of dirs) {
        if (blackTiles.has([x + dx, y + dy, z + dz].join(','))) blackNeighbourCount++
      }

      if (blackTiles.has(coord)) {
        if (blackNeighbourCount === 0 || blackNeighbourCount > 2) next.delete(coord)
      } else {
        if (blackNeighbourCount === 2) next.add(coord)
      }
    }

    blackTiles = next
  }

  return blackTiles.size

  function move(steps) {
    let x = 0
    let y = 0
    let z = 0

    for (let step of steps) {
      if (step === 'e') {
        x++
        y--
      } else if (step === 'se') {
        z++
        y--
      } else if (step === 'sw') {
        x--
        z++
      } else if (step === 'w') {
        x--
        y++
      } else if (step === 'nw') {
        z--
        y++
      } else if (step === 'ne') {
        x++
        z--
      }
    }

    return [x, y, z].join(',')
  }
}
