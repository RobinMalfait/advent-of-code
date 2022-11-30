export default function (blob, cycles = 6) {
  let grid = blob
    .trim()
    .split('\n')
    .map((line) => line.split(''))
  let cols = grid[0].length

  let line = grid.flat()
  let dirs = [-1, 0, 1]

  let space = new Set([])

  for (let i = 0; i < line.length; i++) {
    if (line[i] !== '#') continue

    let row = (i / cols) | 0
    let col = i % cols

    space.add([col, row, 0].join(','))
  }

  for (let i = 0; i < cycles; i++) {
    let neighbours = {}

    for (let coordinate of space.values()) {
      let [x, y, z] = coordinate.split(',').map(Number)

      for (let dx of dirs) {
        for (let dy of dirs) {
          for (let dz of dirs) {
            if (dx === 0 && dy === 0 && dz === 0) continue

            let pos = [x + dx, y + dy, z + dz]

            neighbours[pos] ??= 0
            neighbours[pos]++
          }
        }
      }
    }

    let next = new Set()
    for (let [coordinate, count] of Object.entries(neighbours)) {
      if (space.has(coordinate)) {
        if (count === 2 || count === 3) {
          next.add(coordinate)
        } else {
          next.delete(coordinate)
        }
      } else {
        if (count === 3) {
          next.add(coordinate)
        }
      }
    }

    space = next
  }

  return space.size
}
