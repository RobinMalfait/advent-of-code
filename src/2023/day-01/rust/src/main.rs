use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2023-01.txt");

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
        .map(|line| line.trim())
        .map(|line| {
            let mut results = vec![];

            for c in line.chars() {
                if c.is_ascii_digit() {
                    results.push(c.to_digit(10).unwrap());
                }
            }

            results[0] * 10 + results[results.len() - 1]
        })
        .reduce(|a, b| a + b)
        .unwrap()
        .try_into()
        .unwrap()
}

pub fn part_2(data: &str) -> i32 {
    let words = [
        "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    ];

    data.trim()
        .lines()
        .map(|line| line.trim())
        .map(|line| {
            let mut results = vec![];

            for (i, c) in line.char_indices() {
                if c.is_ascii_digit() {
                    results.push(c.to_digit(10).unwrap());
                } else {
                    for (idx, word) in words.iter().enumerate() {
                        if line[i..].starts_with(word) {
                            results.push(idx as u32 + 1);
                        }
                    }
                }
            }

            results[0] * 10 + results[results.len() - 1]
        })
        .reduce(|a, b| a + b)
        .unwrap()
        .try_into()
        .unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            1abc2
            pqr3stu8vwx
            a1b2c3d4e5f
            treb7uchet
        "#;

        assert_eq!(part_1(data), 142);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 53921);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            two1nine
            eightwothree
            abcone2threexyz
            xtwone3four
            4nineeightseven2
            zoneight234
            7pqrstsixteen
        "#;

        assert_eq!(part_2(data), 281);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 54676);
    }
}
