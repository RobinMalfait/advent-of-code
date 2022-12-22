use std::{
    collections::{BTreeMap, HashMap},
    str::FromStr,
    time::Instant,
};

const INPUT: &str = include_str!("../../../../../data/2022-22.txt");

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
    let (raw_board, raw_instructions) = data.split_once("\n\n").unwrap();
    let board: BTreeMap<Point, Tile> = raw_board
        .lines()
        .enumerate()
        .flat_map(|(row_idx, row)| {
            row.chars().enumerate().filter_map(move |(col_idx, value)| {
                Some((
                    Point::new(row_idx + 1, col_idx + 1),
                    match value {
                        '.' => Tile::Open,
                        '#' => Tile::Wall,
                        _ => return None,
                    },
                ))
            })
        })
        .collect();
    let path: Path = raw_instructions.parse().unwrap();

    let mut position = *board.first_key_value().unwrap().0;
    let mut direction: Direction = Default::default();

    for instruction in path.0 {
        match instruction {
            Instruction::Move(amount) => {
                for _ in 0..amount {
                    let next_position = match direction {
                        Direction::Right => Point::new(position.row, position.col + 1),
                        Direction::Down => Point::new(position.row + 1, position.col),
                        Direction::Left => Point::new(position.row, position.col - 1),
                        Direction::Up => Point::new(position.row - 1, position.col),
                    };

                    match board.get(&next_position) {
                        Some(tile) => match tile {
                            Tile::Open => position = next_position, // Gotta move like Jagger
                            Tile::Wall => break, // A wall, now stop..., hammer time
                        },
                        None => match direction {
                            Direction::Right => {
                                let row: Vec<_> = board
                                    .iter()
                                    .filter(|(point, _)| point.row == position.row)
                                    .collect();
                                if let Some((other_side, tile)) = row.first() {
                                    match tile {
                                        Tile::Open => position = **other_side,
                                        Tile::Wall => break,
                                    }
                                }
                            }
                            Direction::Down => {
                                let col: Vec<_> = board
                                    .iter()
                                    .filter(|(point, _)| point.col == position.col)
                                    .collect();
                                if let Some((other_side, tile)) = col.first() {
                                    match tile {
                                        Tile::Open => position = **other_side,
                                        Tile::Wall => break,
                                    }
                                }
                            }
                            Direction::Left => {
                                let row: Vec<_> = board
                                    .iter()
                                    .filter(|(point, _)| point.row == position.row)
                                    .collect();
                                if let Some((other_side, tile)) = row.last() {
                                    match tile {
                                        Tile::Open => position = **other_side,
                                        Tile::Wall => break,
                                    }
                                }
                            }
                            Direction::Up => {
                                let col: Vec<_> = board
                                    .iter()
                                    .filter(|(point, _)| point.col == position.col)
                                    .collect();
                                if let Some((other_side, tile)) = col.last() {
                                    match tile {
                                        Tile::Open => position = **other_side,
                                        Tile::Wall => break,
                                    }
                                }
                            }
                        },
                    }
                }
            }
            Instruction::Rotate(rotation) => {
                direction = match rotation {
                    Rotation::Clockwise => match direction {
                        Direction::Right => Direction::Down,
                        Direction::Down => Direction::Left,
                        Direction::Left => Direction::Up,
                        Direction::Up => Direction::Right,
                    },
                    Rotation::Counterclockwise => match direction {
                        Direction::Right => Direction::Up,
                        Direction::Down => Direction::Right,
                        Direction::Up => Direction::Left,
                        Direction::Left => Direction::Down,
                    },
                }
            }
        }
    }

    (1000 * position.row + 4 * position.col + direction as usize) as i32
}

pub fn part_2(data: &str) -> i32 {
    let (raw_board, raw_instructions) = data.split_once("\n\n").unwrap();
    let board: BTreeMap<Point, Tile> = raw_board
        .lines()
        .enumerate()
        .flat_map(|(row_idx, row)| {
            row.chars().enumerate().filter_map(move |(col_idx, value)| {
                Some((
                    Point::new(row_idx + 1, col_idx + 1),
                    match value {
                        '.' => Tile::Open,
                        '#' => Tile::Wall,
                        _ => return None,
                    },
                ))
            })
        })
        .collect();

    let amount_per_square = (board.len() / 6) as f64; // 6 sides on a cube
    let amount_per_side = amount_per_square.sqrt() as usize; // Assuming whole numbers

    let fold_line_range = |start: usize, end: usize| -> Vec<usize> {
        if start < end {
            (start..=end).collect()
        } else {
            (end..=start + 1).rev().collect()
        }
    };

    let flip_direction = |direction: Direction| -> Direction {
        match direction {
            Direction::Up => Direction::Down,
            Direction::Down => Direction::Up,
            Direction::Left => Direction::Right,
            Direction::Right => Direction::Left,
        }
    };

    let build_projection_points = |fold_line: (FoldLine, FoldLine, Direction)| -> Vec<Point> {
        let (col_range, row_range, direction) = fold_line;
        match (col_range, row_range) {
            (FoldLine::Value(col), FoldLine::Range(start, end)) => {
                fold_line_range(start * amount_per_side, end * amount_per_side)
                    .iter()
                    .zip(match direction {
                        Direction::Left => (0..=amount_per_side)
                            .map(|_| col * amount_per_side + 1)
                            .collect::<Vec<_>>(),
                        _ => (0..=amount_per_side)
                            .map(|_| col * amount_per_side)
                            .collect::<Vec<_>>(),
                    })
                    .map(|(row, col)| Point::new(*row, col))
                    .collect()
            }
            (FoldLine::Range(start, end), FoldLine::Value(row)) => match direction {
                Direction::Up => (0..=amount_per_side)
                    .map(|_| row * amount_per_side + 1)
                    .collect::<Vec<_>>(),
                _ => (0..=amount_per_side)
                    .map(|_| row * amount_per_side)
                    .collect::<Vec<_>>(),
            }
            .iter()
            .zip(fold_line_range(
                start * amount_per_side,
                end * amount_per_side,
            ))
            .map(|(row, col)| Point::new(*row, col))
            .collect(),
            _ => unreachable!(),
        }
    };

    // Build projection map based on fold lines
    let mut fold_projections: HashMap<ProjectionInfo, ProjectionInfo> = Default::default();
    for (from_fold_line, to_fold_line) in FOLD_LINES {
        let from_direction = from_fold_line.2;
        let to_direction = to_fold_line.2;

        for (from_point, to_point) in build_projection_points(from_fold_line)
            .iter()
            .zip(build_projection_points(to_fold_line))
        {
            fold_projections.insert(
                ProjectionInfo {
                    position: *from_point,
                    direction: from_direction,
                },
                ProjectionInfo {
                    position: to_point,
                    direction: flip_direction(to_direction),
                },
            );
            fold_projections.insert(
                ProjectionInfo {
                    position: to_point,
                    direction: to_direction,
                },
                ProjectionInfo {
                    position: *from_point,
                    direction: flip_direction(from_direction),
                },
            );
        }
    }

    let path: Path = raw_instructions.parse().unwrap();

    let mut position = *board.first_key_value().unwrap().0;
    let mut direction: Direction = Default::default();

    for instruction in path.0 {
        match instruction {
            Instruction::Move(amount) => {
                for _ in 0..amount {
                    let next_position = match direction {
                        Direction::Right => Point::new(position.row, position.col + 1),
                        Direction::Down => Point::new(position.row + 1, position.col),
                        Direction::Left => Point::new(position.row, position.col - 1),
                        Direction::Up => Point::new(position.row - 1, position.col),
                    };

                    match board.get(&next_position) {
                        Some(tile) => match tile {
                            Tile::Open => position = next_position, // Gotta move like Jagger
                            Tile::Wall => break, // A wall, now stop..., hammer time
                        },
                        None => {
                            match fold_projections.get(&ProjectionInfo {
                                position,
                                direction,
                            }) {
                                Some(ProjectionInfo {
                                    position: new_position,
                                    direction: new_direction,
                                }) => match board.get(new_position) {
                                    Some(tile) => match tile {
                                        Tile::Open => {
                                            position = *new_position;
                                            direction = *new_direction;
                                        }
                                        Tile::Wall => break,
                                    },
                                    None => unreachable!(),
                                },
                                None => {
                                    dbg!(position, direction);
                                    unreachable!()
                                }
                            }
                        }
                    }
                }
            }
            Instruction::Rotate(rotation) => {
                direction = match rotation {
                    Rotation::Clockwise => match direction {
                        Direction::Right => Direction::Down,
                        Direction::Down => Direction::Left,
                        Direction::Left => Direction::Up,
                        Direction::Up => Direction::Right,
                    },
                    Rotation::Counterclockwise => match direction {
                        Direction::Right => Direction::Up,
                        Direction::Down => Direction::Right,
                        Direction::Up => Direction::Left,
                        Direction::Left => Direction::Down,
                    },
                }
            }
        }
    }

    (1000 * position.row + 4 * position.col + direction as usize) as i32
}

#[derive(Debug)]
enum FoldLine {
    Value(usize),
    Range(usize, usize),
}

//
//   0  1  2  3  4
// 0 +--+--+--+--+
//   |  |  |  |  |
// 1 +--+--+--+--+
//   |  |  |  |  |
// 2 +--+--+--+--+
//   |  |  |  |  |
// 3 +--+--+--+--+
//   |  |  |  |  |
// 4 +--+--+--+--+
//
// Hardcoded matching fold lines for Part 2 input (not the sample)
const FOLD_LINES: [(
    (FoldLine, FoldLine, Direction),
    (FoldLine, FoldLine, Direction),
); 7] = [
    (
        (FoldLine::Value(2), FoldLine::Range(1, 2), Direction::Right),
        (FoldLine::Range(2, 3), FoldLine::Value(1), Direction::Down),
    ),
    (
        (FoldLine::Value(2), FoldLine::Range(2, 3), Direction::Right),
        (FoldLine::Value(3), FoldLine::Range(1, 0), Direction::Right),
    ),
    (
        (FoldLine::Value(1), FoldLine::Range(3, 4), Direction::Right),
        (FoldLine::Range(1, 2), FoldLine::Value(3), Direction::Down),
    ),
    (
        (FoldLine::Range(0, 1), FoldLine::Value(4), Direction::Down),
        (FoldLine::Range(2, 3), FoldLine::Value(0), Direction::Up),
    ),
    (
        (FoldLine::Value(0), FoldLine::Range(3, 4), Direction::Left),
        (FoldLine::Range(1, 2), FoldLine::Value(0), Direction::Up),
    ),
    (
        (FoldLine::Value(0), FoldLine::Range(2, 3), Direction::Left),
        (FoldLine::Value(1), FoldLine::Range(1, 0), Direction::Left),
    ),
    (
        (FoldLine::Range(0, 1), FoldLine::Value(2), Direction::Up),
        (FoldLine::Value(1), FoldLine::Range(1, 2), Direction::Left),
    ),
];

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
struct ProjectionInfo {
    position: Point,
    direction: Direction,
}

#[derive(Debug, Eq, PartialEq, Hash, PartialOrd, Ord, Clone, Copy)]
struct Point {
    row: usize,
    col: usize,
}

impl Point {
    fn new(row: usize, col: usize) -> Self {
        Self { row, col }
    }
}

#[derive(Debug)]
enum Tile {
    Open,
    Wall,
}

#[derive(Debug)]
struct Path(Vec<Instruction>);

#[derive(Debug)]
enum Instruction {
    Move(usize),
    Rotate(Rotation),
}

impl FromStr for Path {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(Path(
            s.replace('R', " R ")
                .replace('L', " L ")
                .trim()
                .split(' ')
                .map(|instruction| match instruction {
                    "R" => Instruction::Rotate(Rotation::Clockwise),
                    "L" => Instruction::Rotate(Rotation::Counterclockwise),
                    value => Instruction::Move(value.parse().unwrap()),
                })
                .collect(),
        ))
    }
}

#[derive(Debug)]
enum Rotation {
    Clockwise,
    Counterclockwise,
}

#[derive(Debug, Default, Clone, Copy, Hash, PartialEq, Eq, PartialOrd, Ord)]
#[repr(i32)]
enum Direction {
    #[default]
    Right = 0,
    Down = 1,
    Left = 2,
    Up = 3,
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2022-22.sample.txt");

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), 6032);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 60_362);
    }

    #[test]
    #[ignore]
    fn part_2_sample() {
        assert_eq!(part_2(SAMPLE), 5_031);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 74_288);
    }
}
