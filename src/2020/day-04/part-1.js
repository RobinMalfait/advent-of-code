let requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

export default function (blob) {
  return blob.split('\n\n').filter((datum) => {
    let fields = datum
      .replace(/\n+/g, ' ')
      .split(/\s+/)
      .map((pair) => pair.split(':')[0])
    return requiredFields.every((field) => fields.includes(field))
  }).length
}
