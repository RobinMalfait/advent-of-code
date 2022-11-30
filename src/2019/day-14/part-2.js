// Day 14: Space Stoichiometry

const part1 = require('./part-1')
const { binarySearch } = require('../utils')

module.exports = function maxOres(input) {
  const ONE_TRILLION = 1e12 // 1_000_000_000_000;

  return binarySearch((fuel_amount) => part1(input, fuel_amount), ONE_TRILLION)
}
