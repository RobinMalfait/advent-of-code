export default function (blob: string) {
  return parse(blob.trim())
}

function parse(input: string) {
  let score = 0

  for (let i = 0; i < input.length; i++) {
    let char = input[i]
    if (char === '<') {
      for (let j = i + 1; j < input.length; j++) {
        // Next character is ignored, no matter what
        if (input[j] === '!') {
          j++
        } else if (input[j] === '>') {
          i = j
          break
        } else {
          score += 1
        }
      }
    }
  }

  return score
}
