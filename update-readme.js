import fs from 'node:fs/promises'
import path from 'node:path'

import { load } from 'cheerio'
import prettier from 'prettier'

async function get(url) {
  let response = await fetch(`https://adventofcode.com${url}`, {
    headers: {
      cookie: process.env.AOC_COOKIE,
    },
  })
  return response.text()
}

async function getStars(year) {
  let contents = await get(`/${year}`)

  let starsByDay = new Map(Array.from({ length: 25 }, (_, i) => [i + 1, 0]))
  let $ = load(contents)
  for (let el of $('[aria-label^="Day "]')) {
    let label = el.attribs['aria-label']
    let { groups } = /Day (?<day>\d+)(?:, (?<stars>one|two) stars?)?/g.exec(label)
    starsByDay.set(Number(groups.day), groups.stars === 'two' ? 2 : groups.stars === 'one' ? 1 : 0)
  }

  return Array.from(starsByDay.values())
}

function transpose(grid) {
  return grid[0].map((_, i) => grid.map((row) => row[i]))
}

// --

let contents = await get(`/${new Date().getFullYear()}/events`)
let $ = load(contents)

let totals = []
for await (let event of $('.eventlist-event')) {
  let year = Number($(event).find('a:first-of-type').text().trim().slice(1, -1))
  totals.push([year, ...(await getStars(year))])
}

let data = transpose(totals.reverse())

let output = [['Day', ...data[0].map((year) => `[${year}][link-${year}]`)]]
output.push([':---:', ...data[0].map(() => ':---')])

for (let [idx, row] of data.slice(1).entries()) {
  output.push([
    `**${idx + 1}**`,
    ...row.map((stars) => (stars === 2 ? '⭐⭐' : stars === 1 ? '⭐' : ' ')),
  ])
}

output.push([
  '**Total:**',
  ...data.slice(1).reduce(
    (acc, row) =>
      acc.map((v, i) => {
        let total = v + row[i]
        if (total === 50) {
          return '**50**'
        }
        return total
      }),
    Array(data[0].length).fill(0),
  ),
])

// Main README.md
{
  let allStars = data.slice(1).reduce((acc, row) => acc + row.reduce((acc, v) => acc + v, 0), 0)
  let markdown = `Total stars: **${allStars}**\n\n${output.map((row) => `|${row.join(' | ')}|`).join('\n')}\n\n${data[0]
    .map(
      (year) =>
        `[link-${year}]: https://github.com/RobinMalfait/advent-of-code/tree/main/src/${year}`,
    )
    .join('\n')}`

  let readme = path.join(process.cwd(), 'README.md')
  let contents = await fs.readFile(readme, 'utf8')
  await fs.writeFile(
    readme,
    await prettier.format(
      contents.replace(
        /<\!-- start -->([\s\S]*)<\!-- end -->/g,
        `<!-- start -->\n${markdown}\n<!-- end -->`,
      ),
      { parser: 'markdown' },
    ),
  )
}

// Sub README.md
{
  for (let [year, ...stars] of totals) {
    let count = stars.reduce((acc, v) => acc + v, 0)

    let output = [
      ['Day', 'Part 1', 'Part 2'],
      [':---:', ':---:', ':---:'],
    ]

    for (let [idx, count] of stars.entries()) {
      output.push([`**${idx + 1}**`, count >= 1 ? '⭐' : ' ', count === 2 ? '⭐' : ' '])
    }

    let markdown = `Total stars: **${count}**\n\n${output.map((row) => `|${row.join(' | ')}|`).join('\n')}\n`

    let readme = path.join(process.cwd(), `src/${year}/README.md`)
    let contents = await fs.readFile(readme, 'utf8')
    await fs.writeFile(
      readme,
      await prettier.format(
        contents.replace(
          /<\!-- start -->([\s\S]*)<\!-- end -->/g,
          `<!-- start -->\n${markdown}\n<!-- end -->`,
        ),
        { parser: 'markdown' },
      ),
    )
  }
}
