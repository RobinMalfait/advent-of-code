export default function (blob) {
  let tiles = blob
    .trim()
    .split('\n')
    .map((line) => line.split(/(e|se|sw|w|nw|ne)/).filter(Boolean))

  let blackTiles = new Set()

  for (let tile of tiles) {
    let x = 0
    let y = 0
    let z = 0

    for (let step of tile) {
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

    let coord = [x, y, z].join(',')
    if (blackTiles.has(coord)) blackTiles.delete(coord)
    else blackTiles.add(coord)
  }

  return blackTiles.size
}
