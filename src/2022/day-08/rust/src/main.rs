use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2022-08.txt");

fn main() {
    let now = Instant::now();
    let part_1_result = part_1(INPUT);
    let duration = now.elapsed();
    println!("Part 1: {}\t\t(took: {:?})", part_1_result, duration);

    let now = Instant::now();
    let part_2_result = part_2(INPUT);
    let duration = now.elapsed();
    println!("Part 2: {}\t\t(took: {:?})", part_2_result, duration);
}

pub fn part_1(data: &str) -> i32 {
    let grid = data
        .trim()
        .lines()
        .map(|line| line.trim())
        .map(|line| line.chars().flat_map(|x| x.to_digit(10)).collect())
        .collect::<Vec<Vec<_>>>();

    let mut visible_tree_count: i32 = 0;
    for (row_idx, row) in grid.iter().enumerate() {
        for col_idx in 0..row.len() {
            if is_visible_tree(&grid, row_idx, col_idx) {
                visible_tree_count += 1;
            }
        }
    }

    visible_tree_count
}

fn is_visible_tree(grid: &[Vec<u32>], row_idx: usize, col_idx: usize) -> bool {
    let value = grid[row_idx][col_idx];
    let t_grid = transpose(grid.into());

    grid[row_idx].iter().take(col_idx).all(|x| x < &value)
        || grid[row_idx].iter().skip(col_idx + 1).all(|x| x < &value)
        || t_grid[col_idx].iter().take(row_idx).all(|x| x < &value)
        || t_grid[col_idx].iter().skip(row_idx + 1).all(|x| x < &value)
}

fn transpose<T>(v: Vec<Vec<T>>) -> Vec<Vec<T>> {
    let len = v[0].len();
    let mut iters: Vec<_> = v.into_iter().map(|n| n.into_iter()).collect();
    (0..len)
        .map(|_| {
            iters
                .iter_mut()
                .map(|n| n.next().unwrap())
                .collect::<Vec<_>>()
        })
        .collect()
}

pub fn part_2(data: &str) -> i32 {
    let grid = data
        .trim()
        .lines()
        .map(|line| line.trim())
        .map(|line| line.chars().flat_map(|x| x.to_digit(10)).collect())
        .collect::<Vec<Vec<_>>>();

    let mut score: i32 = 0;
    for (row_idx, row) in grid.iter().enumerate() {
        for col_idx in 0..row.len() {
            score = score.max(calculate_scenic_score(&grid, row_idx, col_idx));
        }
    }

    score
}

fn count_visible_trees(value: u32, input: Vec<&u32>) -> usize {
    match input.iter().position(|x| *x >= &value) {
        Some(idx) => idx + 1,
        None => input.len(),
    }
}

fn calculate_scenic_score(grid: &[Vec<u32>], row_idx: usize, col_idx: usize) -> i32 {
    let value = grid[row_idx][col_idx];
    let t_grid = transpose(grid.into());

    (count_visible_trees(value, grid[row_idx].iter().take(col_idx).rev().collect())
        * count_visible_trees(value, grid[row_idx].iter().skip(col_idx + 1).collect())
        * count_visible_trees(value, t_grid[col_idx].iter().take(row_idx).rev().collect())
        * count_visible_trees(value, t_grid[col_idx].iter().skip(row_idx + 1).collect()))
    .try_into()
    .unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            30373
            25512
            65332
            33549
            35390
        "#;

        assert_eq!(part_1(data), 21);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 1688);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            30373
            25512
            65332
            33549
            35390
        "#;

        assert_eq!(part_2(data), 8);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 410400);
    }
}
