import { DefaultMap } from 'aoc-utils'

enum Type {
  File = 0,
  Empty = 1,
}

type Block =
  | { kind: Type.Empty; value: number }
  | { kind: Type.File; value: number; amount: number }

export default function (blob: string) {
  let disk = blob.trim().split('').map(Number)

  let blocks: Block[] = []
  let filesBySize = new DefaultMap<number, Extract<Block, { kind: Type.File }>[]>(() => [])

  for (let [idx, n] of disk.entries()) {
    if (idx % 2 === 0) {
      let block = { kind: Type.File, value: Math.ceil(idx / 2), amount: n } as const
      blocks.push(block)
      for (let i = 9; i >= n; i--) {
        // Block of size `n` fits in a block of size `n`, `n+1`, …
        filesBySize.get(i).push(block)
      }
    } else {
      blocks.push({ kind: Type.Empty, value: n })
    }
  }

  let idx = 0
  let checksum = 0
  let seen = new Set<Block>()
  for (let block of blocks) {
    if (block.kind === Type.File) {
      if (seen.has(block)) {
        idx += block.amount
        continue
      }
      seen.add(block)

      for (let i = 0; i < block.amount; i++) {
        checksum += block.value * idx++
      }
    } else if (block.kind === Type.Empty) {
      let remaining = block.value

      while (true) {
        let blocks = filesBySize.get(remaining)
        let block = blocks.pop()
        while (seen.has(block)) block = blocks.pop()

        if (block) {
          seen.add(block)

          remaining -= block.amount
          for (let i = 0; i < block.amount; i++) {
            checksum += block.value * idx++
          }
        } else {
          break
        }
      }

      idx += remaining
    }
  }

  return checksum
}
