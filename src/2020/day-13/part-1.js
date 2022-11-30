export default function (blob) {
  let [nows, busses, now = Number(nows)] = blob.trim().split('\n')
  let [bus, next] = busses
    .split(',')
    .filter((b) => b !== 'x')
    .map(Number)
    .map((bus) => [bus, (Math.floor(now / bus) + 1) * bus])
    .sort((a, z) => a[1] - z[1])
    .shift()

  return (next - now) * bus
}
