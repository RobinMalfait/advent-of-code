export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .map(decompress)
    .reduce((acc, line) => acc + line.length, 0)
}

function decompress(line: string): string {
  let buffer = ''

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
      buffer += line.slice(idx, idx + take).repeat(repeat)
      idx += take
      continue
    }

    // Data
    else {
      buffer += line[idx]
    }

    idx += 1
  }

  return buffer
}
