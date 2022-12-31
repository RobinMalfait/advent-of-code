use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2015-05.txt");

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
        .filter(|input| {
            if input.contains("ab")
                || input.contains("cd")
                || input.contains("pq")
                || input.contains("xy")
            {
                return false;
            }

            input
                .chars()
                .filter(|x| matches!(x, 'a' | 'e' | 'i' | 'o' | 'u'))
                .count()
                >= 3
                && input
                    .chars()
                    .collect::<Vec<_>>()
                    .windows(2)
                    .any(|x| match x {
                        [a, b] => a == b,
                        _ => false,
                    })
        })
        .count() as i32
}

pub fn part_2(data: &str) -> i32 {
    data.trim()
        .lines()
        .map(|line| line.trim())
        .filter(|input| {
            let pairs = input
                .chars()
                .collect::<Vec<_>>()
                .windows(2)
                .map(|x| match x {
                    [a, b] => format!("{}{}", a, b),
                    _ => unreachable!(),
                })
                .collect::<Vec<String>>();

            pairs
                .iter()
                .enumerate()
                .any(|(idx, pair)| pairs.iter().skip(idx + 2).filter(|x| *x == pair).count() > 0)
                && input
                    .chars()
                    .collect::<Vec<_>>()
                    .windows(3)
                    .any(|x| match x {
                        [lhs, _, rhs] => lhs == rhs,
                        _ => false,
                    })
        })
        .count() as i32
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            ugknbfddgicrmopn
            aaa
            jchzalrnumimnmhp
            haegwjzuvuyypxyu
            dvszwmarrgswjxmb
        "#;

        assert_eq!(part_1(data), 2);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 255);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            qjhvhtzxzqqjkmpb
            xxyxx
            uurcxstgmygtbstg
            ieodomkazucvgmuy
        "#;

        assert_eq!(part_2(data), 2);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 55);
    }
}
