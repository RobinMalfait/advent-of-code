export default function (blob) {
  return blob
    .trim()
    .split('\n')
    .map((x) => Number(x.trim()))
    .map((x, i, all) => (i === 0 ? 0 : x > all[i - 1] ? 1 : 0))
    .reduce((a, b) => a + b, 0)
}
