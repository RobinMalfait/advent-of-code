export default function (blob: string) {
  return react(blob.trim())
}

let FULLY_REACTING_REGEX = new RegExp(
  'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .flatMap((l) => [l + l.toUpperCase(), l.toUpperCase() + l])
    .join('|'),
  'g'
)

function collapse(input: string) {
  let result = input.replace(FULLY_REACTING_REGEX, '')
  return result === input ? input : collapse(result)
}

function react(input: string) {
  return 'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .map((c) => collapse(input.replace(new RegExp(c, 'gi'), '')))
    .sort((a, z) => z.length - a.length)
    .pop().length
}
