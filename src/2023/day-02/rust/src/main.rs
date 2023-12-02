use std::{str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2023-02.txt");

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
        .flat_map(|l| l.parse())
        .collect::<Vec<Game>>()
        .iter()
        .filter(|game| {
            game.rounds
                .iter()
                .all(|round| round.red <= 12 && round.green <= 13 && round.blue <= 14)
        })
        .map(|game| game.id)
        .sum()
}

pub fn part_2(data: &str) -> i32 {
    data.trim()
        .lines()
        .flat_map(|l| l.parse())
        .collect::<Vec<Game>>()
        .iter()
        .map(|game| {
            let Some(max_r) = game.rounds.iter().map(|r| r.red).max() else { unreachable!() };
            let Some(max_g) = game.rounds.iter().map(|r| r.green).max() else { unreachable!() };
            let Some(max_b) = game.rounds.iter().map(|r| r.blue).max() else { unreachable!() };
            max_r * max_g * max_b
        })
        .sum()
}

#[derive(Debug)]
struct Game {
    id: i32,
    rounds: Vec<Round>,
}

#[derive(Debug, Default)]
struct Round {
    red: i32,
    green: i32,
    blue: i32,
}

impl FromStr for Game {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.split_once(": ") {
            Some((id, rounds)) => {
                let id: i32 = id.trim().split_once(' ').unwrap().1.parse().unwrap();
                let rounds: Vec<Round> = rounds
                    .split("; ")
                    .map(|r| r.parse())
                    .collect::<Result<Vec<Round>, _>>()
                    .unwrap();

                Ok(Self { id, rounds })
            }
            None => Err(()),
        }
    }
}

impl FromStr for Round {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut round = Self::default();

        for color in s.split(", ") {
            match color.split_once(' ') {
                Some((count, "red")) => {
                    round.red = count.parse().unwrap();
                }
                Some((count, "green")) => {
                    round.green = count.parse().unwrap();
                }
                Some((count, "blue")) => {
                    round.blue = count.parse().unwrap();
                }
                _ => return Err(()),
            }
        }

        Ok(round)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
            Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
            Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
            Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
            Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        "#;

        assert_eq!(part_1(data), 8);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 2085);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
            Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
            Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
            Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
            Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        "#;

        assert_eq!(part_2(data), 2286);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 79_315);
    }
}
