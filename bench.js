import { promises } from 'node:fs'
import prettier from 'prettier'

import ms from 'pretty-ms'

let config = {
  warmup: 10,
  runs: 100,
  year: process.argv[2] !== undefined ? Number(process.argv[2]) : new Date().getFullYear(),
  day: process.argv[3] !== undefined ? Number(process.argv[3]) : null,
  part: process.argv[4] !== undefined ? Number(process.argv[4]) : null,
}

let shouldWrite = Boolean(process.env.WRITE)

async function exec(year, day) {
  let output = []

  day = `${day}`.padStart(2, '0')
  let data = await promises.readFile(`./data/${year}-${day}.txt`, 'utf8')
  let parts = await Promise.all([
    import(`./src/${year}/day-${day}/part-1.js`).catch(() => ({ default: null })),
    import(`./src/${year}/day-${day}/part-2.js`).catch(() => ({ default: null })),
  ])

  for (let [idx, { default: fn }] of parts.entries()) {
    if (typeof fn !== 'function') continue

    // Skip other parts in case we want to look at a specific part
    if (config.part !== null && config.part - 1 !== idx) continue

    // Warmup
    for (let i = 0; i < config.warmup; i++) {
      fn(data)
    }

    // Let's go!
    let timeTotal = 0
    for (let i = 0; i < config.runs; i++) {
      let start = process.hrtime.bigint()
      fn(data)
      let end = process.hrtime.bigint()

      timeTotal += Number(end - start)
    }

    process.stdout.write(
      `[${year}] Day ${day} Part ${idx + 1} - ${ms(timeTotal / config.runs / 1e6, {
        formatSubMilliseconds: true,
      })}\n`
    )
    output.push(ms(timeTotal / config.runs / 1e6, { formatSubMilliseconds: true }))
  }

  process.stdout.write('\n')
  return [day, ...output]
}

console.log()
console.log('Warmup runs:', config.warmup)
console.log(' Total runs:', config.runs)
console.log()

if (config.day !== null) {
  await exec(config.year, config.day)
} else {
  let days = (await promises.readdir(`./src/${config.year}`, { withFileTypes: true }))
    .filter((file) => file.isDirectory())
    .filter((dir) => dir.name.startsWith('day-'))
    .map((dir) => dir.name.replace('day-', ''))

  let output = [
    ['Day', 'Part 1', 'Part 2'],
    ['---:', '---:', '---:'],
  ]
  for (let day of days) {
    output.push(await exec(config.year, day))
  }

  if (shouldWrite) {
    let readmeContents = await promises.readFile(`./src/${config.year}/README.md`, 'utf8')
    let r = /<!-- BENCH TABLE -->([\s\S]*?)<!-- \/BENCH TABLE -->/g
    readmeContents = readmeContents.replace(
      r,
      `<!-- BENCH TABLE -->\n\n${output
        .map((row) => `| ${row.join(' | ')} |`)
        .join('\n')}\n\n<!-- /BENCH TABLE -->`
    )
    await promises.writeFile(
      `./src/${config.year}/README.md`,
      prettier.format(readmeContents, { parser: 'markdown' })
    )
  }
}
