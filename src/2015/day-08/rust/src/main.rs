use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2015-08.txt");

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
    let total_characters = data.trim().lines().map(|line| line.len()).sum::<usize>();
    let total_contents = data
        .trim()
        .lines()
        .map(|line| line.replace("\\\\", "_").replace("\\\"", "_"))
        .map(|line| {
            let mut replaced = line.clone();
            line.chars()
                .collect::<Vec<_>>()
                .windows(4)
                .for_each(|x| match x {
                    ['\\', 'x', a, b] if a.is_ascii_hexdigit() && b.is_ascii_hexdigit() => {
                        replaced = replaced.replace(&format!("\\x{}{}", a, b), "_");
                    }
                    _ => {}
                });
            replaced
        })
        .map(|line| line.len() - 2)
        .sum::<usize>();

    total_characters - total_contents
}

pub fn part_2(data: &str) -> usize {
    let total_characters = data.trim().lines().map(|line| line.len()).sum::<usize>();
    let total_contents = data
        .trim()
        .lines()
        .map(|line| format!("\"{}\"", line.replace('\\', "\\\\").replace('\"', "\\\"")))
        .map(|line| line.len())
        .sum::<usize>();

    total_contents - total_characters
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2015-08.sample.txt");

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), 12);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 1342);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(part_2(SAMPLE), 19);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 2074);
    }
}
