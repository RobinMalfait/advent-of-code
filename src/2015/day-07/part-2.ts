import part1 from './part-1'

export default function (blob: string) {
  let a = part1(blob)
  return part1(`${blob.trim()}\n${a} -> b`)
}
