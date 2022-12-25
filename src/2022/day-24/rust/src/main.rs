use std::collections::BTreeSet;
use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2022-24.txt");

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
    let width = data.lines().next().map(|x| x.len()).unwrap() as i32;
    let height = data.lines().count() as i32;

    let mut blizzards = vec![];
    let mut start: Option<Point> = None;
    let mut end: Option<Point> = None;

    for (row_idx, row) in data.lines().enumerate() {
        for (col_idx, value) in row.chars().enumerate() {
            let position = Point::new(row_idx as i32, col_idx as i32);

            match value {
                // Wall
                '#' => {}
                // Ground
                '.' => {
                    if start.is_none() {
                        start = Some(position)
                    } else {
                        end = Some(position)
                    }
                }
                // Blizzards
                '>' => blizzards.push(Blizzard {
                    area_width: width,
                    area_height: height,
                    position,
                    direction: Direction::East,
                }),
                'v' => blizzards.push(Blizzard {
                    area_width: width,
                    area_height: height,
                    position,
                    direction: Direction::South,
                }),
                '<' => blizzards.push(Blizzard {
                    area_width: width,
                    area_height: height,
                    position,
                    direction: Direction::West,
                }),
                '^' => blizzards.push(Blizzard {
                    area_width: width,
                    area_height: height,
                    position,
                    direction: Direction::North,
                }),
                _ => unreachable!(),
            }
        }
    }

    let start = start.expect("A starting point should be known at this time.");
    let end = end.expect("A ending point should be known at this time.");

    let mut valid_locations: BTreeSet<(Point, i32)> = Default::default();
    valid_locations.insert((start, 0));

    loop {
        // Move all blizzards
        for blizzard in &mut blizzards {
            blizzard.step();
        }

        let mut new_valid_locations: BTreeSet<(Point, i32)> = Default::default();
        for (current, steps) in &valid_locations {
            // End? Winning!
            if *current == end {
                return *steps + 1;
            }

            // In a blizzard
            if blizzards.iter().any(|b| b.position == *current) {
                continue;
            }

            // A wall
            if *current != start
                && (current.row == 0
                    || current.row == height - 1
                    || current.col == 0
                    || current.col == width - 1)
            {
                continue;
            }

            new_valid_locations.insert((current.north(), steps + 1));
            new_valid_locations.insert((current.south(), steps + 1));
            new_valid_locations.insert((current.west(), steps + 1));
            new_valid_locations.insert((current.east(), steps + 1));
            new_valid_locations.insert((*current, steps + 1));
        }

        valid_locations = new_valid_locations;
    }
}

pub fn part_2(data: &str) -> i32 {
    let width = data.lines().next().map(|x| x.len()).unwrap() as i32;
    let height = data.lines().count() as i32;

    let mut blizzards = vec![];
    let mut start: Option<Point> = None;
    let mut end: Option<Point> = None;

    let mut routes_todo = 3;

    for (row_idx, row) in data.lines().enumerate() {
        for (col_idx, value) in row.chars().enumerate() {
            let position = Point::new(row_idx as i32, col_idx as i32);

            match value {
                // Wall
                '#' => {}
                // Ground
                '.' => {
                    if start.is_none() {
                        start = Some(position)
                    } else {
                        end = Some(position)
                    }
                }
                // Blizzards
                '>' => blizzards.push(Blizzard {
                    area_width: width,
                    area_height: height,
                    position,
                    direction: Direction::East,
                }),
                'v' => blizzards.push(Blizzard {
                    area_width: width,
                    area_height: height,
                    position,
                    direction: Direction::South,
                }),
                '<' => blizzards.push(Blizzard {
                    area_width: width,
                    area_height: height,
                    position,
                    direction: Direction::West,
                }),
                '^' => blizzards.push(Blizzard {
                    area_width: width,
                    area_height: height,
                    position,
                    direction: Direction::North,
                }),
                _ => unreachable!(),
            }
        }
    }

    let start = start.expect("A starting point should be known at this time.");
    let end = end.expect("A ending point should be known at this time.");

    let mut from = start;
    let mut to = end;

    let mut valid_locations: BTreeSet<(Point, i32)> = Default::default();
    valid_locations.insert((from, 0));

    loop {
        // Move all blizzards
        for blizzard in &mut blizzards {
            blizzard.step();
        }

        let mut new_valid_locations: BTreeSet<(Point, i32)> = Default::default();
        for (current, steps) in &valid_locations {
            // Shoot... forgot my snacks!
            if *current == to && routes_todo == 3 {
                to = start;
                from = end;
                routes_todo -= 1;

                new_valid_locations.clear();
                new_valid_locations.insert((*current, steps + 1));
                break;
            }

            // Ah, found my snacks, time to go!
            if *current == to && routes_todo == 2 {
                to = end;
                from = start;
                routes_todo -= 1;

                new_valid_locations.clear();
                new_valid_locations.insert((*current, steps + 1));
                break;
            }

            // We arrived!
            if *current == to && routes_todo == 1 {
                return *steps + 1;
            }

            // In a blizzard
            if blizzards.iter().any(|b| b.position == *current) {
                continue;
            }

            // A wall
            if *current != from
                && (current.row == 0
                    || current.row == height - 1
                    || current.col == 0
                    || current.col == width - 1)
            {
                continue;
            }

            new_valid_locations.insert((current.east(), steps + 1));
            new_valid_locations.insert((current.north(), steps + 1));
            new_valid_locations.insert((current.south(), steps + 1));
            new_valid_locations.insert((current.west(), steps + 1));
            new_valid_locations.insert((*current, steps + 1));
        }

        valid_locations = new_valid_locations;
    }
}

#[derive(Debug)]
struct Blizzard {
    area_width: i32,
    area_height: i32,
    position: Point,
    direction: Direction,
}

impl Blizzard {
    fn step(&mut self) {
        match self.direction {
            Direction::North => {
                if self.position.row == 1 {
                    self.position.row = self.area_height - 2;
                } else {
                    self.position.row -= 1;
                }
            }
            Direction::East => {
                if self.position.col == self.area_width - 2 {
                    self.position.col = 1;
                } else {
                    self.position.col += 1;
                }
            }
            Direction::South => {
                if self.position.row == self.area_height - 2 {
                    self.position.row = 1;
                } else {
                    self.position.row += 1;
                }
            }
            Direction::West => {
                if self.position.col == 1 {
                    self.position.col = self.area_width - 2;
                } else {
                    self.position.col -= 1;
                }
            }
        }
    }
}

#[derive(Debug, PartialOrd, Ord, PartialEq, Eq, Clone, Copy, Hash)]
struct Point {
    row: i32,
    col: i32,
}

impl Point {
    fn new(row: i32, col: i32) -> Self {
        Self { row, col }
    }

    fn north(&self) -> Self {
        Point::new(self.row - 1, self.col)
    }

    fn east(&self) -> Self {
        Point::new(self.row, self.col + 1)
    }

    fn south(&self) -> Self {
        Point::new(self.row + 1, self.col)
    }

    fn west(&self) -> Self {
        Point::new(self.row, self.col - 1)
    }
}

#[derive(Debug, Clone, Copy)]
enum Direction {
    North,
    East,
    South,
    West,
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2022-24.sample.txt");

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), 18);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 326);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(part_2(SAMPLE), 54);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 976);
    }
}
