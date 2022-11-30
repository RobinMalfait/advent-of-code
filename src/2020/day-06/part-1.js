export default function (blob) {
  return blob
    .split('\n\n')
    .map((group) => new Set(group.replace(/[\n\s]/g, '').split('')).size)
    .reduce((total, current) => total + current, 0)
}
