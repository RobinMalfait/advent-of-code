import { DefaultMap } from 'aoc-utils'

export default function (blob: string, blinks = 25) {
  let stones = blob.trim().split(' ').map(Number)

  let compute: DefaultMap<number, DefaultMap<number, number>> = new DefaultMap((blink) => {
    return new DefaultMap((stone) => {
      if (blink === 0) {
        return 1
      }

      // 0 -> 1
      if (stone === 0) {
        return compute.get(blink - 1).get(1)
      }

      // Split into 2 stones
      let digits = stone.toString().length
      if (digits % 2 === 0) {
        let split = digits / 2
        let left = (stone / 10 ** split) | 0
        let right = stone % 10 ** split
        return compute.get(blink - 1).get(left) + compute.get(blink - 1).get(right)
      }

      // stone * 2024
      return compute.get(blink - 1).get(stone * 2024)
    })
  })

  let total = 0
  for (let stone of stones) {
    total += compute.get(blinks).get(stone)
  }
  return total
}
