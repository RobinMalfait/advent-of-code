// Day 16: Flawed Frequency Transmission

export default function fft({
  input = '',
  phases = 1,
  repeat = 1,
  offset_start_position = 0,
  offset_end_position = 0,
  target = 8,
}) {
  const full_input = input.repeat(repeat)
  const offset = Number(full_input.slice(offset_start_position, offset_end_position))
  const list = full_input.split('').map(Number)

  for (let i = 0; i < phases; i++) {
    let position = list.length - 1
    let total = 0

    while (position >= offset) {
      total += list[position]
      list[position] = lastDigit(total)
      position--
    }
  }

  return list.slice(offset, offset + target).join('')
}

function lastDigit(value) {
  return value > 0 ? value % 10 : (value % 10) * -1
}
