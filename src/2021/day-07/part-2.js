export default function (blob) {
  let positions = blob.trim().split(',').map(Number)
  let from = Math.min(...positions)
  let to = Math.max(...positions)

  let destination = Infinity
  for (let target = from; target <= to; target++) {
    let total = 0
    for (let position of positions) {
      let distance = Math.abs(target - position)
      total += (Math.pow(distance, 2) + distance) / 2
    }
    destination = Math.min(destination, total)
  }

  return destination
}
