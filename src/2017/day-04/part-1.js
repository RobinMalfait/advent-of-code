export default function (blob) {
  return blob
    .trim()
    .split('\n')
    .filter((password) => {
      let seen = new Set()
      for (let word of password.split(' ')) {
        if (seen.has(word)) return false
        seen.add(word)
      }
      return true
    }).length
}
