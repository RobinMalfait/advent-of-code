use std::collections::BTreeSet;
use std::{collections::BTreeMap, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-23.txt");

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

const DIRS: [(i32, i32); 8] = [
    (-1, 0),  // N
    (-1, 1),  // NE
    (0, 1),   // E
    (1, 1),   // SE
    (1, 0),   // S
    (1, -1),  // SW
    (0, -1),  // W
    (-1, -1), // NW
];

const GROUPED_DIRS: [[(i32, i32); 3]; 4] = [
    // North check
    [
        (-1, 0),  // N
        (-1, 1),  // NE
        (-1, -1), // NW
    ],
    // South check
    [
        (1, 0),  // S
        (1, 1),  // SE
        (1, -1), // SW
    ],
    // West check
    [
        (0, -1),  // W
        (-1, -1), // NW
        (1, -1),  // SW
    ],
    // East check
    [
        (0, 1),  // E
        (-1, 1), // NE
        (1, 1),  // SE
    ],
];

pub fn part_1(data: &str) -> i32 {
    let mut grove: BTreeSet<Point> = data
        .trim()
        .lines()
        .enumerate()
        .flat_map(|(row_idx, row)| {
            row.trim()
                .chars()
                .enumerate()
                .filter_map(move |(col_idx, value)| match value {
                    '#' => Some(Point::new(row_idx as i32, col_idx as i32)),
                    _ => None,
                })
        })
        .collect();

    for round in 0..10 {
        let mut proposed_moves: BTreeMap<Point, Point> = Default::default();
        let mut target_counts: BTreeMap<Point, usize> = Default::default();

        for point in &grove {
            // If no other Elves are in one of those eight positions, the Elf does not do anything
            // during this round.
            if !DIRS
                .iter()
                .any(|(dr, dc)| grove.contains(&Point::new(point.row + dr, point.col + dc)))
            {
                continue;
            }

            // Otherwise, the Elf looks in each of four directions in the following order and
            // proposes moving one step in the first valid direction:
            let start_idx = round % GROUPED_DIRS.len();
            for offset in 0..GROUPED_DIRS.len() {
                let idx = (start_idx + offset) % GROUPED_DIRS.len();
                let checks = GROUPED_DIRS[idx];
                if checks
                    .iter()
                    .all(|(dr, dc)| !grove.contains(&Point::new(point.row + dr, point.col + dc)))
                {
                    let (dr, dc) = checks[0];
                    let new_point = Point::new(point.row + dr, point.col + dc);
                    target_counts
                        .entry(new_point)
                        .and_modify(|x| *x += 1)
                        .or_insert(1);
                    proposed_moves.insert(*point, new_point);
                    break;
                }
            }
        }

        // Do the move
        for (from_point, to_point) in &proposed_moves {
            if let Some(1) = target_counts.get(to_point) {
                grove.remove(from_point);
                grove.insert(*to_point);
            }
        }
    }

    let min_row = grove.iter().map(|point| point.row).min().unwrap();
    let max_row = grove.iter().map(|point| point.row).max().unwrap();
    let min_col = grove.iter().map(|point| point.col).min().unwrap();
    let max_col = grove.iter().map(|point| point.col).max().unwrap();

    ((max_row - min_row + 1) * (max_col - min_col + 1)) - grove.len() as i32
}

pub fn part_2(data: &str) -> i32 {
    let mut grove: BTreeSet<Point> = data
        .trim()
        .lines()
        .enumerate()
        .flat_map(|(row_idx, row)| {
            row.trim()
                .chars()
                .enumerate()
                .filter_map(move |(col_idx, value)| match value {
                    '#' => Some(Point::new(row_idx as i32, col_idx as i32)),
                    _ => None,
                })
        })
        .collect();

    let mut round = 0;

    loop {
        let mut proposed_moves: BTreeMap<Point, Point> = Default::default();
        let mut target_counts: BTreeMap<Point, usize> = Default::default();

        for point in &grove {
            // If no other Elves are in one of those eight positions, the Elf does not do anything
            // during this round.
            if !DIRS
                .iter()
                .any(|(dr, dc)| grove.contains(&Point::new(point.row + dr, point.col + dc)))
            {
                continue;
            }

            // Otherwise, the Elf looks in each of four directions in the following order and
            // proposes moving one step in the first valid direction:
            let start_idx = round % GROUPED_DIRS.len();
            for offset in 0..GROUPED_DIRS.len() {
                let idx = (start_idx + offset) % GROUPED_DIRS.len();
                let checks = GROUPED_DIRS[idx];
                if checks
                    .iter()
                    .all(|(dr, dc)| !grove.contains(&Point::new(point.row + dr, point.col + dc)))
                {
                    let (dr, dc) = checks[0];
                    let new_point = Point::new(point.row + dr, point.col + dc);
                    target_counts
                        .entry(new_point)
                        .and_modify(|x| *x += 1)
                        .or_insert(1);
                    proposed_moves.insert(*point, new_point);
                    break;
                }
            }
        }

        if proposed_moves.is_empty() {
            return round as i32 + 1;
        }

        // Do the move
        for (from_point, to_point) in &proposed_moves {
            if let Some(1) = target_counts.get(to_point) {
                grove.remove(from_point);
                grove.insert(*to_point);
            }
        }

        round += 1;
    }
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Clone, Copy)]
struct Point {
    row: i32,
    col: i32,
}

impl Point {
    fn new(row: i32, col: i32) -> Self {
        Point { row, col }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2022-23.sample.txt");

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), 110);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 4034);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(part_2(SAMPLE), 20);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 960);
    }
}
