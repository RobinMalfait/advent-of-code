export default function (blob: string) {
  let node = blob.trim().split(' ').map(Number)

  return count(parse(node))
}

function count(root: Tree) {
  let sum = 0

  if (root.children.length <= 0) {
    sum += root.meta.reduce((a, b) => a + b, 0)
  } else {
    for (let idx of root.meta) {
      if (root.children[idx - 1]) {
        sum += count(root.children[idx - 1])
      }
    }
  }

  return sum
}

function parse(root: number[]): Tree {
  let quantityChildNodes = root.shift()
  let quantityMetadataEntries = root.shift()

  let node: Tree = {
    children: [],
    meta: [],
  }

  for (let _ of Array(quantityChildNodes)) {
    node.children.push(parse(root))
  }

  for (let meta of root.splice(0, quantityMetadataEntries)) {
    node.meta.push(meta)
  }

  return node
}

type Tree = {
  children: Tree[]
  meta: number[]
}
