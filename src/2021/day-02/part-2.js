export default function (blob) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((value) => {
      let [dir, amount] = value.trim().split(' ')
      return [dir, Number(amount)]
    })

  let position = { x: 0, depth: 0, aim: 0 }

  for (let [dir, amount] of instructions) {
    switch (dir) {
      case 'forward': {
        position.x += amount
        position.depth += position.aim * amount
        break
      }
      case 'down': {
        position.aim += amount
        break
      }
      case 'up': {
        position.aim -= amount
        break
      }
    }
  }

  return position.x * position.depth
}
