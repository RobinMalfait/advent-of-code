import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    // Each year lives in its own directory in the src folder. Since I'm not
    // planning to live until the year 3000, it's safe to assume that the years
    // will start with 2.
    //
    // If you are reading this from the future, I'm sorry for the inconvenience.
    projects: ['src/2*', 'src/aoc-utils'],
  },
})
