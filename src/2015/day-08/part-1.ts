export default function (blob: string) {
  let total = blob.trim().replaceAll('\n', '').length
  return (
    total -
    blob
      .trim()
      .split('\n')
      .map((line) =>
        line
          .replace(/\\\\/g, '_')
          .replace(/\\"/g, '_')
          .replace(/\\x([0-9a-fA-F]{2})/g, '_'),
      )
      .map((line) => line.length - 2)
      .reduce((total, current) => total + current)
  )
}
