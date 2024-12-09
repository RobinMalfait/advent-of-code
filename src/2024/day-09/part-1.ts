enum Type {
  File = 0,
  Empty = 1,
}

export default function (blob: string) {
  let disk = blob.trim().split('').map(Number)

  // 1. Expand
  let types: Type[] = []
  let numbers: number[] = []

  for (let [idx, n] of disk.entries()) {
    if (idx % 2 === 0) {
      let fileIdx = Math.ceil(idx / 2)
      for (let i = 0; i < n; i++) {
        types.push(Type.File)
        numbers.push(fileIdx)
      }
    } else {
      for (let i = 0; i < n; i++) {
        types.push(Type.Empty)
      }
    }
  }

  // 2. Calculate checksum
  let idx = 0
  let checksum = 0
  for (let type of types) {
    if (type === Type.File && numbers.length > 0) {
      checksum += numbers.shift() * idx++
    } else if (type === Type.Empty && numbers.length > 0) {
      checksum += numbers.pop() * idx++
    } else {
      break
    }
  }

  return checksum
}
