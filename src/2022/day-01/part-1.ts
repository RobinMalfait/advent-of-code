export default function (blob: string) {
  return Math.max(
    ...blob
      .trim()
      .split('\n\n')
      .map((line) =>
        line
          .split('\n')
          .map((value) => Number(value.trim()))
          .reduce((total, current) => total + current, 0),
      ),
  )
}
