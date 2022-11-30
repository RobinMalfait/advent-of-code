function intersectionCount(...arr) {
  let [smallest, ...rest] = arr.slice().sort((a, z) => a.length - z.length)
  let same = new Set(smallest)

  for (let group of rest) {
    for (let item of same.values()) {
      if (!group.includes(item)) {
        same.delete(item)
      }
    }
  }

  return same.size
}

export default function (blob) {
  return blob
    .trim()
    .split('\n\n')
    .map((group) => intersectionCount(...group.split('\n').map((answers) => answers.split(''))))
    .reduce((total, current) => total + current, 0)
}
