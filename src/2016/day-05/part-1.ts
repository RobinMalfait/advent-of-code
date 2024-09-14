import { createHash } from 'node:crypto'

export default function (blob: string) {
  let DIGITS = 8
  let idx = 0

  let password = ''
  let length = 0
  let doorId = blob.trim()

  while (length < DIGITS) {
    let hash = md5(doorId + idx++)

    if (hash.startsWith('00000')) {
      password += hash[5]
      length += 1
    }
  }

  return password
}

function md5(input: string) {
  return createHash('md5').update(input).digest('hex')
}
