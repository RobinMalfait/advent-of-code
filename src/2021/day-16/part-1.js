import { parse } from './parse.js'

export default function (blob) {
  return countVersions(parse(blob))
}

function countVersions(packet) {
  let total = 0
  for (let other of packet.packets ?? []) {
    total += countVersions(other)
  }
  return total + packet.version
}
