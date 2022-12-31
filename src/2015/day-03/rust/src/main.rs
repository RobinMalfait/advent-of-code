use std::{collections::HashSet, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2015-03.txt");

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
    let moves = data
        .trim()
        .chars()
        .map(|c| match c {
            '^' => Direction::North,
            '>' => Direction::East,
            'v' => Direction::South,
            '<' => Direction::West,
            _ => unreachable!(),
        })
        .collect::<Vec<_>>();

    let mut current: Point = Default::default();
    let mut seen: HashSet<Point> = Default::default();

    seen.insert(current);

    for dir in moves {
        match dir {
            Direction::North => current.y -= 1,
            Direction::East => current.x += 1,
            Direction::South => current.y += 1,
            Direction::West => current.x -= 1,
        };

        seen.insert(current);
    }

    seen.len() as i32
}

pub fn part_2(data: &str) -> i32 {
    let moves = data
        .trim()
        .chars()
        .map(|c| match c {
            '^' => Direction::North,
            '>' => Direction::East,
            'v' => Direction::South,
            '<' => Direction::West,
            _ => unreachable!(),
        })
        .collect::<Vec<_>>();

    let mut santa: Point = Default::default();
    let mut robo_santa: Point = Default::default();
    let mut seen: HashSet<Point> = Default::default();

    seen.insert(santa);
    seen.insert(robo_santa);

    for (idx, dir) in moves.iter().enumerate() {
        let mut current = match idx % 2 == 0 {
            true => &mut santa,
            false => &mut robo_santa,
        };

        match dir {
            Direction::North => current.y -= 1,
            Direction::East => current.x += 1,
            Direction::South => current.y += 1,
            Direction::West => current.x -= 1,
        };

        seen.insert(*current);
    }

    seen.len() as i32
}

#[derive(Debug, Default, PartialEq, Eq, Hash, Clone, Copy)]
struct Point {
    x: isize,
    y: isize,
}

#[derive(Debug)]
enum Direction {
    North,
    East,
    South,
    West,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#">"#;

        assert_eq!(part_1(data), 2);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 2592);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"^v"#;

        assert_eq!(part_2(data), 3);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 2360);
    }
}
