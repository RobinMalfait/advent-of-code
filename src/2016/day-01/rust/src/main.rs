use core::str::FromStr;
use std::collections::{HashSet, VecDeque};
use std::num::ParseIntError;
use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2016-01.txt");

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
    let instructions: Vec<_> = data
        .trim()
        .split(", ")
        .flat_map(|raw_instruction| raw_instruction.parse::<Instruction>().ok())
        .collect();

    let mut direction: Direction = Default::default();
    let mut position: Coord = Default::default();

    for instruction in instructions {
        let distance = match instruction {
            Instruction::TurnLeft(distance) => {
                direction = match direction {
                    Direction::North => Direction::West,
                    Direction::West => Direction::South,
                    Direction::South => Direction::East,
                    Direction::East => Direction::North,
                };
                distance
            }
            Instruction::TurnRight(distance) => {
                direction = match direction {
                    Direction::North => Direction::East,
                    Direction::East => Direction::South,
                    Direction::South => Direction::West,
                    Direction::West => Direction::North,
                };
                distance
            }
        };

        match direction {
            Direction::North => position.y -= distance,
            Direction::East => position.x += distance,
            Direction::South => position.y += distance,
            Direction::West => position.x -= distance,
        }
    }

    position.x.abs() + position.y.abs()
}

pub fn part_2(data: &str) -> i32 {
    let mut instructions: VecDeque<_> = data
        .trim()
        .split(", ")
        .flat_map(|raw_instruction| raw_instruction.parse::<Instruction>().ok())
        .collect();

    let mut direction: Direction = Default::default();
    let mut position: Coord = Default::default();

    let mut seen: HashSet<Coord> = Default::default();
    seen.insert(position);

    while let Some(instruction) = instructions.pop_front() {
        instructions.push_back(instruction);

        let distance = match instruction {
            Instruction::TurnLeft(distance) => {
                direction = match direction {
                    Direction::North => Direction::West,
                    Direction::West => Direction::South,
                    Direction::South => Direction::East,
                    Direction::East => Direction::North,
                };
                distance
            }
            Instruction::TurnRight(distance) => {
                direction = match direction {
                    Direction::North => Direction::East,
                    Direction::East => Direction::South,
                    Direction::South => Direction::West,
                    Direction::West => Direction::North,
                };
                distance
            }
        };

        for _ in 0..distance {
            match direction {
                Direction::North => position.y -= 1,
                Direction::East => position.x += 1,
                Direction::South => position.y += 1,
                Direction::West => position.x -= 1,
            }

            if seen.contains(&position) {
                return position.x.abs() + position.y.abs();
            }

            seen.insert(position);
        }
    }

    unreachable!()
}

#[derive(Debug, Default, PartialEq, Eq, Hash, Clone, Copy)]
struct Coord {
    x: i32,
    y: i32,
}

#[derive(Default, Debug)]
enum Direction {
    #[default]
    North,
    East,
    South,
    West,
}

#[derive(Debug, Copy, Clone)]
enum Instruction {
    TurnLeft(i32),
    TurnRight(i32),
}

impl FromStr for Instruction {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (turn, distance) = s.split_at(1);
        let distance = distance.parse()?;
        Ok(match turn {
            "L" => Instruction::TurnLeft(distance),
            "R" => Instruction::TurnRight(distance),
            _ => unreachable!(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1("R2, L3"), 5);
        assert_eq!(part_1("R2, R2, R2"), 2);
        assert_eq!(part_1("R5, L5, R5, R3"), 12);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 161);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(part_2("R8, R4, R4, R8"), 4);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 110);
    }
}
