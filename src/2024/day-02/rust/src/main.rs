use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2024-02.txt");

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

pub fn part_1(data: &str) -> usize {
    data.trim()
        .lines()
        .map(|line| {
            line.split_whitespace()
                .filter_map(|x| x.parse().ok())
                .collect::<Vec<_>>()
        })
        .filter(|x| is_safe_level(x))
        .count()
}

pub fn part_2(data: &str) -> usize {
    data.trim()
        .lines()
        .map(|line| {
            line.split_whitespace()
                .filter_map(|x| x.parse().ok())
                .collect::<Vec<_>>()
        })
        .filter(|level| {
            (0..level.len()).any(|i| {
                let mut level = level.clone();
                level.remove(i);
                is_safe_level(&level)
            })
        })
        .count()
}

enum Trend {
    Unknown,
    Increasing,
    Decreasing,
}

fn is_safe_level(x: &[usize]) -> bool {
    let mut trend = Trend::Unknown;

    for w in x.windows(2) {
        let a = w[0];
        let b = w[1];

        if a == b {
            return false;
        }

        match trend {
            Trend::Increasing if a > b => return false,
            Trend::Decreasing if a < b => return false,
            Trend::Unknown if a > b => trend = Trend::Decreasing,
            Trend::Unknown if a < b => trend = Trend::Increasing,
            _ => {}
        }

        let diff = a.abs_diff(b);
        if !(0..=3).contains(&diff) {
            return false;
        }
    }

    true
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            7 6 4 2 1
            1 2 7 8 9
            9 7 6 2 1
            1 3 2 4 5
            8 6 4 4 1
            1 3 6 7 9
        "#;

        assert_eq!(part_1(data), 2);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 321);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            7 6 4 2 1
            1 2 7 8 9
            9 7 6 2 1
            1 3 2 4 5
            8 6 4 4 1
            1 3 6 7 9
        "#;

        assert_eq!(part_2(data), 4);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 386);
    }
}
