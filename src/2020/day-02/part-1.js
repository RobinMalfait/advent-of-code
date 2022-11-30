let DROP = false
let KEEP = true

export default function (blob) {
  return blob
    .trim()
    .split('\n')
    .filter((line) => {
      let [policy, password] = line.split(': ')
      let [range, char] = policy.split(' ')
      let [min, max] = range.split('-').map(Number)

      let count = 0
      for (let c of password) {
        if (c !== char) continue
        if (++count > max) return DROP
      }

      return count < min ? DROP : KEEP
    }).length
}
