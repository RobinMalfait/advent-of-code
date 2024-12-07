// Day 8: Space Image Format

import { chunk } from '../utils'

export default function calculateImageLayers(data, width, height) {
  let layers = chunk(data, width * height)
  let sorted = layers.slice().sort((a, b) => {
    let zeroes_in_a = (a.match(/0/g) || []).length
    let zeroes_in_b = (b.match(/0/g) || []).length
    return Math.sign(zeroes_in_a - zeroes_in_b)
  })

  let least_zeroes = sorted.shift()
  let ones_count = (least_zeroes.match(/1/g) || []).length
  let twos_count = (least_zeroes.match(/2/g) || []).length

  return ones_count * twos_count
}
