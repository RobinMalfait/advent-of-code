export default function (blob) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((instruction) => instruction.split(/(\d*)/g))
    .map(([action, value]) => [action, Number(value)])

  let pos = { x: 0, y: 0 }
  let dir = 'E'
  let dirs = 'NESW'
  let sign = { L: -1, R: 1, N: -1, E: 1, S: 1, W: -1 }
  let on = { N: 'y', S: 'y', E: 'x', W: 'x' }

  for (let [action, value] of instructions) {
    if ('LR'.includes(action)) {
      dir = dirs[(dirs.indexOf(dir) + dirs.length + sign[action] * (value / 90)) % dirs.length]
    } else {
      let axis = action === 'F' ? dir : action
      pos[on[axis]] += value * sign[axis]
    }
  }

  return Math.abs(pos.x) + Math.abs(pos.y)
}
