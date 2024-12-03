export default function (blob: string) {
  let answer = 0
  for (let [, arg1, arg2] of blob.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
    answer += Number(arg1) * Number(arg2)
  }
  return answer
}
