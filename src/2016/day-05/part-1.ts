import { createHash } from 'crypto'

export default function (blob: string) {
  let DIGITS = 8
  let idx = 0

  let password = ''
  let doorId = blob.trim()

  while (true) {
    let hash = md5(doorId + idx)

    if (hash.startsWith('00000')) {
      password += hash[5]
      if (password.length === DIGITS) {
        break
      }
    }

    idx++
  }

  return password
}

function md5(input: string) {
  let hasher = createHash('md5')
  hasher.update(input)
  return hasher.digest('hex')
}
