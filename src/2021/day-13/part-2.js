let DOT = '\u2588'
let EMPTY = ' '

export default function (blob) {
  let [points, instructions] = blob.trim().split('\n\n')
  points = points.split('\n').map((point) => point.split(',').map(Number))
  instructions = instructions
    .split('\n')
    .map((instruction) => instruction.split(' ').pop().split('='))
    .map(([axis, pos]) => [axis, Number(pos)])

  let maxX = Math.max(...points.map(([x]) => x)) + 1
  let maxY = Math.max(...points.map(([, y]) => y)) + 1

  let grid = Array.from({ length: maxY })
    .fill(0)
    .map(() => Array.from({ length: maxX }).fill(EMPTY))

  // Build initial grid
  for (let [x, y] of points) {
    grid[y] ??= []
    grid[y][x] = DOT
  }

  // Apply instructions
  for (let [axis, position] of instructions) {
    if (axis === 'x') {
      grid = transpose(grid)
    }

    let top = grid.slice(0, position)
    let bottom = grid.slice(position + 1)

    for (let y = 0; y < bottom.length; y++) {
      for (let x = 0; x < bottom[y].length; x++) {
        let posY = top.length - y - 1

        if (top[posY][x] === EMPTY && bottom[y][x] === DOT) {
          top[posY][x] = DOT
        }
      }
    }

    grid = top
    if (axis === 'x') {
      grid = transpose(grid)
    }
  }

  return `\n${grid.map((line) => line.join('')).join('\n')}\n`
}

function transpose(grid) {
  return grid[0].map((_, i) => grid.map((row) => row[i]))
}
