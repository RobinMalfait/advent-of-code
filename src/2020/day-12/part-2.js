export default function (blob) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((instruction) => instruction.split(/(\d*)/g))
    .map(([action, value]) => [action, Number(value)])

  let ship = { x: 0, y: 0 }
  let waypoint = { x: 10, y: -1 }
  let sign = { L: -1, R: 1, N: -1, E: 1, S: 1, W: -1 }
  let on = { N: 'y', S: 'y', E: 'x', W: 'x' }

  for (let [action, value] of instructions) {
    if (action === 'F') {
      let dx = waypoint.x - ship.x
      let dy = waypoint.y - ship.y

      ship.x += value * dx
      ship.y += value * dy

      waypoint.x = ship.x + dx
      waypoint.y = ship.y + dy
    } else if ('LR'.includes(action)) {
      for (let i = 0; i < value / 90; i++) {
        let dx = waypoint.x - ship.x
        let dy = waypoint.y - ship.y

        waypoint.x = ship.x + -dy * sign[action]
        waypoint.y = ship.y + dx * sign[action]
      }
    } else {
      waypoint[on[action]] += value * sign[action]
    }
  }

  return Math.abs(ship.x) + Math.abs(ship.y)
}
