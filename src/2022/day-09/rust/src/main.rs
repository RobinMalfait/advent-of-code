use std::collections::BTreeSet;
use std::{str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-09.txt");

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

pub fn part_1(data: &str) -> usize {
    solve(data, 1)
}

pub fn part_2(data: &str) -> usize {
    solve(data, 9)
}

fn solve(data: &str, tail_size: usize) -> usize {
    let motions: Vec<Motion> = data.lines().flat_map(|line| line.parse()).collect();

    let mut seen: BTreeSet<Point> = Default::default();
    let mut tail = vec![Point::default(); tail_size + 1];

    for Motion { direction, steps } in motions {
        for _ in 0..steps {
            // Move head
            match direction {
                Direction::Up => tail[0].y -= 1,
                Direction::Right => tail[0].x += 1,
                Direction::Down => tail[0].y += 1,
                Direction::Left => tail[0].x -= 1,
            }

            // Adjust tail
            for i in 1..tail.len() {
                if tail[i].touches(&tail[i - 1]) {
                    break;
                }

                tail[i].x += (tail[i - 1].x - tail[i].x).signum();
                tail[i].y += (tail[i - 1].y - tail[i].y).signum();
            }

            // Store tail history
            if let Some(tail_end) = tail.last() {
                seen.insert(*tail_end);
            }
        }
    }

    seen.len()
}

#[derive(Debug)]
enum Direction {
    Up,
    Right,
    Down,
    Left,
}

impl FromStr for Direction {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "U" => Direction::Up,
            "R" => Direction::Right,
            "D" => Direction::Down,
            "L" => Direction::Left,
            _ => return Err(()),
        })
    }
}

#[derive(Debug)]
struct Motion {
    direction: Direction,
    steps: i32,
}

impl FromStr for Motion {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s.trim().split_once(' ') {
            Some((raw_dir, raw_steps)) => Motion {
                direction: raw_dir.parse()?,
                steps: raw_steps.parse::<i32>().unwrap_or(0),
            },
            None => return Err(()),
        })
    }
}

#[derive(Debug, Clone, Default, PartialEq, Eq, PartialOrd, Ord, Copy)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn touches(&self, other: &Point) -> bool {
        self.x.abs_diff(other.x) <= 1 && self.y.abs_diff(other.y) <= 1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            R 4
            U 4
            L 3
            D 1
            R 4
            D 1
            L 5
            R 2
        "#;

        assert_eq!(part_1(data), 13);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 6023);
    }

    #[test]
    fn part_2_sample_1() {
        let data = r#"
            R 4
            U 4
            L 3
            D 1
            R 4
            D 1
            L 5
            R 2
        "#;

        assert_eq!(part_2(data), 1);
    }

    #[test]
    fn part_2_sample_2() {
        let data = r#"
            R 5
            U 8
            L 8
            D 3
            R 17
            D 10
            L 25
            U 20
        "#;

        assert_eq!(part_2(data), 36);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 2533);
    }
}
