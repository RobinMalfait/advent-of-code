use std::{
    collections::{HashSet, VecDeque},
    time::Instant,
};

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

    // Pre-compute blizzard locations
    let mut blizzard_locations: Vec<HashSet<Point>> = Default::default();
    for _ in 0..width * height {
        let mut state: HashSet<Point> = Default::default();

        // Move all blizzards
        for blizzard in &mut blizzards {
            blizzard.step();
            state.insert(blizzard.position);
        }

        blizzard_locations.push(state);
    }

    type Time = usize;
    let mut q: VecDeque<(Point, Time)> = [(start, 0)].into();
    let mut seen: HashSet<(Point, Time)> = Default::default();

    while let Some(state) = q.pop_front() {
        if seen.contains(&state) {
            continue;
        }

        let (point, time) = state;

        // End? Winning!
        if point == end {
            return time as i32 + 1;
        }

        // A wall
        if point != start
            && (point.row <= 0
                || point.row >= height - 1
                || point.col <= 0
                || point.col >= width - 1)
        {
            continue;
        }

        // In a blizzard
        let blizzards = &blizzard_locations[time % blizzard_locations.len()];
        if blizzards.contains(&point) {
            continue;
        }

        seen.insert(state);

        q.push_back((point.north(), time + 1));
        q.push_back((point.south(), time + 1));
        q.push_back((point.west(), time + 1));
        q.push_back((point.east(), time + 1));
        q.push_back((point, time + 1));
    }

    unreachable!();
}

pub fn part_2(data: &str) -> i32 {
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

    // Pre-compute blizzard locations
    let mut blizzard_locations: Vec<HashSet<Point>> = Default::default();
    for _ in 0..width * height {
        let mut state: HashSet<Point> = Default::default();

        // Move all blizzards
        for blizzard in &mut blizzards {
            blizzard.step();
            state.insert(blizzard.position);
        }

        blizzard_locations.push(state);
    }

    type Time = usize;
    type Rounds = usize;

    let mut q: VecDeque<(Point, Time, Rounds)> = [(start, 0, 3)].into();
    let mut seen: HashSet<(Point, Time, Rounds)> = Default::default();

    while let Some(state) = q.pop_front() {
        if seen.contains(&state) {
            continue;
        }

        let (point, time, rounds) = state;

        // We arrived!
        if rounds == 1 && point == end {
            return time as i32 + 1;
        }

        // Ah, found my snacks, time to go!
        if rounds == 2 && point == start {
            seen.clear();
            q.push_back((point, time + 1, rounds - 1));
            continue;
        }

        // Shoot... forgot my snacks!
        if rounds == 3 && point == end {
            seen.clear();
            q.push_back((point, time + 1, rounds - 1));
            continue;
        }

        // A wall
        if match rounds {
            1 | 3 => point != start,
            2 => point != end,
            _ => unreachable!(),
        } && (point.row <= 0
            || point.row >= height - 1
            || point.col <= 0
            || point.col >= width - 1)
        {
            continue;
        }

        // In a blizzard
        let blizzards = &blizzard_locations[time % blizzard_locations.len()];
        if blizzards.contains(&point) {
            continue;
        }

        seen.insert(state);

        q.push_back((point.east(), time + 1, rounds));
        q.push_back((point.north(), time + 1, rounds));
        q.push_back((point.south(), time + 1, rounds));
        q.push_back((point.west(), time + 1, rounds));
        q.push_back((point, time + 1, rounds));
    }

    unreachable!();
}

#[derive(Debug, Clone)]
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
