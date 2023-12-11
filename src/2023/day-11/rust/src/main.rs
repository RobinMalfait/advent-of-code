use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2023-11.txt");

fn main() {
    let now = Instant::now();
    let part_1_result = part_1(INPUT, 2);
    let duration = now.elapsed();
    println!("Part 1: {:<20}(took: {:>12?})", part_1_result, duration);

    let now = Instant::now();
    let part_2_result = part_1(INPUT, 1_000_000);
    let duration = now.elapsed();
    println!("Part 2: {:<20}(took: {:>12?})", part_2_result, duration);
}

pub fn part_1(data: &str, expansion: i64) -> i64 {
    let (old_locations, rows, cols) = parse(data);

    let locations = old_locations
        .iter()
        .map(|location| {
            let row_factor = rows.iter().filter(|row| **row < location.y).count() as i64;
            let col_factor = cols.iter().filter(|col| **col < location.x).count() as i64;

            Point::new(
                location.x + col_factor * (expansion - 1),
                location.y + row_factor * (expansion - 1),
            )
        })
        .collect::<Vec<_>>();

    pairs(&locations)
        .iter()
        .map(|(a, b)| a.manhattan_distance_to(b))
        .sum()
}

fn parse(data: &str) -> (Vec<Point>, Vec<i64>, Vec<i64>) {
    let grid = data
        .trim()
        .lines()
        .map(|line| {
            line.trim()
                .chars()
                .map(|c| match c {
                    '.' => Type::Empty,
                    '#' => Type::Galaxy,
                    _ => panic!("Unknown type: {}", c),
                })
                .collect::<Vec<_>>()
        })
        .collect::<Vec<Vec<_>>>();

    let rows = grid
        .iter()
        .enumerate()
        .filter_map(|(row, cols)| {
            if cols.iter().all(|col| *col == Type::Empty) {
                Some(row as i64)
            } else {
                None
            }
        })
        .collect::<Vec<_>>();

    let cols = transpose(&grid)
        .iter()
        .enumerate()
        .filter_map(|(col, rows)| {
            if rows.iter().all(|row| *row == Type::Empty) {
                Some(col as i64)
            } else {
                None
            }
        })
        .collect::<Vec<_>>();

    let locations = grid
        .iter()
        .enumerate()
        .flat_map(|(row, cols)| {
            cols.iter().enumerate().flat_map(move |(col, c)| match c {
                Type::Galaxy => Some(Point::new(col as i64, row as i64)),
                Type::Empty => None,
            })
        })
        .collect::<Vec<_>>();

    (locations, rows, cols)
}

fn pairs<T>(items: &[T]) -> Vec<(&T, &T)> {
    let mut result = vec![];

    for (i, a) in items.iter().enumerate() {
        for b in items.iter().skip(i + 1) {
            result.push((a, b));
        }
    }

    result
}

fn transpose<T>(grid: &[Vec<T>]) -> Vec<Vec<T>>
where
    T: Clone,
{
    let mut result = vec![vec![]; grid[0].len()];

    for row in grid {
        for (col, value) in row.iter().enumerate() {
            result[col].push(value.clone());
        }
    }

    result
}

#[derive(Debug, PartialEq, Eq, Clone)]
enum Type {
    Empty,
    Galaxy,
}

#[derive(Debug)]
struct Point {
    x: i64,
    y: i64,
}

impl Point {
    fn new(x: i64, y: i64) -> Self {
        Self { x, y }
    }

    fn manhattan_distance_to(&self, other: &Self) -> i64 {
        (self.x - other.x).abs() + (self.y - other.y).abs()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            ...#......
            .......#..
            #.........
            ..........
            ......#...
            .#........
            .........#
            ..........
            .......#..
            #...#.....
        "#;

        assert_eq!(part_1(data, 2), 374);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT, 2), 9312968);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            ...#......
            .......#..
            #.........
            ..........
            ......#...
            .#........
            .........#
            ..........
            .......#..
            #...#.....
        "#;

        assert_eq!(part_1(data, 10), 1030);
        assert_eq!(part_1(data, 100), 8410);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_1(INPUT, 1_000_000), 597_714_117_556);
    }
}
