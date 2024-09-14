export default function (blob) {
  let positions = blob.trim().split(',').map(Number)
  let from = Math.min(...positions)
  let to = Math.max(...positions)

  let destination = Number.POSITIVE_INFINITY
  for (let target = from; target <= to; target++) {
    let total = 0
    for (let position of positions) {
      total += Math.abs(target - position)
    }
    destination = Math.min(destination, total)
  }

  return destination
}
