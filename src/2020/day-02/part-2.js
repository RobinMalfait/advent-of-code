export default function (blob) {
  return blob
    .trim()
    .split('\n')
    .filter((line) => {
      let [policy, password] = line.split(': ')
      let [range, char] = policy.split(' ')
      let [min, max] = range.split('-').map((v) => +v - 1)

      return (password[min] === char) ^ (password[max] === char)
    }).length
}
