export default function (blob) {
  let numbers = blob
    .trim()
    .split('\n')
    .map((line) => {
      let [a, b] = line.split(' -> ')
      return [...a.split(',').map(Number), ...b.split(',').map(Number)]
    })

  let grid = []

  for (let [x1, y1, x2, y2] of numbers) {
    if (!(x1 === x2 || y1 === y2)) continue

    let dx = Math.sign(x2 - x1)
    let dy = Math.sign(y2 - y1)
    let distance = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))

    for (let i = 0; i <= distance; i++) {
      let y = y1 + i * dy
      let x = x1 + i * dx

      grid[y] ??= []
      grid[y][x] ??= 0
      grid[y][x]++
    }
  }

  return grid.flat(2).filter((x) => x > 1).length
}
