export default function (blob) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.split(' | ').map((line) => line.split(' ')))
    .map(([_, output]) => output.filter((x) => [2, 3, 4, 7].includes(x.length)))
    .reduce((total, current) => total + current.length, 0)
}
