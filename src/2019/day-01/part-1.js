// Day 1: The Tyranny of the Rocket Equation

export default function calculateFuelForMass(masses) {
  return masses.reduce((total, mass) => total + Math.floor(mass / 3) - 2, 0)
}
