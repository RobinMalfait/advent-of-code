use std::cmp;
use std::{collections::BTreeMap, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2023-07.txt");

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
    play(data, Part::One)
}

pub fn part_2(data: &str) -> i32 {
    play(data, Part::Two)
}

fn play(data: &str, part: Part) -> i32 {
    let order = match part {
        Part::One => [
            'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2',
        ],
        Part::Two => [
            'A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J',
        ],
    };

    let mut hands: Vec<Hand> = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse().ok())
        .collect();

    hands.sort_by(
        |a, z| match a.combination_type(part).cmp(&z.combination_type(part)) {
            cmp::Ordering::Equal => rank(a, z, &order),
            ordering => ordering,
        },
    );

    hands
        .iter()
        .enumerate()
        .map(|(idx, hand)| hand.bid as i32 * (hands.len() - idx) as i32)
        .sum()
}

fn rank(a: &Hand, z: &Hand, order: &[char; 13]) -> cmp::Ordering {
    for i in 0..5 {
        let a = order.iter().position(|&x| x == a.cards[i]).unwrap();
        let z = order.iter().position(|&x| x == z.cards[i]).unwrap();
        if a != z {
            return a.cmp(&z);
        }
    }

    cmp::Ordering::Equal
}

#[derive(Debug, Clone, Copy, PartialEq)]
enum Part {
    One,
    Two,
}

#[derive(Debug)]
struct Hand {
    bid: u32,
    cards: [char; 5],
}

impl Hand {
    fn combination_type(&self, part: Part) -> u32 {
        let mut counts: BTreeMap<char, i32> = BTreeMap::new();
        for card in self.cards.iter() {
            *counts.entry(*card).or_insert(0) += 1;
        }

        let mut joker_count = 0;
        if part == Part::Two && counts.len() > 1 {
            if let Some(value) = counts.remove(&'J') {
                joker_count += value;
            }
        }

        let mut counts = counts.into_values().collect::<Vec<_>>();
        counts.sort_by(|a, z| z.cmp(a));

        // Move joker counts to the highest card
        counts[0] += joker_count;

        match counts[..] {
            [5] => 1,          // Five of a kind
            [4, 1] => 2,       // Four of a kind
            [3, 2] => 3,       // Full house
            [3, 1, 1] => 4,    // Three of a kind
            [2, 2, 1] => 5,    // Two pair
            [2, 1, 1, 1] => 6, // One pair
            _ => 7,            // High card
        }
    }
}

impl FromStr for Hand {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (cards, bid) = s.split_once(' ').ok_or(())?;

        Ok(Self {
            bid: bid.parse().map_err(|_| ())?,
            cards: cards
                .chars()
                .collect::<Vec<_>>()
                .try_into()
                .map_err(|_| ())?,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            32T3K 765
            T55J5 684
            KK677 28
            KTJJT 220
            QQQJA 483
        "#;

        assert_eq!(part_1(data), 6440);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 250453939);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            32T3K 765
            T55J5 684
            KK677 28
            KTJJT 220
            QQQJA 483
        "#;

        assert_eq!(part_2(data), 5905);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 248652697);
    }
}
