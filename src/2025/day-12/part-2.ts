export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
}

function parse(input: string) {
  return input
}
