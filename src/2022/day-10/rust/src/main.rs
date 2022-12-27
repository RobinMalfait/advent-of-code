use std::{fmt::Display, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-10.txt");

fn main() {
    let now = Instant::now();
    let part_1_result = part_1(INPUT);
    let duration = now.elapsed();
    println!("Part 1: {:<20}(took: {:>12?})", part_1_result, duration);

    let now = Instant::now();
    let part_2_result = part_2(INPUT);
    let duration = now.elapsed();
    println!("Part 2: took {:?}\n{}", duration, part_2_result);
}

pub fn part_1(data: &str) -> i32 {
    let mut cycle = 1;
    let mut register_x = 1;
    let mut total = 0;

    for instruction in data.trim().lines().flat_map(Instruction::parse_to_vec) {
        if let Instruction::Addx(value) = instruction {
            register_x += value;
        }

        cycle += 1;

        if vec![20, 60, 100, 140, 180, 220].contains(&cycle) {
            total += cycle * register_x;
        }
    }

    total
}

pub fn part_2(data: &str) -> String {
    let mut crt = vec![Pixel::Dark; 40 * 6];
    let mut sprite: i32 = 1;

    let mut cycle = 1;
    let mut register_x = 1;

    for instruction in data.trim().lines().flat_map(Instruction::parse_to_vec) {
        crt[cycle - 1] = match sprite.abs_diff(((cycle - 1) % 40) as i32) <= 1 {
            true => Pixel::Lit,
            false => Pixel::Dark,
        };

        if let Instruction::Addx(value) = instruction {
            register_x += value;
            sprite = register_x;
        }

        cycle += 1;
    }

    crt.iter()
        .enumerate()
        .map(|(idx, pixel)| pixel.to_string() + if (idx + 1) % 40 == 0 { "\n" } else { "" })
        .collect::<Vec<_>>()
        .join("")
        .trim()
        .to_string()
}

#[derive(Debug)]
enum Instruction {
    Noop,
    Addx(i32),
}

impl Instruction {
    fn parse_to_vec(s: &str) -> Vec<Instruction> {
        match s.parse() {
            Ok(instruction) => match instruction {
                Instruction::Noop => vec![instruction],
                Instruction::Addx(_) => vec![Instruction::Noop, instruction],
            },
            _ => vec![],
        }
    }
}

impl FromStr for Instruction {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let s = s.trim();

        Ok(match s {
            "noop" => Instruction::Noop,
            _ => match s.split_once(' ') {
                Some(("addx", arg)) => Instruction::Addx(arg.parse().unwrap_or(0)),
                _ => return Err(()),
            },
        })
    }
}

#[derive(Debug, Copy, Clone)]
enum Pixel {
    Lit,
    Dark,
}

impl Display for Pixel {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(match self {
            Pixel::Lit => "█",
            Pixel::Dark => " ",
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE_INPUT: &str = include_str!("../../../../../data/2022-10.sample.txt");

    fn dedent(input: &str) -> String {
        input
            .trim()
            .lines()
            .map(|line| line.trim())
            .collect::<Vec<_>>()
            .join("\n")
    }

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE_INPUT), 13140);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 15140);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(
            dedent(&part_2(SAMPLE_INPUT)),
            dedent(
                r#"
                    ██  ██  ██  ██  ██  ██  ██  ██  ██  ██
                    ███   ███   ███   ███   ███   ███   ███
                    ████    ████    ████    ████    ████
                    █████     █████     █████     █████
                    ██████      ██████      ██████      ████
                    ███████       ███████       ███████
                "#
            )
        );
    }

    #[test]
    fn part_2_real() {
        assert_eq!(
            dedent(&part_2(INPUT)),
            dedent(
                r#"
                    ███  ███    ██  ██  ████  ██   ██  ███
                    █  █ █  █    █ █  █    █ █  █ █  █ █  █
                    ███  █  █    █ █  █   █  █    █  █ █  █
                    █  █ ███     █ ████  █   █ ██ ████ ███
                    █  █ █    █  █ █  █ █    █  █ █  █ █
                    ███  █     ██  █  █ ████  ███ █  █ █
                "#
            )
        );
    }
}
