use std::collections::HashMap;
use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2017-03.txt");

const DIRS: [(i32, i32); 8] = [
    (-1, -1),
    (0, -1),
    (1, -1),
    (-1, 0),
    (1, 0),
    (-1, 1),
    (0, 1),
    (1, 1),
];

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
    let amount = data.trim().parse::<i32>().unwrap();

    let mut direction: Direction = Default::default();
    let mut current: Point = Default::default();

    let mut step = 0;
    let mut round = Round::One;
    let mut remaining = amount - 1;

    while remaining > 0 {
        for _ in 0..step {
            // Step in the current direction
            match direction {
                Direction::Right => current.x += 1,
                Direction::Up => current.y -= 1,
                Direction::Left => current.x -= 1,
                Direction::Down => current.y += 1,
            };

            remaining -= 1;

            if remaining == 0 {
                return Point::default().manhatten_distance_to(&current);
            }
        }

        // Rotate left
        direction = match direction {
            Direction::Right => Direction::Up,
            Direction::Up => Direction::Left,
            Direction::Left => Direction::Down,
            Direction::Down => Direction::Right,
        };

        match round {
            Round::One => {
                // 1 more round to go!
                round = Round::Two;
            }
            Round::Two => {
                // Increase Step
                step += 1;

                // Go back to round one
                round = Round::One;
            }
        }
    }

    Point::default().manhatten_distance_to(&current)
}

pub fn part_2(data: &str) -> i32 {
    let amount = data.trim().parse::<i32>().unwrap();

    let mut direction: Direction = Default::default();
    let mut current: Point = Default::default();

    let mut step = 0;
    let mut round = Round::One;

    let mut grid: HashMap<Point, i32> = Default::default();
    grid.insert(current, 1);

    loop {
        for _ in 0..step {
            // Step in the current direction
            match direction {
                Direction::Right => current.x += 1,
                Direction::Up => current.y -= 1,
                Direction::Left => current.x -= 1,
                Direction::Down => current.y += 1,
            };

            let value = DIRS
                .iter()
                .map(|(dx, dy)| Point {
                    x: current.x + *dx,
                    y: current.y + *dy,
                })
                .filter_map(|p| grid.get(&p))
                .sum();

            if value > amount {
                return value;
            }

            grid.insert(current, value);
        }

        // Rotate left
        direction = match direction {
            Direction::Right => Direction::Up,
            Direction::Up => Direction::Left,
            Direction::Left => Direction::Down,
            Direction::Down => Direction::Right,
        };

        match round {
            Round::One => {
                // 1 more round to go!
                round = Round::Two;
            }
            Round::Two => {
                // Increase Step
                step += 1;

                // Go back to round one
                round = Round::One;
            }
        }
    }
}

#[derive(Debug)]
enum Round {
    One,
    Two,
}

#[derive(Debug, Default, PartialEq, Eq, Hash, Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn manhatten_distance_to(&self, other: &Point) -> i32 {
        (self.x.abs_diff(other.x) + self.y.abs_diff(other.y)) as i32
    }
}

#[derive(Debug, Default)]
enum Direction {
    #[default]
    Right,
    Up,
    Left,
    Down,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1("1"), 0);
        assert_eq!(part_1("12"), 3);
        assert_eq!(part_1("23"), 2);
        assert_eq!(part_1("1024"), 31);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 480);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(part_2("1"), 2);
        assert_eq!(part_2("2"), 4);
        assert_eq!(part_2("3"), 4);
        assert_eq!(part_2("4"), 5);
        assert_eq!(part_2("5"), 10);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 349975);
    }
}
