export default function (blob) {
  let lookup = blob
    .trim()
    .split('\n')
    .map(Number)
    .sort((a, z) => a - z)
    .reduce((acc, current, idx, all) => {
      if (idx === all.length - 1) return acc
      let diff = all[idx + 1] - current
      acc.set(diff, (acc.get(diff) || 1) + 1)
      return acc
    }, new Map())

  return lookup.get(1) * lookup.get(3)
}
