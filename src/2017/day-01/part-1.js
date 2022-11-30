export default function (blob) {
  return blob
    .trim()
    .split('')
    .map(Number)
    .filter((item, idx, all) => item === all[(idx + 1) % all.length])
    .reduce((total, current) => total + current, 0)
}
