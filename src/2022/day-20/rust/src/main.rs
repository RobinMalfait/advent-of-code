use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2022-20.txt");

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

pub fn part_1(data: &str) -> i64 {
    solve(data, 1, 1)
}

pub fn part_2(data: &str) -> i64 {
    solve(data, 10, 811_589_153)
}

fn solve(data: &str, rounds: usize, decryption_key: i64) -> i64 {
    let numbers: Vec<i64> = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse::<i64>().ok())
        .map(|x| x * decryption_key)
        .collect();

    let total = numbers.len();
    let mut locations: Vec<_> = (0..total).collect();

    for _ in 0..rounds {
        for (idx, value) in numbers.iter().enumerate() {
            if let Some(previous_idx) = locations.iter().position(|value| *value == idx) {
                // Drop old value
                locations.remove(previous_idx);

                // Calculate new idx
                let mut new_idx = previous_idx as i64;
                new_idx += *value;
                new_idx %= total as i64 - 1;
                new_idx += total as i64 - 1;
                new_idx %= total as i64 - 1;

                // Store new value
                locations.insert(new_idx as usize, idx);
            }
        }
    }

    let sorted_numbers: Vec<_> = locations
        .iter()
        .filter_map(|idx| numbers.get(*idx))
        .collect();

    let position_0 = sorted_numbers.iter().position(|x| **x == 0).unwrap();

    [1000, 2000, 3000]
        .iter()
        .map(|offset| sorted_numbers[(position_0 + offset) % total])
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            1
            2
            -3
            3
            -2
            0
            4
        "#;

        assert_eq!(part_1(data), 3);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 14_526);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            1
            2
            -3
            3
            -2
            0
            4
        "#;

        assert_eq!(part_2(data), 1_623_178_306);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 9_738_258_246_847);
    }
}
