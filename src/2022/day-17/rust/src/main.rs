use std::collections::HashMap;
use std::{collections::VecDeque, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-17.txt");

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

pub fn part_1(data: &str) -> u128 {
    solve(data, 2022)
}

pub fn part_2(data: &str) -> u128 {
    solve(data, 1_000_000_000_000)
}

// The tall, vertical chamber is exactly seven units wide. Each rock appears so that its left
// edge is two units away from the left wall and its bottom edge is three units above the
// highest rock in the room (or the floor, if there isn't one).
const SPACE_BETWEEN: usize = 3;

const TOTAL_SHAPES: usize = 5;

fn solve(data: &str, rocks: u128) -> u128 {
    let directions: Vec<Direction> = data
        .trim()
        .split("")
        .filter_map(|x| x.parse().ok())
        .collect();

    let mut game: Game = Default::default();

    let mut direction_idx = 0;
    let mut seen_patterns: HashMap<(usize, ShapeType, Vec<i32>), (u128, u128)> = Default::default();

    let mut dropped_rocks = 0;
    let mut additional = 0;

    while dropped_rocks < rocks {
        // Drop all empty top layers
        let empty_top_layers = game.board.iter().take_while(|x| **x == 0).count();
        for _ in 0..empty_top_layers {
            game.board.pop_front();
        }

        // Ensure the default empty space exists
        for _ in 0..SPACE_BETWEEN {
            game.board.push_front(0b0000000);
        }

        // Make enough room for the current piece to fit on top
        for _ in 0..game.current_shape.layout.len() {
            game.board.push_front(0b0000000);
        }

        let mut offset = 0;

        // Let's dance
        loop {
            if let Some(direction) = directions.get(direction_idx) {
                direction_idx = (direction_idx + 1) % directions.len();

                // Jet does pushy pushy
                match direction {
                    Direction::Left => {
                        let mut can_move = true;
                        for (idx, line) in game.current_shape.layout.iter().enumerate() {
                            if line & 0b1000000 > 0 || game.board[offset + idx] & (line << 1) > 0 {
                                can_move = false;
                                break;
                            }
                        }

                        if can_move {
                            for line in &mut game.current_shape.layout {
                                *line <<= 1;
                            }
                        }
                    }
                    Direction::Right => {
                        let mut can_move = true;
                        for (idx, line) in game.current_shape.layout.iter().enumerate() {
                            if line & 0b0000001 > 0 || game.board[offset + idx] & (line >> 1) > 0 {
                                can_move = false;
                                break;
                            }
                        }

                        if can_move {
                            for line in &mut game.current_shape.layout {
                                *line >>= 1;
                            }
                        }
                    }
                }

                // Drop it like it's hot
                let mut can_go_down = true;
                for (idx, line) in game.current_shape.layout.iter().enumerate() {
                    let next_row_idx = (offset + 1) + idx;
                    if next_row_idx >= game.board.len() {
                        can_go_down = false;
                        break;
                    }

                    if line & game.board[next_row_idx] > 0 {
                        can_go_down = false;
                        break;
                    }
                }

                if !can_go_down {
                    for (idx, line) in game.current_shape.layout.iter().enumerate() {
                        game.board[offset + idx] |= line;
                    }

                    let board_pattern = game
                        .board
                        .iter()
                        .skip_while(|x| **x == 0)
                        .take(TOTAL_SHAPES + SPACE_BETWEEN)
                        .map(|x| x.to_owned())
                        .collect::<Vec<_>>();

                    if board_pattern.len() == (TOTAL_SHAPES + SPACE_BETWEEN) {
                        let pattern = (direction_idx, game.current_shape.shape_type, board_pattern);

                        if let Some((old_dropped_rocks, previous_height)) =
                            seen_patterns.get(&pattern)
                        {
                            let delta_height = game.height() - previous_height;
                            let delta_dropped_rocks = dropped_rocks - old_dropped_rocks;
                            let factor = (rocks - dropped_rocks) / delta_dropped_rocks;
                            additional += factor * delta_height;
                            dropped_rocks += factor * delta_dropped_rocks;
                        }

                        seen_patterns.insert(pattern, (dropped_rocks, game.height()));
                    }
                    break;
                } else {
                    offset += 1;
                }
            }
        }

        // Next shape!
        game.next_shape();
        dropped_rocks += 1;
    }

    game.height() + additional
}

#[derive(Debug)]
struct Game {
    board: VecDeque<i32>,
    current_shape: Shape,
}

impl Game {
    fn height(&self) -> u128 {
        (self.board.len() - self.board.iter().position(|row| *row > 1).unwrap_or(0)) as u128
    }

    fn next_shape(&mut self) {
        self.current_shape = self.current_shape.next();
    }

    fn _visualize(&self) {
        println!();
        for line in self.board.iter() {
            println!(
                "{}",
                format!("|{:07b}|", line)
                    .replace('1', "#")
                    .replace('0', ".")
            );
        }
        println!("+{:7}+", "-".repeat(7));
    }
}

impl Default for Game {
    fn default() -> Self {
        Self {
            board: Default::default(),
            current_shape: Shape::new(ShapeType::Horizontal),
        }
    }
}

#[derive(Debug)]
struct Shape {
    shape_type: ShapeType,
    layout: Vec<i32>,
}

#[derive(Debug, Hash, PartialEq, Eq, Clone, Copy)]
enum ShapeType {
    Horizontal,
    Cross,
    J,
    Vertical,
    Square,
}

impl Shape {
    fn new(shape_type: ShapeType) -> Self {
        let layout = match &shape_type {
            // All the `>> 2` are becuase of this:
            // Each rock appears so that its left edge is two units away from the left wall.
            ShapeType::Horizontal => vec![
                0b1111000 >> 2, //
            ],
            ShapeType::Cross => vec![
                0b0100000 >> 2, //
                0b1110000 >> 2, //
                0b0100000 >> 2, //
            ],
            ShapeType::J => vec![
                0b0010000 >> 2, //
                0b0010000 >> 2, //
                0b1110000 >> 2, //
            ],
            ShapeType::Vertical => vec![
                0b1000000 >> 2, //
                0b1000000 >> 2, //
                0b1000000 >> 2, //
                0b1000000 >> 2, //
            ],
            ShapeType::Square => vec![
                0b1100000 >> 2, //
                0b1100000 >> 2, //
            ],
        };

        Shape { shape_type, layout }
    }

    fn next(&self) -> Self {
        match self.shape_type {
            ShapeType::Horizontal => Shape::new(ShapeType::Cross),
            ShapeType::Cross => Shape::new(ShapeType::J),
            ShapeType::J => Shape::new(ShapeType::Vertical),
            ShapeType::Vertical => Shape::new(ShapeType::Square),
            ShapeType::Square => Shape::new(ShapeType::Horizontal),
        }
    }
}

#[derive(Debug, Clone, Copy, Eq, Hash, PartialEq)]
enum Direction {
    Left,
    Right,
}

impl FromStr for Direction {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "<" => Direction::Left,
            ">" => Direction::Right,
            _ => return Err(()),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>"#;

        assert_eq!(part_1(data), 3068);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 3098);
    }

    #[test]
    fn part_2_sample() {
        let data = r#">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>"#;

        assert_eq!(part_2(data), 1_514_285_714_288);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 1_525_364_431_487);
    }
}
