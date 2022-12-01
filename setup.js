import fs from 'fs'
import path from 'path'

let day = (process.argv[2] ?? new Date().getDate().toString()).padStart(2, '0')
let year = process.argv[3] ?? new Date().getFullYear().toString()

function data(...paths) {
  return path.resolve(process.cwd(), 'data', ...paths)
}

function destYear(...paths) {
  return path.resolve(process.cwd(), 'src', year, ...paths)
}

function destDay(...paths) {
  return destYear(`day-${day}`, ...paths)
}

function template(...paths) {
  return path.resolve(process.cwd(), 'templates', ...paths)
}

if (fs.existsSync(destDay())) {
  throw new Error(`Watch out! "${path.resolve(process.cwd(), destDay())}" already exists!`)
}

await fs.promises.mkdir(destDay(), { recursive: true })

async function copy(src, dst) {
  let stat = await fs.promises.stat(src)

  if (stat.isDirectory()) {
    await fs.promises.mkdir(dst, { recursive: true })
  }

  if (stat.isDirectory()) {
    let files = await fs.promises.readdir(src, { withFileTypes: true })
    await Promise.all(files.map((dirent) => copy(path.resolve(src, dirent.name), path.resolve(dst, dirent.name))))
  }

  if (stat.isFile()) {
    await fs.promises.copyFile(src, dst)
  }
}

// Copy the files from the year template
if (!fs.existsSync(destYear('package.json'))) {
  await copy(template('year'), destYear())

  let replacements = {
    'package.json': {
      YEAR: year,
    },
    'README.md': {
      YEAR: year,
    },
  }

  for (let file in replacements) {
    let contents = await fs.promises.readFile(destYear(...file.split('/')), 'utf8')
    for (let [key, value] of Object.entries(replacements[file])) {
      contents = contents.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }
    await fs.promises.writeFile(destYear(file), contents, 'utf8')
  }
}

// Copy the files from the day template
await copy(template('day'), destDay())

// Replace the constants
let replacements = {
  'index.test.ts': {
    DAY: day,
    YEAR: year,
  },
  'rust/src/main.rs': {
    DAY: day,
    YEAR: year,
  },
  'rust/Cargo.toml': {
    DAY: day,
    YEAR: year,
  },
  'rust/Cargo.lock': {
    DAY: day,
    YEAR: year,
  },
}

for (let file in replacements) {
  let contents = await fs.promises.readFile(destDay(...file.split('/')), 'utf8')
  for (let [key, value] of Object.entries(replacements[file])) {
    contents = contents.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }
  await fs.promises.writeFile(destDay(file), contents, 'utf8')
}

// Get the data for the next day
let response = await fetch(`https://adventofcode.com/${year}/day/${Number(day)}/input`, {
  headers: {
    cookie: process.env.AOC_COOKIE,
  },
})
let contents = await response.text()

await fs.promises.writeFile(data(`${year}-${day}.txt`), contents, 'utf8')
