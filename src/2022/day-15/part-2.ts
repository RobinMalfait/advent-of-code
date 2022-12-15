export default function (blob: string, min_value: number, max_value: number) {
  let reports = blob
    .trim()
    .split('\n')
    .map((line) => line.trim().replace('Sensor at ', '').replace('closest beacon is at ', '').split(': '))
    .map(([sensor_raw, beacon_raw]) => ({ sensor: parsePoint(sensor_raw), beacon: parsePoint(beacon_raw) }))

  for (let y = max_value; y >= min_value; y--) {
    let ranges: Range[] = []

    for (let report of reports) {
      let m = manhatten(report.sensor, report.beacon)
      let min_y = report.sensor.y - m
      let max_y = report.sensor.y + m

      if (min_y <= y && y <= max_y) {
        let remaining = Math.abs(m - Math.abs(report.sensor.y - y))
        let min_x = report.sensor.x - remaining
        let max_x = report.sensor.x + remaining

        ranges.push({ start: clamp(min_x, min_value, max_value), end: clamp(max_x, min_value, max_value) })
      }
    }

    ranges.sort((a, z) => Math.sign(a.start - z.start) || Math.sign(z.end - z.end))

    let range_stack = ranges.splice(0, 1)
    for (let range of ranges) {
      if (overlaps(range, range_stack.at(-1))) {
        range_stack[range_stack.length - 1] = merge(range, range_stack.at(-1))
      } else {
        range_stack.push(range)
      }
    }

    if (range_stack.length <= 1) continue

    let z = range_stack.pop()
    let a = range_stack.pop()

    let diff = z.start - a.end

    // 13 [..] 15
    // → 15 - 13 = 2
    if (diff !== 2) continue

    let x = z.start - 1
    return x * 4_000_000 + y
  }
}

function overlaps(a: Range, z: Range) {
  return !(a.end < z.start || a.start > z.end)
}

function merge(a: Range, z: Range) {
  return { start: Math.min(a.start, z.start), end: Math.max(a.end, z.end) }
}

type Range = { start: number; end: number }

function parsePoint(raw: string): Point {
  let [x, y] = raw.replace('x=', '').replace('y=', '').split(', ').map(Number)
  return { x, y }
}

type Point = { x: number; y: number }

function manhatten(a: Point, z: Point) {
  return Math.abs(a.x - z.x) + Math.abs(a.y - z.y)
}

function clamp(value: number, lower: number, upper: number) {
  return Math.min(upper, Math.max(value, lower))
}
