import part1 from './part-1'

export default function (blob, preamble = 25) {
  let numbers = blob.trim().split('\n').map(Number)
  let invalid = part1(numbers, preamble)

  // return original(numbers, invalid)

  let low = 0
  let high = 1
  let sum = numbers[low] + numbers[high]

  while (sum !== invalid) {
    if (sum < invalid) {
      sum += numbers[++high]
    } else {
      sum -= numbers[low++]
    }
  }

  let options = numbers.slice(low, high + 1)
  return Math.min(...options) + Math.max(...options)
}

/**
 * This was my first solution, while this works perfectly, it is too slow. It's
 * only ~200ms but I have a benchmark script that executes each puzzle 10
 * (warmup) + 100 (runs) times, so this averages to ~220 seconds for this
 * part alone...
 */
function original(numbers, invalid) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 2; j < numbers.length; j++) {
      let options = numbers.slice(i, j)
      let sum = options.reduce((total, current) => total + current, 0)

      if (sum > invalid) continue
      if (sum === invalid) return Math.min(...options) + Math.max(...options)
    }
  }

  return -1
}
