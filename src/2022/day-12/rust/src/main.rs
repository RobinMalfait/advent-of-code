use std::{
    collections::{HashMap, VecDeque},
    hash::Hash,
    time::Instant,
};

const INPUT: &str = include_str!("../../../../../data/2022-12.txt");

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
    solve(data, b'S', b'E')
}

pub fn part_2(data: &str) -> i32 {
    solve(data, b'E', b'a')
}

fn solve(data: &str, start: u8, target: u8) -> i32 {
    let grid: Vec<&[u8]> = data
        .trim()
        .lines()
        .map(|line| line.trim().as_bytes())
        .collect();
    let mut graph: HashMap<Point, Vec<Point>> = Default::default();

    let grid_height = grid.len();
    let grid_width = grid[0].len();

    let mut start_point: Option<Point> = None;
    let mut possible_targets = vec![];

    for (row_idx, row) in grid.iter().enumerate() {
        for (col_idx, value) in row.iter().enumerate() {
            let point = Point::new(col_idx, row_idx);

            if value == &start {
                start_point = Some(point);
            }

            if value == &target {
                possible_targets.push(point);
            }

            graph.insert(point, vec![]);

            for (dc, dr) in [(0, -1), (1, 0), (0, 1), (-1, 0)] {
                if (col_idx == 0 && dc == -1)
                    || (row_idx == 0 && dr == -1)
                    || (col_idx == grid_width - 1 && dc == 1)
                    || (row_idx == grid_height - 1 && dr == 1)
                {
                    continue;
                }

                let n_col_idx = col_idx + dc as usize;
                let n_row_idx = row_idx + dr as usize;

                let n_value = grid[n_row_idx][n_col_idx];
                let neighbour = Point::new(n_col_idx, n_row_idx);

                if match start > target {
                    true => val(n_value) <= val(*value) || val(n_value) - val(*value) == 1,
                    false => val(*value) <= val(n_value) || val(*value) - val(n_value) == 1,
                } {
                    graph
                        .entry(point)
                        .and_modify(|neighbours| neighbours.push(neighbour));
                }
            }
        }
    }

    let start_point = start_point.expect("There should be a starting point.");
    bfs(&graph, start_point, possible_targets)
        .expect("A path should exist.")
        .len() as i32
        - 1
}

fn val(input: u8) -> u8 {
    match input {
        b'S' => b'a',
        b'E' => b'z',
        _ => input,
    }
}

fn bfs<T>(graph: &HashMap<T, Vec<T>>, start: T, targets: Vec<T>) -> Option<Vec<T>>
where
    T: Hash + PartialEq + Eq + Copy + std::cmp::Ord,
{
    let mut parent: HashMap<T, T> = Default::default();
    let mut visited: Vec<T> = vec![];
    visited.push(start);

    let mut queue: VecDeque<T> = Default::default();
    queue.push_back(start);

    while let Some(node) = queue.pop_front() {
        if targets.contains(&node) {
            let mut path_vec = vec![node];

            let mut current = node;
            while let Some(parent) = parent.get(&current) {
                path_vec.insert(0, *parent);
                current = *parent;
            }

            return Some(path_vec);
        }

        if let Some(neighbours) = graph.get(&node) {
            for neighbour in neighbours {
                if !visited.contains(neighbour) {
                    queue.push_back(*neighbour);
                    parent.insert(*neighbour, node);
                    visited.push(*neighbour);
                }
            }
        }
    }

    None
}

#[derive(Debug, Hash, Clone, Copy, PartialOrd, Ord, PartialEq, Eq)]
struct Point {
    x: usize,
    y: usize,
}

impl Point {
    fn new(x: usize, y: usize) -> Self {
        Point { x, y }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            Sabqponm
            abcryxxl
            accszExk
            acctuvwj
            abdefghi
        "#;

        assert_eq!(part_1(data), 31);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 490);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            Sabqponm
            abcryxxl
            accszExk
            acctuvwj
            abdefghi
        "#;

        assert_eq!(part_2(data), 29);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 488);
    }
}
