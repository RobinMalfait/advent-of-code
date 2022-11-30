// Day 1: The Tyranny of the Rocket Equation

module.exports = function calculateFuelForMass(masses) {
  return masses.reduce((total, mass) => total + Math.floor(mass / 3) - 2, 0)
}
