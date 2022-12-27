use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2022-25.txt");

fn main() {
    let now = Instant::now();
    let part_1_result = part_1(INPUT);
    let duration = now.elapsed();
    println!("Part 1: {:<20}(took: {:>12?})", part_1_result, duration);
}

pub fn part_1(data: &str) -> String {
    decimal_to_snafu(data.lines().map(snafu_to_decimal).sum())
}

fn snafu_to_decimal(input: &str) -> i64 {
    input
        .chars()
        .map(|value| match value {
            '2' => 2,
            '1' => 1,
            '0' => 0,
            '-' => -1,
            '=' => -2,
            _ => unreachable!(),
        })
        .rev()
        .enumerate()
        .map(|(idx, value)| i64::pow(5, idx as u32) * value)
        .sum()
}

fn decimal_to_snafu(input: i64) -> String {
    let mut result = String::new();
    let mut remaining: f64 = input as f64;

    while remaining > 0.0 {
        result = format!(
            "{}{}",
            match ((remaining + 2.0) % 5.0 - 2.0) as i64 {
                2 => '2',
                1 => '1',
                0 => '0',
                -1 => '-',
                -2 => '=',
                _ => unreachable!(),
            },
            result,
        );
        remaining = (remaining / 5.0).round();
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2022-25.sample.txt");

    #[test]
    fn snafu_encoding() {
        assert_eq!(decimal_to_snafu(1), "1");
        assert_eq!(decimal_to_snafu(2), "2");
        assert_eq!(decimal_to_snafu(3), "1=");
        assert_eq!(decimal_to_snafu(4), "1-");
        assert_eq!(decimal_to_snafu(5), "10");
        assert_eq!(decimal_to_snafu(6), "11");
        assert_eq!(decimal_to_snafu(7), "12");
        assert_eq!(decimal_to_snafu(8), "2=");
        assert_eq!(decimal_to_snafu(9), "2-");
        assert_eq!(decimal_to_snafu(10), "20");
        assert_eq!(decimal_to_snafu(15), "1=0");
        assert_eq!(decimal_to_snafu(20), "1-0");
        assert_eq!(decimal_to_snafu(2022), "1=11-2");
        assert_eq!(decimal_to_snafu(12345), "1-0---0");
        assert_eq!(decimal_to_snafu(314159265), "1121-1110-1=0");
    }

    #[test]
    fn snafu_decoding() {
        assert_eq!(snafu_to_decimal("1=-0-2"), 1747);
        assert_eq!(snafu_to_decimal("12111"), 906);
        assert_eq!(snafu_to_decimal("2=0="), 198);
        assert_eq!(snafu_to_decimal("21"), 11);
        assert_eq!(snafu_to_decimal("2=01"), 201);
        assert_eq!(snafu_to_decimal("111"), 31);
        assert_eq!(snafu_to_decimal("20012"), 1257);
        assert_eq!(snafu_to_decimal("112"), 32);
        assert_eq!(snafu_to_decimal("1=-1="), 353);
        assert_eq!(snafu_to_decimal("1-12"), 107);
        assert_eq!(snafu_to_decimal("12"), 7);
        assert_eq!(snafu_to_decimal("1="), 3);
        assert_eq!(snafu_to_decimal("122"), 37);
    }

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), "2=-1=0");
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), "2=2-1-010==-0-1-=--2");
    }
}
