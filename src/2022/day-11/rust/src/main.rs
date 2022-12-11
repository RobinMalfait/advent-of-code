use std::{
    collections::{HashMap, VecDeque},
    str::FromStr,
    time::Instant,
};

const INPUT: &str = include_str!("../../../../../data/2022-11.txt");

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

pub fn part_1(data: &str) -> usize {
    solve(data, 20, |value| value / 3).unwrap()
}

pub fn part_2(data: &str) -> usize {
    let common: usize = data
        .lines()
        .filter(|line| line.contains("Test: divisible by"))
        .flat_map(|line| {
            line.trim()
                .replace("Test: divisible by ", "")
                .parse::<usize>()
        })
        .product();
    solve(data, 10000, |value| value % common).unwrap()
}

fn solve<T>(data: &str, rounds: usize, stress_reducer: T) -> Option<usize>
where
    T: Fn(usize) -> usize,
{
    use Op::*;
    use Value::*;

    let mut monkeys: HashMap<i32, Monkey> = Default::default();
    let mut activity_monitor = vec![];
    for monkey in data
        .split("\n\n")
        .flat_map(|block| block.parse())
        .collect::<Vec<Monkey>>()
    {
        activity_monitor.push(0);
        monkeys.insert(monkey.id, monkey);
    }

    let mut current_monkey = 0;

    for _ in 0..rounds * monkeys.len() {
        let monkey_true_id = monkeys.get(&current_monkey)?.goto_true;
        let monkey_false_id = monkeys.get(&current_monkey)?.goto_false;

        let mut monkey_true_values = vec![];
        let mut monkey_false_values = vec![];

        if let Some(monkey) = monkeys.get_mut(&current_monkey) {
            activity_monitor[current_monkey as usize] += monkey.items.len();

            while let Some(item) = monkey.items.pop_front() {
                let mut new_worry_level = match monkey.operation {
                    Add(Old, Constant(value)) => item + value,
                    Add(Old, Old) => item + item,
                    Multiply(Old, Constant(value)) => item * value,
                    Multiply(Old, Old) => item * item,
                    _ => unreachable!(),
                };

                new_worry_level = stress_reducer(new_worry_level);

                if new_worry_level % monkey.divisible_by == 0 {
                    monkey_true_values.push(new_worry_level);
                } else {
                    monkey_false_values.push(new_worry_level);
                }
            }
        }

        if let Some(monkey) = monkeys.get_mut(&monkey_true_id) {
            monkey.items.extend(monkey_true_values);
        }

        if let Some(monkey) = monkeys.get_mut(&monkey_false_id) {
            monkey.items.extend(monkey_false_values);
        }

        current_monkey = (current_monkey + 1) % monkeys.len() as i32;
    }

    activity_monitor.sort_by(|a, z| z.cmp(a));
    activity_monitor.into_iter().take(2).reduce(|a, b| a * b)
}

#[derive(Debug)]
struct Monkey {
    id: i32,
    items: VecDeque<usize>,
    operation: Op,
    divisible_by: usize,
    goto_true: i32,
    goto_false: i32,
}

impl FromStr for Monkey {
    type Err = std::num::ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let lines: Vec<&str> = s.lines().map(|line| line.trim()).collect();

        Ok(Monkey {
            id: lines[0].replace("Monkey ", "").replace(':', "").parse()?,
            items: lines[1]
                .replace("Starting items: ", "")
                .split(", ")
                .filter_map(|value| value.parse().ok())
                .collect(),
            operation: match lines[2]
                .replace("Operation: new = ", "")
                .split(' ')
                .collect::<Vec<_>>()[..]
            {
                ["old", "+", "old"] => Op::Add(Value::Old, Value::Old),
                ["old", "*", "old"] => Op::Multiply(Value::Old, Value::Old),
                ["old", "+", value] => Op::Add(Value::Old, Value::Constant(value.parse()?)),
                ["old", "*", value] => Op::Multiply(Value::Old, Value::Constant(value.parse()?)),
                _ => unreachable!(),
            },
            divisible_by: lines[3].replace("Test: divisible by ", "").parse()?,
            goto_true: lines[4].replace("If true: throw to monkey ", "").parse()?,
            goto_false: lines[5].replace("If false: throw to monkey ", "").parse()?,
        })
    }
}

#[derive(Debug)]
enum Op {
    Add(Value, Value),
    Multiply(Value, Value),
}

#[derive(Debug)]
enum Value {
    Constant(usize),
    Old,
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2022-11.sample.txt");

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), 10605);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 119715);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(part_2(SAMPLE), 2713310158);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 18085004878);
    }
}
