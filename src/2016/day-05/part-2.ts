import { createHash } from 'crypto'

export default function (blob: string) {
  let DIGITS = 8
  let idx = 0

  let password = []
  let doorId = blob.trim()

  while (true) {
    let hash = md5(doorId + idx++)

    if (hash.startsWith('00000')) {
      let position = hash[5]

      // Not a valid position
      if (!/[0-7]/.test(position)) {
        continue
      }

      let index = Number(position)

      // Position is already filled in
      if (password[index] !== undefined) {
        continue
      }

      password[index] = hash[6]

      if (password.join('').length === DIGITS) {
        break
      }
    }
  }

  return password.join('')
}

function md5(input: string) {
  let hasher = createHash('md5')
  hasher.update(input)
  return hasher.digest('hex')
}
