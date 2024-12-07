// Day 3: Crossed Wires

import { intersect, manhatten, match, range } from '../utils'

export default function calculateClosestIntersection(paths_as_string) {
  let paths = paths_as_string.split('\n')

  return closest(intersection(...paths.map((path) => parse(path))), [0, 0])
}

function intersection(...paths) {
  let simplified_paths = paths.map((path) => path.map((point) => point.join(',')))

  let overlaps = intersect(...simplified_paths)
  return overlaps.map((overlap) => overlap.split(',').map(Number))
}

function closest(list, origin = [0, 0]) {
  let [distance] = list.map((point) => manhatten(point, origin)).sort((a, b) => Math.sign(a - b))
  return distance
}

function parse(path_string) {
  return path_string.split(',').reduce((path, action) => {
    let [, op, _amount] = /(\w)(\d*)/.exec(action)
    let amount = Number(_amount)

    // Find last point from the path
    let [x, y] = path[path.length - 1] || [0, 0]

    // Calculate new points based on the operation
    let points = match(op, {
      U: () => range(amount, 1).map((value) => [x, y - value]),
      R: () => range(amount, 1).map((value) => [x + value, y]),
      D: () => range(amount, 1).map((value) => [x, y + value]),
      L: () => range(amount, 1).map((value) => [x - value, y]),
    })

    return path.concat(points)
  }, [])
}
