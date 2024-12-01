use std::{collections::BTreeMap, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2024-01.txt");

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

pub fn part_1(data: &str) -> u32 {
    let mut left = vec![];
    let mut right = vec![];

    for (idx, value) in data
        .split_whitespace()
        .filter_map(|s| s.parse::<u32>().ok())
        .enumerate()
    {
        if (idx % 2) == 0 {
            left.push(value);
        } else {
            right.push(value);
        }
    }

    left.sort();
    right.sort();

    left.iter()
        .zip(right.iter())
        .map(|(lhs, rhs)| lhs.abs_diff(*rhs))
        .sum()
}

pub fn part_2(data: &str) -> u32 {
    let mut left = vec![];
    let mut right = vec![];

    for (idx, value) in data
        .split_whitespace()
        .filter_map(|s| s.parse::<u32>().ok())
        .enumerate()
    {
        if (idx % 2) == 0 {
            left.push(value);
        } else {
            right.push(value);
        }
    }

    let mut counts = BTreeMap::new();
    for value in right {
        *counts.entry(value).or_insert(0) += 1;
    }

    left.iter().map(|x| x * counts.get(x).unwrap_or(&0)).sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            3   4
            4   3
            2   5
            1   3
            3   9
            3   3
        "#;

        assert_eq!(part_1(data), 11);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 2066446);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            3   4
            4   3
            2   5
            1   3
            3   9
            3   3
        "#;

        assert_eq!(part_2(data), 31);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 24931009);
    }
}
