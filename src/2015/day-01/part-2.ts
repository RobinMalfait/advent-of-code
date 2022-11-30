let map = { '(': 1, ')': -1 }

export default function (blob: string) {
  let floor = 0
  for (let [idx, symbol] of blob.trim().split('').entries()) {
    floor += map[symbol]

    if (floor === -1) {
      return idx + 1
    }
  }

  return floor
}
