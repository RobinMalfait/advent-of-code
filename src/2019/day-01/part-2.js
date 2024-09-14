// Day 1: The Tyranny of the Rocket Equation

function calculateFuelForSingleMass(mass) {
  const fuel = Math.max(Math.floor(mass / 3) - 2, 0)
  return fuel === 0 ? fuel : fuel + calculateFuelForSingleMass(fuel)
}

export default function calculateFuelForMass(masses) {
  return masses.reduce((total, mass) => total + calculateFuelForSingleMass(mass), 0)
}
