export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .map(decompressedLength)
    .reduce((acc, curr) => acc + curr, 0)
}

function decompressedLength(line: string): number {
  let length = 0

  let idx = 0
  while (idx < line.length) {
    // Start of marker
    if (line[idx] === '(') {
      let marker = ''
      while (line[idx - 1] !== ')') {
        marker += line[idx]
        idx++
      }

      let [take, repeat] = marker.slice(1, -1).split('x').map(Number)
      length += decompressedLength(line.slice(idx, idx + take)) * repeat
      idx += take
      continue
    }

    // Data

    length += 1

    idx += 1
  }

  return length
}
