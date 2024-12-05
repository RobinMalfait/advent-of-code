import { sum } from 'aoc-utils'

export default function (blob: string) {
  let [rules, pages] = parse(blob.trim().split('\n\n'))

  return sum(
    pages
      .filter((page) => isValidPage(page, rules))
      .map((page) => page[Math.floor(page.length / 2)])
  )
}

function isValidPage(page: number[], rules: [x: number, y: number][]) {
  for (let [x, y] of rules) {
    let xIdx = page.indexOf(x)
    if (xIdx === -1) continue

    let yIdx = page.indexOf(y)
    if (yIdx === -1) continue

    if (xIdx > yIdx) return false
  }

  return true
}

function parse([rules, pages]: string[]): [[x: number, y: number][], number[][]] {
  let parsedRules = rules.split('\n').map((rule) => rule.trim().split('|').map(Number)) as [
    x: number,
    y: number,
  ][]
  let parsedPages = pages.split('\n').map((page) => page.trim().split(',').map(Number))
  return [parsedRules, parsedPages]
}
