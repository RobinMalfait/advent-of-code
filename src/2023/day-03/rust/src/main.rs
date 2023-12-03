use std::collections::HashMap;
use std::{collections::HashSet, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2023-03.txt");

fn main() {
    let now = Instant::now();
    let part_1_result = part_1(INPUT);
    let duration = now.elapsed();
    println!("Part 1: {:<20}(took: {:>12?})", part_1_result, duration);

    let now = Instant::now();
    let part_2_result = part_2(INPUT);
    let duration = now.elapsed();
    println!("Part 2: {:<20}(took: {:>12?})", part_2_result, duration);
}

pub fn part_1(data: &str) -> i32 {
    let grid = data
        .trim()
        .lines()
        .map(|line| line.trim().chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();

    let mut sum = 0;
    let mut current = 0;
    let mut has_adjacent_symbol = false;

    for y in 0..grid.len() {
        for x in 0..grid[y].len() {
            let value = grid[y][x];

            // Not a number, not interested
            if !value.is_ascii_digit() {
                continue;
            }

            for dy in -1..=1 {
                for dx in -1..=1 {
                    // Skip self
                    if dy == 0 && dx == 0 {
                        continue;
                    }

                    let y = y as i32 + dy;
                    let x = x as i32 + dx;

                    // Out of bounds
                    if y < 0
                        || y >= grid.len() as i32
                        || x < 0
                        || x >= grid[y as usize].len() as i32
                    {
                        continue;
                    }

                    let y = y as usize;
                    let x = x as usize;

                    if !(grid[y][x].is_ascii_digit() || grid[y][x] == '.') {
                        has_adjacent_symbol |= true;
                    }
                }
            }

            // Adjust the working number
            current *= 10;
            current += value.to_digit(10).unwrap() as i32;

            // Next character is not a number anymore, we can track the working number if it has an
            // adjacent symbol(s).
            if x + 1 >= grid[y].len() || !grid[y][x + 1].is_ascii_digit() {
                if has_adjacent_symbol {
                    sum += current;
                }

                current = 0;
                has_adjacent_symbol = false;
            }
        }
    }

    sum
}

pub fn part_2(data: &str) -> i32 {
    let grid = data
        .trim()
        .lines()
        .map(|line| line.trim().chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();

    let mut gears: HashMap<(usize, usize), Vec<i32>> = HashMap::new();
    let mut current = 0;
    let mut adjacent_gear_positions: HashSet<(usize, usize)> = HashSet::new();

    for y in 0..grid.len() {
        for x in 0..grid[y].len() {
            let value = grid[y][x];

            // Not a number, not interested
            if !value.is_ascii_digit() {
                continue;
            }

            for dy in -1..=1 {
                for dx in -1..=1 {
                    // Skip self
                    if dy == 0 && dx == 0 {
                        continue;
                    }

                    let y = y as i32 + dy;
                    let x = x as i32 + dx;

                    // Out of bounds
                    if y < 0
                        || y >= grid.len() as i32
                        || x < 0
                        || x >= grid[y as usize].len() as i32
                    {
                        continue;
                    }

                    let y = y as usize;
                    let x = x as usize;

                    if grid[y][x] == '*' {
                        adjacent_gear_positions.insert((y, x));
                    }
                }
            }

            // Adjust the working number
            current *= 10;
            current += value.to_digit(10).unwrap() as i32;

            // Next character is not a number anymore, we can track the working number if it has an
            // adjacent symbol(s).
            if x + 1 >= grid[y].len() || !grid[y][x + 1].is_ascii_digit() {
                if !adjacent_gear_positions.is_empty() {
                    for point in &adjacent_gear_positions {
                        gears
                            .entry(*point)
                            .and_modify(|points| points.push(current))
                            .or_insert_with(|| vec![current]);
                    }
                }

                current = 0;
                adjacent_gear_positions.clear();
            }
        }
    }

    gears
        .values()
        .filter(|numbers| numbers.len() == 2)
        .map(|numbers| numbers[0] * numbers[1])
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..
        "#;

        assert_eq!(part_1(data), 4361);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 531932);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..
        "#;

        assert_eq!(part_2(data), 467835);
    }

    #[test]
    #[ignore]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 73646890);
    }
}
