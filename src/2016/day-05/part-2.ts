import { createHash } from 'node:crypto'

export default function (blob: string) {
  let DIGITS = 8
  let idx = 0

  let password = []
  let length = 0
  let doorId = blob.trim()

  while (length < DIGITS) {
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
      length += 1
    }
  }

  return password.join('')
}

function md5(input: string) {
  return createHash('md5').update(input).digest('hex')
}
