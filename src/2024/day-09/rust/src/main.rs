use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2024-09.txt");

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

pub fn part_1(blob: &str) -> i32 {
    todo!()
}

pub fn part_2(blob: &str) -> i32 {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
        "#;

        assert_eq!(part_1(data), 0);
    }

    #[test]
    #[ignore]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 0);
    }

    #[test]
    #[ignore]
    fn part_2_sample() {
        let data = r#"
        "#;

        assert_eq!(part_2(data), 0);
    }

    #[test]
    #[ignore]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 0);
    }
}
