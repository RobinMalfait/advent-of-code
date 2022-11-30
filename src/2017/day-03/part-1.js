export default function (blob) {
  let number = Number(blob)
  let x = 0
  let y = 0

  let dir = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1],
  ]

  for (let i = 1; i < number; i++) {
    for (let [dx, dy] of dir) {
      x += dx * i + 1
      y += dy * i + 1
    }
    // console.log(x, y)
  }

  return manhatten(0, 0, x, y)
}

function manhatten(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}
