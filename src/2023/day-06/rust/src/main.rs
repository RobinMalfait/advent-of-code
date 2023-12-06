use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2023-06.txt");

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
    let mut total = 1;

    for (time, record) in parse(data) {
        let mut wins = 0;
        for i in 1..time {
            let distance = (time - i) * i;
            if distance > record {
                wins += 1;
            }
        }
        total *= wins;
    }

    total
}

pub fn part_2(data: &str) -> i32 {
    part_1(&data.replace(' ', "").replace(':', ": "))
}

fn parse(data: &str) -> Vec<(u64, u64)> {
    let info = data
        .trim()
        .lines()
        .map(|line| {
            line.split_whitespace()
                .skip(1)
                .map(|v| v.parse::<u64>().unwrap())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<Vec<_>>>();

    info[0]
        .iter()
        .zip(info[1].iter())
        .map(|(a, b)| (*a, *b))
        .collect::<Vec<_>>()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            Time:      7  15   30
            Distance:  9  40  200
        "#;

        assert_eq!(part_1(data), 288);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 1660968);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            Time:      7  15   30
            Distance:  9  40  200
        "#;

        assert_eq!(part_2(data), 71503);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 26499773);
    }
}
