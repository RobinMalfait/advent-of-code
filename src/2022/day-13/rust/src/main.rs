use std::{cmp, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-13.txt");

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
        .split("\n\n")
        .map(|block| {
            let (lhs, rhs) = block.split_once('\n').expect("Valid packet pair");
            (lhs.parse().unwrap(), rhs.parse().unwrap())
        })
        .map(|(lhs, rhs): (Packet, Packet)| lhs.cmp(&rhs))
        .enumerate()
        .map(|(idx, ord)| match ord {
            cmp::Ordering::Less => idx + 1,
            _ => 0,
        })
        .sum::<usize>() as i32
}

pub fn part_2(data: &str) -> i32 {
    let mut packets = data
        .trim()
        .split("\n\n")
        .flat_map(|block| block.lines().filter_map(|line| line.parse().ok()))
        .collect::<Vec<Packet>>();

    let a: Packet = "[[2]]".parse().expect("This should work");
    let b: Packet = "[[6]]".parse().expect("This should work");

    packets.push(a.clone());
    packets.push(b.clone());

    packets.sort();

    let a = packets.iter().position(|other| *other == a).unwrap() + 1;
    let b = packets.iter().position(|other| *other == b).unwrap() + 1;

    (a * b) as i32
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum Packet {
    Nested(Vec<Packet>),
    Value(i32),
}

impl Packet {
    fn wrap(&self) -> Packet {
        Packet::Nested(vec![self.clone()])
    }
}

impl FromStr for Packet {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s.starts_with('[') && s.ends_with(']') {
            Ok(Packet::Nested(
                split_top_level(&s[1..s.len() - 1], ',')
                    .iter()
                    .filter_map(|section| section.parse::<Packet>().ok())
                    .collect(),
            ))
        } else {
            Ok(Packet::Value(s.parse::<i32>().expect("A number")))
        }
    }
}

impl Ord for Packet {
    fn cmp(&self, other: &Self) -> cmp::Ordering {
        match (self, other) {
            (Packet::Nested(lhs), Packet::Nested(rhs)) => {
                let mut lhs: Vec<_> = lhs.iter().rev().collect();
                let mut rhs: Vec<_> = rhs.iter().rev().collect();

                loop {
                    match (lhs.len(), rhs.len()) {
                        (0, 0) => return cmp::Ordering::Equal,
                        (0, x) if x > 0 => return cmp::Ordering::Less,
                        (x, 0) if x > 0 => return cmp::Ordering::Greater,
                        _ => match lhs.pop().unwrap().cmp(rhs.pop().unwrap()) {
                            r @ cmp::Ordering::Less => return r,
                            r @ cmp::Ordering::Greater => return r,
                            _ => {}
                        },
                    }
                }
            }
            (Packet::Value(lhs), Packet::Value(rhs)) => lhs.cmp(rhs),
            (lhs @ Packet::Nested(_), rhs @ Packet::Value(_)) => lhs.cmp(&rhs.wrap()),
            (lhs @ Packet::Value(_), rhs @ Packet::Nested(_)) => lhs.wrap().cmp(rhs),
        }
    }
}

impl PartialOrd for Packet {
    fn partial_cmp(&self, other: &Self) -> Option<cmp::Ordering> {
        Some(self.cmp(other))
    }
}

fn split_top_level(input: &str, delim: char) -> Vec<&str> {
    let mut nested = 0;

    input
        .split_terminator(|x| match x {
            '[' => {
                nested += 1;
                false
            }
            ']' => {
                nested -= 1;
                false
            }
            _ if x == delim && nested == 0 => true,
            _ => false,
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2022-13.sample.txt");

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), 13);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 6101);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(part_2(SAMPLE), 140);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 21909);
    }
}
