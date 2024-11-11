export default function (blob: string) {
  return parse(blob.trim())
}

function parse(input: string) {
  let score = 0
  let level = 0

  for (let i = 0; i < input.length; i++) {
    let char = input[i]
    // Start of group
    if (char === '{') {
      level += 1
    }
    // End of group
    else if (char === '}') {
      score += level
      level -= 1
    }

    // Parse garbage
    else if (char === '<') {
      for (let j = i + 1; j < input.length; j++) {
        // Next character is ignored, no matter what
        if (input[j] === '!') {
          j++
        } else if (input[j] === '>') {
          i = j
          break
        }
      }
    }
  }

  return score
}
