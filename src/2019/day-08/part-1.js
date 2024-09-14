// Day 8: Space Image Format

import { chunk } from '../utils'

export default function calculateImageLayers(data, width, height) {
  const layers = chunk(data, width * height)
  const sorted = layers.slice().sort((a, b) => {
    const zeroes_in_a = (a.match(/0/g) || []).length
    const zeroes_in_b = (b.match(/0/g) || []).length
    return Math.sign(zeroes_in_a - zeroes_in_b)
  })

  const least_zeroes = sorted.shift()
  const ones_count = (least_zeroes.match(/1/g) || []).length
  const twos_count = (least_zeroes.match(/2/g) || []).length

  return ones_count * twos_count
}
