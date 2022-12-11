use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2022-01.txt");

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

pub fn part_1(data: &str) -> i32 {
    data.trim()
        .split("\n\n")
        .map(|x| x.split('\n').map(|x| x.trim().parse().unwrap_or(0)).sum())
        .max()
        .unwrap_or_default()
}

pub fn part_2(data: &str) -> i32 {
    let mut groups: Vec<i32> = data
        .trim()
        .split("\n\n")
        .map(|x| x.split('\n').map(|x| x.trim().parse().unwrap_or(0)).sum())
        .collect();

    groups.sort_by(|a, z| z.cmp(a));

    groups[0..3].iter().sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            1000
            2000
            3000

            4000

            5000
            6000

            7000
            8000
            9000

            10000
        "#;

        assert_eq!(part_1(data), 24000);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 64929);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            1000
            2000
            3000

            4000

            5000
            6000

            7000
            8000
            9000

            10000
        "#;

        assert_eq!(part_2(data), 45000);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 193697);
    }
}
