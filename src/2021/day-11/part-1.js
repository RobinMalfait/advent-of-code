export default function (blob, steps = 100) {
  let octopussies = blob
    .trim()
    .split('\n')
    .map((x) => x.split('').map(Number))

  let dirs = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ]

  let flashes = 0

  function react(rowIdx, colIdx, seen, initial = true) {
    if (octopussies?.[rowIdx]?.[colIdx] === undefined) return
    if (!initial) octopussies[rowIdx][colIdx]++

    let id = [rowIdx, colIdx].join(',')
    if (seen.has(id)) return

    if (octopussies[rowIdx][colIdx] > 9) {
      flashes++
      seen.add(id)

      for (let [dx, dy] of dirs) {
        react(rowIdx + dy, colIdx + dx, seen, false)
      }
    }
  }

  for (let _ of Array(steps)) {
    let seen = new Set()

    // Increase
    for (let [rowIdx, row] of octopussies.entries()) {
      for (let colIdx of row.keys()) {
        octopussies[rowIdx][colIdx]++
      }
    }

    // Chain reaction
    for (let [rowIdx, row] of octopussies.entries()) {
      for (let colIdx of row.keys()) {
        react(rowIdx, colIdx, seen)
      }
    }

    // Reset flashed
    for (let [rowIdx, row] of octopussies.entries()) {
      for (let [colIdx, octopus] of row.entries()) {
        if (octopus > 9) {
          octopussies[rowIdx][colIdx] = 0
        }
      }
    }
  }

  return flashes
}
