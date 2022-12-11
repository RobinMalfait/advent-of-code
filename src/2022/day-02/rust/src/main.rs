use std::{str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-02.txt");

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

#[derive(Clone, PartialEq)]
enum Shape {
    Rock,
    Paper,
    Scissors,
}

impl Shape {
    fn points(&self) -> i32 {
        match self {
            Shape::Rock => 1,
            Shape::Paper => 2,
            Shape::Scissors => 3,
        }
    }

    fn from_state(state: &State, opponent: &Shape) -> Self {
        let winners = vec![
            (Shape::Rock, Shape::Scissors),
            (Shape::Scissors, Shape::Paper),
            (Shape::Paper, Shape::Rock),
        ];

        if *state == State::Draw {
            return opponent.clone();
        }

        for (winner, loser) in winners {
            if *state == State::Won && loser == *opponent {
                return winner;
            }

            if *state == State::Lost && winner == *opponent {
                return loser;
            }
        }

        unreachable!()
    }
}

impl FromStr for Shape {
    type Err = ();
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "A" | "X" => Shape::Rock,
            "B" | "Y" => Shape::Paper,
            "C" | "Z" => Shape::Scissors,
            _ => return Err(()),
        })
    }
}

#[derive(PartialEq)]
enum State {
    Won,
    Lost,
    Draw,
}

impl State {
    fn points(&self) -> i32 {
        match self {
            State::Won => 6,
            State::Draw => 3,
            State::Lost => 0,
        }
    }

    fn from_shapes(left: &Shape, right: &Shape) -> Self {
        if left == right {
            return State::Draw;
        }

        let winners = vec![
            (Shape::Rock, Shape::Scissors),
            (Shape::Scissors, Shape::Paper),
            (Shape::Paper, Shape::Rock),
        ];

        for (winner, loser) in winners {
            if winner == *left && loser == *right {
                return State::Won;
            }
        }

        State::Lost
    }
}

impl FromStr for State {
    type Err = ();
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "X" => State::Lost,
            "Y" => State::Draw,
            "Z" => State::Won,
            _ => return Err(()),
        })
    }
}

pub fn part_1(data: &str) -> i32 {
    data.trim()
        .lines()
        .map(|line| {
            line.trim()
                .split_once(' ')
                .map(|(a, b)| (a.parse().unwrap(), b.parse().unwrap()))
                .unwrap()
        })
        .map(|(opponent, mine)| State::from_shapes(&mine, &opponent).points() + mine.points())
        .sum()
}

pub fn part_2(data: &str) -> i32 {
    data.trim()
        .lines()
        .map(|line| {
            line.trim()
                .split_once(' ')
                .map(|(a, b)| (a.parse().unwrap(), b.parse().unwrap()))
                .unwrap()
        })
        .map(|(opponent, state)| {
            let mine = Shape::from_state(&state, &opponent);
            (opponent, mine)
        })
        .map(|(opponent, mine)| mine.points() + State::from_shapes(&mine, &opponent).points())
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            A Y
            B X
            C Z
        "#;

        assert_eq!(part_1(data), 15);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 10994);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            A Y
            B X
            C Z
        "#;

        assert_eq!(part_2(data), 12);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 12526);
    }
}
