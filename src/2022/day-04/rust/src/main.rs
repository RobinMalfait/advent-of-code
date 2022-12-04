use std::{cmp::PartialOrd, ops::RangeInclusive, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-04.txt");

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

fn parse_range(input: &str) -> RangeInclusive<i32> {
    input
        .split_once('-')
        .map(|(start, end)| start.parse().unwrap()..=end.parse().unwrap())
        .unwrap()
}

fn partial_overlap<T: PartialOrd>((lhs, rhs): &(RangeInclusive<T>, RangeInclusive<T>)) -> bool {
    lhs.start() <= rhs.end() && rhs.start() <= lhs.end()
}

fn full_overlap<T: PartialOrd>((lhs, rhs): &(RangeInclusive<T>, RangeInclusive<T>)) -> bool {
    lhs.start() >= rhs.start() && lhs.end() <= rhs.end()
        || rhs.start() >= lhs.start() && rhs.end() <= lhs.end()
}

pub fn part_1(data: &str) -> i32 {
    data.trim()
        .lines()
        .map(|line| line.trim())
        .filter_map(|line| {
            line.split_once(',')
                .map(|(lhs, rhs)| (parse_range(lhs), parse_range(rhs)))
        })
        .filter(full_overlap)
        .count()
        .try_into()
        .unwrap()
}

pub fn part_2(data: &str) -> i32 {
    data.trim()
        .lines()
        .map(|line| line.trim())
        .filter_map(|line| {
            line.split_once(',')
                .map(|(lhs, rhs)| (parse_range(lhs), parse_range(rhs)))
        })
        .filter(partial_overlap)
        .count()
        .try_into()
        .unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            2-4,6-8
            2-3,4-5
            5-7,7-9
            2-8,3-7
            6-6,4-6
            2-6,4-8
        "#;

        assert_eq!(part_1(data), 2);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 444);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            2-4,6-8
            2-3,4-5
            5-7,7-9
            2-8,3-7
            6-6,4-6
            2-6,4-8
        "#;

        assert_eq!(part_2(data), 4);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 801);
    }
}
