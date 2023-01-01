use std::{collections::BTreeMap, num::ParseIntError, str::FromStr, time::Instant};

use itertools::iproduct;

const INPUT: &str = include_str!("../../../../../data/2015-06.txt");

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
    let instructions = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse::<Instruction>().ok())
        .collect::<Vec<_>>();

    let mut grid: BTreeMap<Point, State> = Default::default();

    for instruction in instructions {
        match instruction {
            Instruction::On(from, to) => {
                for (x, y) in iproduct!(from.x..=to.x, from.y..=to.y) {
                    grid.insert(Point { x, y }, State::On);
                }
            }
            Instruction::Off(from, to) => {
                for (x, y) in iproduct!(from.x..=to.x, from.y..=to.y) {
                    grid.insert(Point { x, y }, State::Off);
                }
            }
            Instruction::Toggle(from, to) => {
                for (x, y) in iproduct!(from.x..=to.x, from.y..=to.y) {
                    grid.entry(Point { x, y })
                        .and_modify(|x| {
                            *x = match x {
                                State::On => State::Off,
                                State::Off => State::On,
                            }
                        })
                        .or_insert(State::On);
                }
            }
        }
    }

    grid.values().filter(|x| matches!(x, State::On)).count() as i32
}

pub fn part_2(data: &str) -> usize {
    let instructions = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse::<Instruction>().ok())
        .collect::<Vec<_>>();

    let mut grid: BTreeMap<Point, usize> = Default::default();

    for (x, y) in iproduct!(0..=999, 0..=999) {
        grid.insert(Point { x, y }, 0);
    }

    for instruction in instructions {
        match instruction {
            Instruction::On(from, to) => {
                for (x, y) in iproduct!(from.x..=to.x, from.y..=to.y) {
                    grid.entry(Point { x, y }).and_modify(|x| {
                        *x += 1;
                    });
                }
            }
            Instruction::Off(from, to) => {
                for (x, y) in iproduct!(from.x..=to.x, from.y..=to.y) {
                    grid.entry(Point { x, y }).and_modify(|x| {
                        if *x > 0 {
                            *x -= 1;
                        }
                    });
                }
            }
            Instruction::Toggle(from, to) => {
                for (x, y) in iproduct!(from.x..=to.x, from.y..=to.y) {
                    grid.entry(Point { x, y }).and_modify(|x| {
                        *x += 2;
                    });
                }
            }
        }
    }

    grid.values().sum::<usize>()
}

#[derive(Debug)]
enum Instruction {
    On(Point, Point),
    Off(Point, Point),
    Toggle(Point, Point),
}

#[derive(Debug)]
enum State {
    On,
    Off,
}

impl FromStr for Instruction {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s.starts_with("turn on") {
            let s = s.replace("turn on ", "").replace(" through", "");
            if let Some((from, to)) = s.split_once(' ') {
                return Ok(Instruction::On(from.parse()?, to.parse()?));
            }
        }

        if s.starts_with("turn off") {
            let s = s.replace("turn off ", "").replace(" through", "");
            if let Some((from, to)) = s.split_once(' ') {
                return Ok(Instruction::Off(from.parse()?, to.parse()?));
            }
        }

        if s.starts_with("toggle") {
            let s = s.replace("toggle ", "").replace(" through", "");
            if let Some((from, to)) = s.split_once(' ') {
                return Ok(Instruction::Toggle(from.parse()?, to.parse()?));
            }
        }

        unreachable!();
    }
}

#[derive(Debug, PartialOrd, Ord, PartialEq, Eq)]
struct Point {
    x: usize,
    y: usize,
}

impl FromStr for Point {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut x = s.split(',');
        Ok(Point {
            x: x.next().unwrap().parse::<usize>()?,
            y: x.next().unwrap().parse::<usize>()?,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            turn on 0,0 through 999,999
            toggle 0,0 through 999,0
            turn off 499,499 through 500,500
        "#;

        assert_eq!(part_1(data), 998_996);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 377_891);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            turn on 0,0 through 0,0
        "#;

        assert_eq!(part_2(data), 1);

        let data = r#"
            toggle 0,0 through 999,999
        "#;

        assert_eq!(part_2(data), 2_000_000);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 14_110_788);
    }
}
