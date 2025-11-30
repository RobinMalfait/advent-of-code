export default function (blob: string) {
  return collapse(blob.trim()).length
}

let FULLY_REACTING_REGEX = new RegExp(
  'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .flatMap((l) => [l + l.toUpperCase(), l.toUpperCase() + l])
    .join('|'),
  'g',
)

function collapse(input: string) {
  let result = input.replace(FULLY_REACTING_REGEX, '')
  return result === input ? input : collapse(result)
}
