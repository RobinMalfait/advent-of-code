export default function (blob) {
  let cuboids = blob
    .trim()
    .split('\n')
    .map((line) => line.split(' '))
    .map(([state, data]) => [
      state,
      /x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/g.exec(data).map(Number),
    ])
    .map(([state, data, _ = data.shift()]) => [state, ...data])
    .map(([state, x1, x2, y1, y2, z1, z2]) => [
      state,
      Math.min(x1, x2),
      Math.max(x1, x2),
      Math.min(y1, y2),
      Math.max(y1, y2),
      Math.min(z1, z2),
      Math.max(z1, z2),
    ])
    .filter(([, ...points]) => points.every((point) => point >= -50 && point <= 50))

  let world = new Set()
  for (let [state, x1, x2, y1, y2, z1, z2] of cuboids) {
    for (let x of range(x1, x2)) {
      for (let y of range(y1, y2)) {
        for (let z of range(z1, z2)) {
          if (state === 'on') {
            world.add(id(x, y, z))
          } else if (state === 'off') {
            world.delete(id(x, y, z))
          }
        }
      }
    }
  }

  return world.size
}

function range(min, max) {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i)
}

function id(...points) {
  return points.join(';')
}
