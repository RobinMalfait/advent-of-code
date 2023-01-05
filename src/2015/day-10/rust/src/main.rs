use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2015-10.txt");

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

pub fn part_1(data: &str) -> usize {
    solve(data, 40).len()
}

pub fn part_2(data: &str) -> usize {
    solve(data, 50).len()
}

fn solve(data: &str, steps: usize) -> String {
    let mut value = data.trim().to_string();

    for _ in 0..steps {
        let mut result = String::new();
        let mut count = 0;
        let mut last_char = '\0';

        for (i, c) in value.chars().enumerate() {
            if i == 0 || last_char == c {
                count += 1;
            } else {
                result.push_str(&count.to_string());
                result.push(last_char);
                count = 1;
            }

            last_char = c;
        }

        result.push_str(&count.to_string());
        result.push(last_char);

        value = result;
    }

    value
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        assert_eq!(solve("1", 1), "11");
        assert_eq!(solve("11", 1), "21");
        assert_eq!(solve("21", 1), "1211");
        assert_eq!(solve("1211", 1), "111221");
        assert_eq!(solve("111221", 1), "312211");
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 252_594);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 3_579_328);
    }
}
