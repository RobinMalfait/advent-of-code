use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2022-05.txt");

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

#[derive(Debug)]
struct Instruction {
    amount: usize,
    from: usize,
    to: usize,
}

pub fn part_1(data: &str) -> String {
    let (stacks, instructions) = data.split_once("\n\n").expect("Valid input");

    let instructions = parse_instructions(instructions);
    let mut stacks = parse_crate_stacks(stacks);

    // Move crates around
    for instruction in instructions {
        for _ in 0..instruction.amount {
            let value = stacks[instruction.from].pop().expect("Crate exists");
            stacks[instruction.to].push(value);
        }
    }

    get_word_from_stacks(&stacks)
}

pub fn part_2(data: &str) -> String {
    let (stacks, instructions) = data.split_once("\n\n").expect("Valid input");

    let instructions = parse_instructions(instructions);
    let mut stacks = parse_crate_stacks(stacks);

    // Move crates around
    for instruction in instructions {
        let mut values_to_move: Vec<String> = vec![];

        for _ in 0..instruction.amount {
            let value = stacks[instruction.from].pop().expect("Crate exists");
            values_to_move.insert(0, value);
        }

        for value in values_to_move {
            stacks[instruction.to].push(value);
        }
    }

    get_word_from_stacks(&stacks)
}

fn parse_instructions(input: &str) -> Vec<Instruction> {
    input
        .lines()
        .flat_map(|x| {
            let parts: Vec<usize> = x
                .replace("move", "")
                .replace("from", ",")
                .replace("to", ",")
                .split(',')
                .flat_map(|x| x.trim().parse())
                .collect();

            if parts.len() == 3 {
                Some(Instruction {
                    amount: parts[0],
                    from: parts[1] - 1,
                    to: parts[2] - 1,
                })
            } else {
                None
            }
        })
        .collect()
}

fn parse_crate_stacks(input: &str) -> Vec<Vec<String>> {
    let stacks = input.replace("    ", "[_]").replace(['[', ']'], " ");
    let mut stacks = stacks
        .lines()
        .map(|line| line.split(' ').filter(|x| !x.is_empty()).collect())
        .collect::<Vec<_>>();

    stacks.pop(); // Ignore the numbers

    transpose(stacks)
        .into_iter()
        .map(|stack| {
            stack
                .into_iter()
                .filter(|x| *x != "_")
                .rev()
                .map(|x| x.to_string())
                .collect()
        })
        .collect()
}

fn get_word_from_stacks(stacks: &[Vec<String>]) -> String {
    stacks
        .iter()
        .flat_map(|stack| stack.last())
        .map(|x| x.to_string())
        .collect::<Vec<_>>()
        .join("")
}

fn transpose<T>(v: Vec<Vec<T>>) -> Vec<Vec<T>> {
    let len = v[0].len();
    let mut iters: Vec<_> = v.into_iter().map(|n| n.into_iter()).collect();
    (0..len)
        .map(|_| {
            iters
                .iter_mut()
                .map(|n| n.next().unwrap())
                .collect::<Vec<_>>()
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = include_str!("../../../../../data/2022-05.sample.txt");

        assert_eq!(part_1(data), "CMZ");
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), "RNZLFZSJH");
    }

    #[test]
    fn part_2_sample() {
        let data = include_str!("../../../../../data/2022-05.sample.txt");

        assert_eq!(part_2(data), "MCD");
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), "CNSFCGJSM");
    }
}
