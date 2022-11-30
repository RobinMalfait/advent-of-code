export default function (blob) {
  let instructions = blob.trim().split('\n').map(Number)
  let idx = 0
  let count = 0
  let total = instructions.length - 1

  while (idx >= 0 && idx <= total) {
    let offset = instructions[idx]
    instructions[idx] += 1
    idx += offset
    count++
  }

  return count
}
