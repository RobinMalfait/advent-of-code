use std::collections::BTreeMap;
use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2023-08.txt");

fn main() {
    let input = INPUT
        .replace(" = ", " ")
        .replace(['(', ')'], "")
        .replace(", ", " ");

    let now = Instant::now();
    let part_1_result = part_1(&input);
    let duration = now.elapsed();
    println!("Part 1: {:<20}(took: {:>12?})", part_1_result, duration);

    let now = Instant::now();
    let part_2_result = part_2(&input);
    let duration = now.elapsed();
    println!("Part 2: {:<20}(took: {:>12?})", part_2_result, duration);
}

pub fn part_1(data: &str) -> i32 {
    let (instructions, map) = parse(data.trim());

    let start = "AAA";
    let end = "ZZZ";

    let mut steps = 0;
    let mut current = start;

    while current != end {
        let dir = instructions[steps % instructions.len()];
        current = map.get(current).unwrap()[dir];
        steps += 1;
    }

    steps as i32
}

pub fn part_2(data: &str) -> i64 {
    let (instructions, map) = parse(data.trim());

    let mut steps = 0_i64;
    let mut total = 1_i64;
    let mut todo = map.keys().filter(|k| k.ends_with('A')).collect::<Vec<_>>();

    while !todo.is_empty() {
        let dir = instructions[steps as usize % instructions.len()];

        for i in (0..todo.len()).rev() {
            let current = todo[i];
            if current.ends_with('Z') {
                total = lcm(total, steps);
                todo.remove(i);
            } else {
                todo[i] = &map.get(current).unwrap()[dir];
            }
        }

        steps += 1;
    }

    total
}

fn parse(s: &str) -> (Vec<usize>, BTreeMap<&str, Vec<&str>>) {
    let (instructions, map) = s.split_once("\n\n").unwrap();

    (
        instructions
            .trim()
            .chars()
            .map(|c| match c {
                'L' => 0,
                'R' => 1,
                _ => unreachable!(),
            })
            .collect::<Vec<_>>(),
        map
            .lines()
            .map(|line| line.trim())
            .map(|line| {
                let [label, left, right] = line.split_whitespace().collect::<Vec<_>>()[..] else { unreachable!() };
                (label, vec![left, right])
            })
            .collect(),
    )
}

fn lcm(x: i64, y: i64) -> i64 {
    if x == 0 || y == 0 {
        return 0;
    }

    ((x * y) / gcd(x, y)).abs()
}

fn gcd(x: i64, y: i64) -> i64 {
    if y == 0 {
        return x;
    }

    gcd(y, x % y)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
          RL

          AAA = (BBB, CCC)
          BBB = (DDD, EEE)
          CCC = (ZZZ, GGG)
          DDD = (DDD, DDD)
          EEE = (EEE, EEE)
          GGG = (GGG, GGG)
          ZZZ = (ZZZ, ZZZ)
        "#
        .replace(" = ", " ")
        .replace(['(', ')'], "")
        .replace(", ", " ");

        assert_eq!(part_1(&data), 2);
    }

    #[test]
    fn part_1_real() {
        let input = INPUT
            .replace(" = ", " ")
            .replace(['(', ')'], "")
            .replace(", ", " ");

        assert_eq!(part_1(&input), 15871);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            LR

            11A = (11B, XXX)
            11B = (XXX, 11Z)
            11Z = (11B, XXX)
            22A = (22B, XXX)
            22B = (22C, 22C)
            22C = (22Z, 22Z)
            22Z = (22B, 22B)
            XXX = (XXX, XXX)
        "#
        .replace(" = ", " ")
        .replace(['(', ')'], "")
        .replace(", ", " ");

        assert_eq!(part_2(&data), 6);
    }

    #[test]
    fn part_2_real() {
        let input = INPUT
            .replace(" = ", " ")
            .replace(['(', ')'], "")
            .replace(", ", " ");

        assert_eq!(part_2(&input), 11_283_670_395_017);
    }
}
