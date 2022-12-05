use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/{{YEAR}}-{{DAY}}.txt");

fn main() {
    let now = Instant::now();
    let part_1_result = part_1(INPUT);
    let duration = now.elapsed();
    println!("Part 1: {}\t\t(took: {:?})", part_1_result, duration);

    let now = Instant::now();
    let part_2_result = part_2(INPUT);
    let duration = now.elapsed();
    println!("Part 2: {}\t\t(took: {:?})", part_2_result, duration);
}

pub fn part_1(data: &str) -> i32 {
    0
}

pub fn part_2(data: &str) -> i32 {
    0
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
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 0);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
        "#;

        assert_eq!(part_2(data), 0);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 0);
    }
}