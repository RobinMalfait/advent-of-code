use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2015-04.txt");

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
    let data = data.trim();
    let mut x = 1;
    loop {
        let digest = md5::compute(format!("{}{}", data, x));
        if format!("{:?}", digest).starts_with("00000") {
            return x;
        }

        x += 1;
    }
}

pub fn part_2(data: &str) -> i32 {
    let data = data.trim();
    let mut x = 1;
    loop {
        let digest = md5::compute(format!("{}{}", data, x));
        if format!("{:?}", digest).starts_with("000000") {
            return x;
        }

        x += 1;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"abcdef"#;

        assert_eq!(part_1(data), 609_043);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 117_946);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 3_938_038);
    }
}
