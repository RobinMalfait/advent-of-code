export default function (blob) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((value) => {
      let [dir, amount] = value.trim().split(' ')
      return [dir, Number(amount)]
    })

  let position = { x: 0, depth: 0 }

  for (let [dir, amount] of instructions) {
    switch (dir) {
      case 'forward': {
        position.x += amount
        break
      }
      case 'down': {
        position.depth += amount
        break
      }
      case 'up': {
        position.depth -= amount
        break
      }
    }
  }

  return position.x * position.depth
}
