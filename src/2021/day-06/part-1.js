export default function (blob, days = 80) {
  let lanternfish = blob.trim().split(',').map(Number)
  let buckets = Array(9).fill(0)

  for (let fish of lanternfish) {
    buckets[fish]++
  }

  for (let _ of Array(days)) {
    // Rotate left
    buckets.push(buckets.shift())

    // Update
    buckets[6] += buckets[8]
  }

  return buckets.reduce((total, current) => total + current, 0)
}
