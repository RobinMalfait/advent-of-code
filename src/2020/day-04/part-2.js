let validations = {
  byr: (value) => value >= 1920 && value <= 2002,
  iyr: (value) => value >= 2010 && value <= 2020,
  eyr: (value) => value >= 2020 && value <= 2030,
  hgt: (value, [val, unit] = value.split(/(cm|in)/)) => ({ cm: val >= 150 && val <= 193, in: val >= 59 && val <= 76 }[unit] ?? false),
  hcl: (value) => /^#[0-9a-f]{6}$/.test(value),
  ecl: (value) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value),
  pid: (value) => /^[0-9]{9}$/.test(value),
}

export default function (blob) {
  let requiredFields = Object.keys(validations)

  return blob
    .replace(/\n+/g, ({ length }) => (length === 1 ? ' ' : '\n'))
    .split('\n')
    .filter((datum) => {
      let pairs = datum.split(/\s+/).map((pair) => pair.split(':'))
      let fields = pairs.map((pair) => pair[0])
      if (!requiredFields.every((field) => fields.includes(field))) return false

      return pairs.every(([field, value]) => validations[field]?.(value) ?? true)
    }).length
}
