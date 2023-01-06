use std::str::FromStr;
use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2016-02.txt");

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
    let instructions: Vec<Vec<Instruction>> = data
        .trim()
        .lines()
        .map(|line| {
            line.trim()
                .split("")
                .filter_map(|s| s.parse::<Instruction>().ok())
                .collect()
        })
        .collect::<Vec<Vec<_>>>();

    let keypad = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    let mut start: (i32, i32) = (1, 1);
    let mut code: Vec<i32> = vec![];

    for group in instructions {
        for instruction in group {
            let (x, y) = match instruction {
                Instruction::Up => (start.0, start.1 - 1),
                Instruction::Down => (start.0, start.1 + 1),
                Instruction::Left => (start.0 - 1, start.1),
                Instruction::Right => (start.0 + 1, start.1),
            };

            let x = x.clamp(0, 2);
            let y = y.clamp(0, 2);

            start = (x, y);
        }

        code.push(keypad[start.1 as usize][start.0 as usize]);
    }

    let l = code.len();
    code.into_iter()
        .enumerate()
        .map(|(idx, x)| 10_i32.pow((l - idx - 1) as u32) * x)
        .sum()
}

pub fn part_2(data: &str) -> String {
    let instructions: Vec<Vec<Instruction>> = data
        .trim()
        .lines()
        .map(|line| {
            line.trim()
                .split("")
                .filter_map(|s| s.parse::<Instruction>().ok())
                .collect()
        })
        .collect::<Vec<Vec<_>>>();

    let keypad = [
        [None, None, Some('1'), None, None],
        [None, Some('2'), Some('3'), Some('4'), None],
        [Some('5'), Some('6'), Some('7'), Some('8'), Some('9')],
        [None, Some('A'), Some('B'), Some('C'), None],
        [None, None, Some('D'), None, None],
    ];
    let mut start: (i32, i32) = (0, 2);
    let mut code: Vec<Option<char>> = vec![];

    for group in instructions {
        for instruction in group {
            let (x, y) = match instruction {
                Instruction::Up => (start.0, start.1 - 1),
                Instruction::Down => (start.0, start.1 + 1),
                Instruction::Left => (start.0 - 1, start.1),
                Instruction::Right => (start.0 + 1, start.1),
            };

            let x = x.clamp(0, 4);
            let y = y.clamp(0, 4);

            match keypad[y as usize][x as usize] {
                Some(_) => start = (x, y),
                None => (),
            }
        }

        code.push(keypad[start.1 as usize][start.0 as usize]);
    }

    code.iter()
        .filter_map(|x| *x)
        .map(|x| x.to_string())
        .collect::<Vec<_>>()
        .join("")
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Instruction {
    Up,
    Down,
    Left,
    Right,
}

impl FromStr for Instruction {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "U" => Instruction::Up,
            "D" => Instruction::Down,
            "L" => Instruction::Left,
            "R" => Instruction::Right,
            _ => return Err(()),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
          ULL
          RRDDD
          LURDL
          UUUUD
        "#;

        assert_eq!(part_1(data), 1985);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 35749);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
          ULL
          RRDDD
          LURDL
          UUUUD
        "#;

        assert_eq!(part_2(data), "5DB3");
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), "9365C");
    }
}
