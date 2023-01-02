export default function (blob: string) {
  let total = blob.trim().replaceAll('\n', '').length
  return (
    blob
      .trim()
      .split('\n')
      .map((line) => `"${line.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`)
      .map((line) => line.length)
      .reduce((total, current) => total + current) - total
  )
}
