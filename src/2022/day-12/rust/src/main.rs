use std::collections::hash_map::HashMap;
use std::collections::VecDeque;
use std::hash::Hash;
use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2022-12.txt");

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

const START: u8 = b'S';
const END: u8 = b'E';

pub fn part_1(data: &str) -> i32 {
    solve(data, |value| value == START)
}

pub fn part_2(data: &str) -> i32 {
    solve(data, |value| value == START || value == b'a')
}

fn solve<T>(data: &str, is_valid_starting_position: T) -> i32
where
    T: Fn(u8) -> bool,
{
    let grid: Vec<&[u8]> = data
        .trim()
        .lines()
        .map(|line| line.trim().as_bytes())
        .collect();
    let mut graph: HashMap<Point, Vec<Point>> = Default::default();

    let grid_height = grid.len();
    let grid_width = grid[0].len();

    let mut end_point: Option<Point> = None;

    let mut starting_positions = vec![];

    for (row_idx, row) in grid.iter().enumerate() {
        for (col_idx, value) in row.iter().enumerate() {
            let point = Point::new(col_idx, row_idx);

            if is_valid_starting_position(*value) {
                starting_positions.push(point);
            }

            if value == &END {
                end_point = Some(point)
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

                if val(n_value) <= val(*value) || val(n_value) - val(*value) == 1 {
                    graph.entry(point).and_modify(|neighbours| {
                        neighbours.push(neighbour);
                        neighbours.sort_by(|a, z| val(grid[a.y][a.x]).cmp(&val(grid[z.y][z.x])));
                    });
                }
            }
        }
    }

    let end_point = end_point.expect("There should be an ending point.");

    starting_positions
        .iter()
        .filter_map(|start_point| bfs(&graph, *start_point, end_point))
        .map(|path| path.len() as i32 - 1)
        .min()
        .unwrap()
}

fn val(input: u8) -> u8 {
    match input {
        START => b'a',
        END => b'z',
        _ => input,
    }
}

fn bfs<T>(graph: &HashMap<T, Vec<T>>, start: T, target: T) -> Option<Vec<T>>
where
    T: Hash + PartialEq + Eq + Copy,
{
    let mut parent: HashMap<T, T> = Default::default();
    let mut visited: Vec<T> = vec![];
    visited.push(start);

    let mut queue: VecDeque<T> = Default::default();
    queue.push_back(start);

    while let Some(node) = queue.pop_front() {
        if node == target {
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
