import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  let instructions = parse(blob.trim())
  let boxes = new DefaultMap<number, Extract<Instruction, { type: 'EQUALS' }>['lens'][]>(() => [])

  for (let instruction of instructions) {
    if (instruction.type === 'EQUALS') {
      let slot = boxes.get(instruction.box).findIndex((lens) => lens.label === instruction.label)
      if (slot !== -1) {
        boxes.get(instruction.box).splice(slot, 1, instruction.lens)
      } else {
        boxes.get(instruction.box).push(instruction.lens)
      }
    } else if (instruction.type === 'DASH') {
      let slot = boxes.get(instruction.box).findIndex((lens) => lens.label === instruction.label)
      if (slot !== -1) {
        boxes.get(instruction.box).splice(slot, 1)
      }
    }
  }

  let total = 0
  for (let [id, box] of boxes) {
    if (box.length === 0) continue

    for (let [slot, lens] of box.entries()) {
      total += (1 + id) * (1 + slot) * lens.focal
    }
  }
  return total
}

function hash(input: string) {
  let value = 0
  for (let char of input) {
    value += char.charCodeAt(0)
    value *= 17
    value %= 256
  }
  return value
}

type Instruction =
  | { type: 'EQUALS'; box: number; label: string; lens: { label: string; focal: number } }
  | { type: 'DASH'; box: number; label: string }

function parse(input: string): Instruction[] {
  return input.split(',').map((instruction) => {
    if (instruction.includes('=')) {
      let [label, value] = instruction.split('=')
      return {
        type: 'EQUALS',
        box: hash(label),
        label,
        lens: {
          label,
          focal: Number(value),
        },
      }
    } else if (instruction.endsWith('-')) {
      return { type: 'DASH', box: hash(instruction.slice(0, -1)), label: instruction.slice(0, -1) }
    } else {
      throw new Error(`Cannot parse instruction: ${instruction}`)
    }
  })
}
