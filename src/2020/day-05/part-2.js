export default function (blob) {
  let list = blob
    .trim()
    .split('\n')
    .map((bp) => Number.parseInt(bp.replace(/[FL]/g, '0').replace(/[BR]/g, '1'), 2))
    .sort((a, z) => a - z)

  for (let idx = 0; idx < list.length - 1; idx++) {
    if (list[idx + 1] - list[idx] !== 1) return list[idx] + 1
  }

  return -1
}
