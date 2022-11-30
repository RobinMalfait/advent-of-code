let OPEN = '.'
let TREE = '#'

export default function (map, [dx, dy] = [3, 1]) {
  let grid = Array.isArray(map) ? map : map.split('\n').map((line) => line.split(''))
  let w = grid[0].length
  let h = grid.length

  let seen = { [OPEN]: 0, [TREE]: 0 }

  let x = 0
  for (let y = 0; y < h; y += dy) {
    seen[grid[y][x]]++

    x = (x + dx) % w
  }

  return seen[TREE]
}
