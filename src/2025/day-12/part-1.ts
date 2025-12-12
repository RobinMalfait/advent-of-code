import { parseIntoGrid, SKIP } from 'aoc-utils'

export default function (blob: string) {
  let rawShapes = blob.trim().split('\n\n')
  let rawRegions = rawShapes.pop()
  let shapes = parseShapes(rawShapes)
  let regions = parseRegions(rawRegions)

  let total = 0

  next: for (let { width, length, quantities } of regions) {
    let free = width * length
    for (let [idx, quantity] of quantities.entries()) {
      if (quantity === 0) continue // Skip shapes we don't need
      let shape = shapes[idx]

      // Is there even enough space without fitting things properly?
      let required = quantity * shape.size
      if (required > free) continue next
      free -= required
    }

    // Assumption: if we have enough free space, we can potentially fit
    // everything?
    total += 1
  }

  return total
}

function parseShapes(blobs: string[]) {
  return blobs.map((shape) => {
    let lines = shape.split('\n')
    lines.shift() // Drop the index line
    return parseIntoGrid(lines.join('\n'), (x) => (x === '#' ? 1 : SKIP))
  })
}

function parseRegions(blob: string) {
  return blob.split('\n').map((line) => {
    let [size, quantities] = line.trim().split(': ')
    let [width, length] = size.split('x').map(Number)
    return { width, length, quantities: quantities.split(' ').map(Number) }
  })
}
