export default function (blob: string) {
  let password = blob.trim().toLowerCase()
  do {
    password = increment(password)
  } while (!isValid(password))
  return password
}

// ---

function isValid(password: string) {
  // Rule #2
  if (password.includes('i') || password.includes('o') || password.includes('l')) {
    return false
  }

  // Rule #1
  if (!Array.from(windows(3, codes(password))).some(([a, b, c]) => a + 1 === b && b + 1 === c)) {
    return false
  }

  // Rule #3
  {
    let length = 2
    let count = 0
    let lastFoundAt = -length
    let i = 0
    for (let [a, b] of windows(length, password.split(''))) {
      if (a === b && i - lastFoundAt >= length) {
        if (count++ >= length) return true
        lastFoundAt = i
      }
      i++
    }

    if (count < length) return false
  }

  return true
}

// ---

let A = 97
let Z = 122

function increment(password: string) {
  let parts = codes(password)
  let location = parts.length - 1
  while (true) {
    if (location === -1) {
      parts.unshift(A)
      break
    } else if (parts[location] < Z) {
      parts[location] += 1
      break
    } else if (parts[location] === Z) {
      parts[location] = A
      location -= 1
    }
  }

  return parts.map((x) => String.fromCharCode(x)).join('')
}

// ---

function codes(input: string) {
  return input.split('').map((x) => x.charCodeAt(0))
}

function* windows<T>(n: number, arr: T[]) {
  for (let i = 0; i <= arr.length - n; i++) {
    yield arr.slice(i, i + n)
  }
}

function chunks<T>(amount: number, arr: T[]): T[][] {
  let chunked: T[][] = []

  for (let i = 0; i < arr.length; i += amount) {
    chunked.push(arr.slice(i, i + amount))
  }

  return chunked
}
