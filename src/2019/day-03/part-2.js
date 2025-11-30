// Day 3: Crossed Wires

import { intersect, match, range } from '../utils'

export default function calculateClosestIntersection(paths_as_string) {
  let paths = paths_as_string.split('\n')

  return calculateClosest(...paths.map((path) => parse(path)))
}

function calculateClosest(...paths) {
  let simplified_paths = paths.map((path) => path.map((point) => point.join(',')))

  let overlaps = intersect(...simplified_paths)
  let [closest] = overlaps
    .map((overlap) =>
      simplified_paths
        .map((path) => path.indexOf(overlap) + 1)
        .reduce((total, current) => total + current, 0),
    )
    .sort((a, b) => Math.sign(a - b))

  return closest
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
