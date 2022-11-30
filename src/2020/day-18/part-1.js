let DEFAULT_OPERATOR_PRECEDENCE = { '+': 0, '*': 0 }

export default function (blob, OPERATOR_PRECEDENCE = DEFAULT_OPERATOR_PRECEDENCE) {
  return blob
    .trim()
    .split('\n')
    .reduce((total, equation) => total + evaluate(lex(equation)), 0)

  function lex(raw) {
    let stack = []
    let output = []

    for (let token of raw.split(/\s*/g)) {
      if (token === '(') stack.push(token)
      else if (token === '+' || token === '*') {
        let precedence = OPERATOR_PRECEDENCE[token]

        while (stack.length > 0) {
          let head = stack[stack.length - 1]

          if (head !== '+' && head !== '*') break
          if (OPERATOR_PRECEDENCE[head] < precedence) break

          output.unshift(stack.pop())
        }

        stack.push(token)
      } else if (token === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') output.unshift(stack.pop())
        stack.pop()
      } else output.unshift(Number(token)) // Assuming numbers by default
    }

    return [...stack.splice(0), ...output]
  }

  function evaluate(tokens) {
    let pc = 0

    function walk() {
      let token = tokens[pc++]

      if (token === '+') return walk() + walk()
      if (token === '*') return walk() * walk()

      return token
    }

    return walk()
  }
}
