export default function (blob: string) {
  let answer = 0
  let allowed = true
  for (let [, instr, arg1, arg2] of blob.matchAll(/(mul|do|don't)\((?:(\d{1,3}),(\d{1,3}))?\)/g)) {
    if (instr === 'mul' && allowed) {
      answer += Number(arg1) * Number(arg2)
    } else if (instr === 'do') {
      allowed = true
    } else if (instr === "don't") {
      allowed = false
    }
  }
  return answer
}
