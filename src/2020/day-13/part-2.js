export default function (blob) {
  let busses = blob
    .split('\n')[1]
    .split(',')
    .map((bus, offset) => (bus === 'x' ? null : [Number(bus), offset]))
    .filter(Boolean)
    .sort((a, z) => a[0] - z[0]) // Makes it a littttle bit faster

  let sum = 0
  let product = 1

  for (let [bus, offset] of busses) {
    while ((sum + offset) % bus !== 0) {
      sum += product
    }

    product *= bus
  }

  return sum
}
