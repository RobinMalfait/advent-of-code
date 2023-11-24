export default function (blob: string) {
  let node = blob.trim().split(' ').map(Number)

  return sumMetaData(node)
}

function sumMetaData(node: number[]) {
  let sum = 0

  if (node.length <= 2) {
    return sum
  }

  // Header
  let quantityChildNodes = node.shift()
  let quantityMetadataEntries = node.shift()

  // Handle children
  for (let _ of Array(quantityChildNodes)) {
    sum += sumMetaData(node)
  }

  // Meta data sum
  sum += node.splice(0, quantityMetadataEntries).reduce((a, b) => a + b, 0)

  return sum
}
