// Day 14: Space Stoichiometry

import { binarySearch } from '../utils'
import part1 from './part-1'

export default function maxOres(input) {
  const ONE_TRILLION = 1e12 // 1_000_000_000_000;

  return binarySearch((fuel_amount) => part1(input, fuel_amount), ONE_TRILLION)
}
