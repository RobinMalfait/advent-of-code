export default function (blob) {
  let voltages = blob.trim().split('\n').map(Number)
  voltages.push(0, Math.max(...voltages) + 3)

  return countPaths(voltages.sort((a, z) => a - z))
}

function countPaths(voltages, cache = new Map(), idx = 0) {
  if (idx === voltages.length - 1) return 1
  if (cache.has(idx)) return cache.get(idx)

  let total = 0
  for (let next of voltages.slice(idx + 1)) {
    if (next - voltages[idx] > 3) break
    total += countPaths(voltages, cache, voltages.indexOf(next))
  }

  cache.set(idx, total)

  return total
}
