use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2024-07.txt");

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

pub fn part_1(blob: &str) -> i64 {
    blob.trim()
        .lines()
        .map(|line| line.trim())
        .map(|line| {
            let Some((target, args)) = line.split_once(": ") else {
                panic!("Invalid line: {}", line);
            };
            let target = target.parse::<i64>().expect("A target");
            let args = args
                .split(' ')
                .map(|x| x.parse::<i64>().expect("A number"))
                .collect::<Vec<_>>();
            (target, args)
        })
        .map(|(target, args)| {
            let mut results = vec![args[0]];

            for arg in args.iter().skip(1) {
                let copy = results.clone();
                results.clear();
                for result in copy {
                    let add = result + arg;
                    if add <= target {
                        results.push(add);
                    }

                    let mul = result * arg;
                    if mul <= target {
                        results.push(mul);
                    }
                }
            }

            if results.contains(&target) {
                target
            } else {
                0
            }
        })
        .sum()
}

pub fn part_2(blob: &str) -> i64 {
    blob.trim()
        .lines()
        .map(|line| line.trim())
        .map(|line| {
            let Some((target, args)) = line.split_once(": ") else {
                panic!("Invalid line: {}", line);
            };
            let target = target.parse::<i64>().expect("A target");
            let args = args
                .split(' ')
                .map(|x| x.parse::<i64>().expect("A number"))
                .collect::<Vec<_>>();
            (target, args)
        })
        .map(|(target, args)| {
            let mut results = vec![args[0]];

            for arg in args.iter().skip(1) {
                let mut new_results = vec![];
                for result in results.iter() {
                    let add = result + arg;
                    if add <= target {
                        new_results.push(add);
                    }

                    let mul = result * arg;
                    if mul <= target {
                        new_results.push(mul);
                    }

                    let concat = match arg {
                        c if *c < 10 => result * 10 + arg,
                        c if *c < 100 => result * 100 + arg,
                        c if *c < 1000 => result * 1000 + arg,
                        _ => format!("{}{}", result, arg)
                            .parse::<i64>()
                            .expect("A number"),
                    };
                    if concat <= target {
                        new_results.push(concat);
                    }
                }
                results = new_results;
            }

            if results.contains(&target) {
                target
            } else {
                0
            }
        })
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            190: 10 19
            3267: 81 40 27
            83: 17 5
            156: 15 6
            7290: 6 8 6 15
            161011: 16 10 13
            192: 17 8 14
            21037: 9 7 18 13
            292: 11 6 16 20
        "#;

        assert_eq!(part_1(data), 3749);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 6392012777720);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            190: 10 19
            3267: 81 40 27
            83: 17 5
            156: 15 6
            7290: 6 8 6 15
            161011: 16 10 13
            192: 17 8 14
            21037: 9 7 18 13
            292: 11 6 16 20
        "#;

        assert_eq!(part_2(data), 11387);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 61561126043536);
    }
}
