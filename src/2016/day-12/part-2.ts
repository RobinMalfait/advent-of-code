import part1 from './part-1'

export default function (blob: string) {
  return part1(
    blob,
    new Map([
      ['a', 0],
      ['b', 0],
      ['c', 1],
      ['d', 0],
    ]),
  )
}
