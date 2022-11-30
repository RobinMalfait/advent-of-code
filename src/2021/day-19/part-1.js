export default function (blob) {
  let report = blob
    .trim()
    .split('\n\n')
    .map((scanner) => scanner.split('\n'))
    .map(([_, ...coords]) => coords.map((coord) => coord.split(',').map(Number)))

  // TODO: Implement this 😅
  return 42
}

function* rotate(x, y, z) {
  yield [x, y, z]
  yield [y, z, x]
  yield [z, x, y]
  yield [-x, z, y]
  yield [z, y, -x]
  yield [y, -x, z]
  yield [x, z, -y]
  yield [z, -y, x]
  yield [-y, x, z]
  yield [x, -z, y]
  yield [-z, y, x]
  yield [y, x, -z]
  yield [-x, -y, z]
  yield [-y, z, -x]
  yield [z, -x, -y]
  yield [-x, y, -z]
  yield [y, -z, -x]
  yield [-z, -x, y]
  yield [x, -y, -z]
  yield [-y, -z, x]
  yield [-z, x, -y]
  yield [-x, -z, -y]
  yield [-z, -y, -x]
  yield [-y, -x, -z]
}
