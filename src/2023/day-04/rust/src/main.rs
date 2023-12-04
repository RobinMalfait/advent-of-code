use std::{collections::BTreeSet, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2023-04.txt");

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
    data.trim()
        .lines()
        .filter_map(|line| line.trim().parse::<Card>().ok())
        .map(|card| card.intersection())
        .filter(|intersection| !intersection.is_empty())
        .map(|intersection| 2_i32.pow((intersection.len() - 1).try_into().unwrap()))
        .sum()
}

pub fn part_2(data: &str) -> i32 {
    let cards = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse::<Card>().ok())
        .map(|card| card.intersection())
        .map(|intersection| intersection.len())
        .collect::<Vec<_>>();

    let mut counter = vec![0; cards.len()];

    for (idx, points) in cards.iter().enumerate() {
        counter[idx] += 1;

        for offset in 1..=*points {
            counter[idx + offset] += counter[idx];
        }
    }

    counter.iter().sum()
}

struct Card {
    winning: BTreeSet<u32>,
    hand: BTreeSet<u32>,
}

impl Card {
    fn intersection(&self) -> BTreeSet<u32> {
        self.winning.intersection(&self.hand).copied().collect()
    }
}

impl FromStr for Card {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (_, cards) = s.split_once(':').ok_or(())?;
        let (winning, hand) = cards.split_once('|').ok_or(())?;

        Ok(Self {
            winning: winning
                .split_whitespace()
                .filter_map(|n| n.parse().ok())
                .collect(),
            hand: hand
                .split_whitespace()
                .filter_map(|n| n.parse().ok())
                .collect(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
            Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
            Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
            Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
            Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
            Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        "#;

        assert_eq!(part_1(data), 13);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 25651);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
            Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
            Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
            Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
            Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
            Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        "#;

        assert_eq!(part_2(data), 30);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 19499881);
    }
}
