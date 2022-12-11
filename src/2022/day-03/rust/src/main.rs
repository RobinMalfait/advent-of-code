use std::collections::HashSet;
use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2022-03.txt");

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
    data.trim()
        .lines()
        .map(|line| line.trim())
        .flat_map(|line| {
            let (lhs, rhs) = line.split_at(line.len() / 2);
            vec![lhs, rhs]
        })
        .map(|line| HashSet::from_iter(line.chars()))
        .collect::<Vec<_>>()
        .chunks(2)
        .flat_map(|groups| {
            let mut groups_iter = groups.iter();
            let common: &HashSet<char> = groups_iter.next().unwrap();
            let others: Vec<&HashSet<char>> = groups_iter.collect();
            common
                .iter()
                .find(|&value| others.iter().all(|x| x.contains(value)))
        })
        .map(|value| match value {
            'a'..='z' => (*value as i32) - 96,
            'A'..='Z' => (*value as i32) - 38,
            _ => 0,
        })
        .sum()
}

pub fn part_2(data: &str) -> i32 {
    data.trim()
        .lines()
        .map(|line| HashSet::from_iter(line.trim().chars()))
        .collect::<Vec<_>>()
        .chunks(3)
        .flat_map(|groups| {
            let mut groups_iter = groups.iter();
            let common: &HashSet<char> = groups_iter.next().unwrap();
            let others: Vec<&HashSet<char>> = groups_iter.collect();
            common
                .iter()
                .find(|&value| others.iter().all(|x| x.contains(value)))
        })
        .map(|value| match value {
            'a'..='z' => (*value as i32) - 96,
            'A'..='Z' => (*value as i32) - 38,
            _ => 0,
        })
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            vJrwpWtwJgWrhcsFMMfFFhFp
            jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
            PmmdzqPrVvPwwTWBwg
            wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
            ttgJtRGJQctTZtZT
            CrZsJsPPZsGzwwsLwLmpwMDw
        "#;

        assert_eq!(part_1(data), 157);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 7795);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            vJrwpWtwJgWrhcsFMMfFFhFp
            jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
            PmmdzqPrVvPwwTWBwg
            wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
            ttgJtRGJQctTZtZT
            CrZsJsPPZsGzwwsLwLmpwMDw
        "#;

        assert_eq!(part_2(data), 70);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 2703);
    }
}
