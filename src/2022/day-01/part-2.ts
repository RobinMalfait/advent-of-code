export default function (blob: string) {
  return blob
    .trim()
    .split('\n\n')
    .map((line) =>
      line
        .split('\n')
        .map((value) => Number(value.trim()))
        .reduce((total, current) => total + current, 0)
    )
    .sort((a, z) => z - a)
    .slice(0, 3)
    .reduce((total, current) => total + current)
}
