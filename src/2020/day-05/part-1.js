export default function (blob) {
  return blob
    .trim()
    .split('\n')
    .map((bp) => Number.parseInt(bp.replace(/[FL]/g, '0').replace(/[BR]/g, '1'), 2))
    .sort((a, z) => z - a)[0]
}
