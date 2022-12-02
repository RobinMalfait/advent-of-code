export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.split('x').map(Number))
    .map(([l, w, h]) => 2 * l * w + 2 * w * h + 2 * h * l + Math.min(l * w, w * h, h * l))
    .reduce((total, current) => total + current)
}
