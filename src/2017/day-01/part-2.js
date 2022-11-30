export default function (blob) {
  return blob
    .trim()
    .split('')
    .map(Number)
    .filter((item, idx, all) => item === all[(idx + all.length / 2) % all.length])
    .reduce((total, current) => total + current, 0)
}
