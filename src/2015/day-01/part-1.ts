let map = { '(': 1, ')': -1 }

export default function (blob: string) {
  let floor = 0
  for (let symbol of blob.trim().split('')) {
    floor += map[symbol]
  }

  return floor
}
