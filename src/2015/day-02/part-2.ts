export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.split('x').map(Number))
    .map((value) => value.slice().sort((a, z) => a - z))
    .map(([a, b, c]) => 2 * a + 2 * b + a * b * c)
    .reduce((total, current) => total + current)
}
