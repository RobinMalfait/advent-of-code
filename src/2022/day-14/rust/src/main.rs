use std::{collections::BTreeMap, num::ParseIntError, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-14.txt");

fn main() {
    let now = Instant::now();
    let part_1_result = part_1(INPUT);
    let duration = now.elapsed();
    println!("Part 1: {:<20}(took: {:?})", part_1_result, duration);

    let now = Instant::now();
    let part_2_result = part_2(INPUT);
    let duration = now.elapsed();
    println!("Part 2: {:<20}(took: {:?})", part_2_result, duration);
}

pub fn part_1(data: &str) -> i32 {
    let mut grid = parse_input(data);
    let start = Point { x: 500, y: 0 };
    let bottom = grid.keys().map(|x| x.y).max().unwrap_or_default();

    'outer: loop {
        let mut current = start.clone();

        loop {
            if !grid.contains_key(&current.down()) {
                current.y += 1;

                if current.y == bottom {
                    break 'outer;
                }
            } else if !grid.contains_key(&current.left()) {
                current.x -= 1;
            } else if !grid.contains_key(&current.right()) {
                current.x += 1;
            } else {
                grid.insert(current, Tile::Sand);
                break;
            }
        }
    }

    grid.iter()
        .filter(|(_, tile)| matches!(tile, Tile::Sand))
        .count() as i32
}

pub fn part_2(data: &str) -> i32 {
    let mut grid = parse_input(data);
    let start = Point { x: 500, y: 0 };
    let bottom = grid.keys().map(|x| x.y).max().unwrap_or_default() + 1;

    'outer: loop {
        let mut current = start.clone();

        loop {
            if !grid.contains_key(&current.down()) {
                current.y += 1;

                if current.y == bottom {
                    grid.insert(current, Tile::Sand);
                    break;
                }
            } else if !grid.contains_key(&current.left()) {
                current.x -= 1;
            } else if !grid.contains_key(&current.right()) {
                current.x += 1;
            } else {
                grid.insert(current.clone(), Tile::Sand);
                if current == start {
                    break 'outer;
                }
                break;
            }
        }
    }

    grid.iter()
        .filter(|(_, tile)| matches!(tile, Tile::Sand))
        .count() as i32
}

fn parse_input(data: &str) -> BTreeMap<Point, Tile> {
    let mut grid: BTreeMap<Point, Tile> = Default::default();
    let paths = data
        .trim()
        .lines()
        .map(|line| {
            line.trim()
                .split(" -> ")
                .filter_map(|raw_point| raw_point.parse().ok())
                .collect::<Vec<Point>>()
        })
        .collect::<Vec<_>>();

    // Build walls
    for path in paths {
        for pair in path.windows(2) {
            if let [from, to] = pair {
                let min_x = from.x.min(to.x);
                let min_y = from.y.min(to.y);
                let max_x = from.x.max(to.x);
                let max_y = from.y.max(to.y);

                for x in min_x..=max_x {
                    for y in min_y..=max_y {
                        grid.insert(Point { x, y }, Tile::Rock);
                    }
                }
            }
        }
    }

    grid
}

#[derive(Debug)]
enum Tile {
    Rock,
    Sand,
}

#[derive(Debug, Eq, Hash, PartialEq, Clone, Ord, PartialOrd)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn left(&self) -> Self {
        Self {
            x: self.x - 1,
            y: self.y + 1,
        }
    }

    fn right(&self) -> Self {
        Self {
            x: self.x + 1,
            y: self.y + 1,
        }
    }

    fn down(&self) -> Self {
        Self {
            x: self.x,
            y: self.y + 1,
        }
    }
}

impl FromStr for Point {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (x, y) = s.split_once(',').unwrap();
        Ok(Self {
            x: x.parse()?,
            y: y.parse()?,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            498,4 -> 498,6 -> 496,6
            503,4 -> 502,4 -> 502,9 -> 494,9
        "#;

        assert_eq!(part_1(data), 24);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 1001);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            498,4 -> 498,6 -> 496,6
            503,4 -> 502,4 -> 502,9 -> 494,9
        "#;

        assert_eq!(part_2(data), 93);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 27976);
    }
}
