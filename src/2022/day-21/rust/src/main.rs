use std::{collections::HashMap, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-21.txt");

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

pub fn part_1(data: &str) -> i128 {
    let monkeys: HashMap<String, Monkey> = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse().ok())
        .map(|monkey: Monkey| (monkey.name.to_owned(), monkey))
        .collect();

    compute(&monkeys, "root", None).unwrap()
}

pub fn part_2(data: &str) -> i128 {
    let mut monkeys: HashMap<String, Monkey> = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse().ok())
        .map(|monkey: Monkey| (monkey.name.to_owned(), monkey))
        .collect();

    // Update Root
    if let Some(monkey) = monkeys.get_mut("root") {
        if let Value::Operation(
            Operation::Add(lhs, rhs)
            | Operation::Sub(lhs, rhs)
            | Operation::Mul(lhs, rhs)
            | Operation::Div(lhs, rhs),
        ) = &mut monkey.value
        {
            monkey.value = Value::Operation(Operation::Eq(lhs.to_string(), rhs.to_string()));
        }
    }

    // Mark humn as Unknown
    if let Some(monkey) = monkeys.get_mut("humn") {
        monkey.value = Value::Unknown;
    }

    if let Some(Monkey {
        value: Value::Operation(Operation::Eq(lhs, rhs)),
        ..
    }) = monkeys.get("root")
    {
        let target = compute(&monkeys, rhs, None).unwrap();

        // Binary search? Lame...
        let mut lo = 0;
        let mut hi = 10_000_000_000_000;

        loop {
            let mid = (lo + hi) / 2;

            match compute(&monkeys, lhs, Some(mid)) {
                Some(value) => match value.cmp(&target) {
                    std::cmp::Ordering::Less => hi = mid - 1,
                    std::cmp::Ordering::Greater => lo = mid,
                    std::cmp::Ordering::Equal => return mid,
                },
                None => unreachable!(),
            }
        }
    }

    unreachable!()
}

fn compute(monkeys: &HashMap<String, Monkey>, name: &str, guess: Option<i128>) -> Option<i128> {
    let monkey = monkeys.get(name).unwrap();

    match &monkey.value {
        Value::Constant(value) => Some(*value),
        Value::Operation(op) => match op {
            Operation::Add(lhs, rhs) => {
                match (compute(monkeys, lhs, guess), compute(monkeys, rhs, guess)) {
                    (Some(a), Some(b)) => Some(a + b),
                    _ => None,
                }
            }
            Operation::Sub(lhs, rhs) => {
                match (compute(monkeys, lhs, guess), compute(monkeys, rhs, guess)) {
                    (Some(a), Some(b)) => Some(a - b),
                    _ => None,
                }
            }
            Operation::Mul(lhs, rhs) => {
                match (compute(monkeys, lhs, guess), compute(monkeys, rhs, guess)) {
                    (Some(a), Some(b)) => Some(a * b),
                    _ => None,
                }
            }
            Operation::Div(lhs, rhs) => {
                match (compute(monkeys, lhs, guess), compute(monkeys, rhs, guess)) {
                    (Some(a), Some(b)) => Some(a / b),
                    _ => None,
                }
            }
            _ => None,
        },
        Value::Unknown => guess,
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct Monkey {
    name: String,
    value: Value,
}

impl FromStr for Monkey {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut parts = s.split(": ");

        Ok(Monkey {
            name: parts.next().unwrap().to_string(),
            value: parts.next().unwrap().parse()?,
        })
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
enum Value {
    Unknown,
    Constant(i128),
    Operation(Operation),
}

impl FromStr for Value {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s.parse::<i128>() {
            Ok(value) => Value::Constant(value),
            Err(_) => {
                let mut parts = s.split(' ');

                Value::Operation(
                    match (
                        parts.next().unwrap().to_string(),
                        parts.next().unwrap(),
                        parts.next().unwrap().to_string(),
                    ) {
                        (lhs, "=", rhs) => Operation::Eq(lhs, rhs),
                        (lhs, "+", rhs) => Operation::Add(lhs, rhs),
                        (lhs, "-", rhs) => Operation::Sub(lhs, rhs),
                        (lhs, "*", rhs) => Operation::Mul(lhs, rhs),
                        (lhs, "/", rhs) => Operation::Div(lhs, rhs),
                        _ => return Err(()),
                    },
                )
            }
        })
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
enum Operation {
    Eq(String, String),
    Add(String, String),
    Sub(String, String),
    Mul(String, String),
    Div(String, String),
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2022-21.sample.txt");

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), 152);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 232_974_643_455_000);
    }

    #[test]
    #[ignore]
    fn part_2_sample() {
        assert_eq!(part_2(SAMPLE), 301);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 3_740_214_169_961);
    }
}
