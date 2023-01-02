use std::collections::HashMap;
use std::collections::VecDeque;
use std::{num::ParseIntError, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2015-07.txt");

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

pub fn part_1(data: &str) -> u16 {
    let mut instructions = data
        .trim()
        .lines()
        .filter_map(|line| line.parse::<Instruction>().ok())
        .collect::<VecDeque<_>>();

    let mut registers: HashMap<Value, u16> = Default::default();
    solve(&mut instructions, &mut registers)
}

pub fn part_2(data: &str) -> u16 {
    let mut instructions = data
        .trim()
        .lines()
        .filter_map(|line| line.parse::<Instruction>().ok())
        .collect::<VecDeque<_>>();

    let mut registers: HashMap<Value, u16> = Default::default();
    let value_a = solve(&mut instructions.clone(), &mut registers);

    // Now, take the signal you got on wire a, override wire b to that signal
    instructions.push_back(Instruction::Input {
        input: Value::Constant(value_a),
        output: Value::Identifier("b".to_string()),
    });

    // and reset the other wires (including wire a)
    registers.clear();

    solve(&mut instructions, &mut registers)
}

fn solve(instructions: &mut VecDeque<Instruction>, registers: &mut HashMap<Value, u16>) -> u16 {
    let resolve = |value: Value, registers: &HashMap<Value, u16>| -> Option<u16> {
        match value {
            Value::Constant(value) => Some(value),
            _ => registers.get(&value).copied(),
        }
    };

    while let Some(instruction) = instructions.pop_front() {
        let just_in_case = instruction.clone();

        match instruction {
            Instruction::Input { input, output } => match input {
                Value::Constant(value) => {
                    registers.insert(output, value);
                }
                x @ Value::Identifier(_) => {
                    let Some(value) = resolve(x, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                    registers.insert(output, value);
                }
            },
            Instruction::And { lhs, rhs, output } => {
                let Some(lhs) = resolve(lhs, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                let Some(rhs) = resolve(rhs, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                registers.insert(output, lhs & rhs);
            }
            Instruction::Or { lhs, rhs, output } => {
                let Some(lhs) = resolve(lhs, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                let Some(rhs) = resolve(rhs, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                registers.insert(output, lhs | rhs);
            }
            Instruction::Rshift { lhs, rhs, output } => {
                let Some(lhs) = resolve(lhs, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                let Some(rhs) = resolve(rhs, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                registers.insert(output, lhs >> rhs);
            }
            Instruction::Lshift { lhs, rhs, output } => {
                let Some(lhs) = resolve(lhs, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                let Some(rhs) = resolve(rhs, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                registers.insert(output, lhs << rhs);
            }
            Instruction::Not { input, output } => {
                let Some(input) = resolve(input, registers) else {
                    instructions.push_back(just_in_case);
                    continue;
                };
                registers.insert(output, !input);
            }
        }
    }

    *registers
        .get(&Value::Identifier("a".to_string()))
        .unwrap_or(&0)
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone)]
enum Value {
    Constant(u16),
    Identifier(String),
}

impl FromStr for Value {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s.parse::<u16>() {
            Ok(constant) => Value::Constant(constant),
            _ => Value::Identifier(s.to_string()),
        })
    }
}

#[derive(Debug, Clone)]
enum Instruction {
    Input {
        input: Value,
        output: Value,
    },
    And {
        lhs: Value,
        rhs: Value,
        output: Value,
    },
    Or {
        lhs: Value,
        rhs: Value,
        output: Value,
    },
    Lshift {
        lhs: Value,
        rhs: Value,
        output: Value,
    },
    Rshift {
        lhs: Value,
        rhs: Value,
        output: Value,
    },
    Not {
        input: Value,
        output: Value,
    },
}

impl FromStr for Instruction {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if let Some((instruction, target)) = s.trim().split_once(" -> ") {
            let output = target.parse::<Value>()?;
            let parts = instruction.split(' ').collect::<Vec<_>>();

            return Ok(match parts[..] {
                [lhs, "AND", rhs] => Instruction::And {
                    lhs: lhs.parse()?,
                    rhs: rhs.parse()?,
                    output,
                },
                [lhs, "OR", rhs] => Instruction::Or {
                    lhs: lhs.parse()?,
                    rhs: rhs.parse()?,
                    output,
                },
                [lhs, "LSHIFT", rhs] => Instruction::Lshift {
                    lhs: lhs.parse()?,
                    rhs: rhs.parse()?,
                    output,
                },
                [lhs, "RSHIFT", rhs] => Instruction::Rshift {
                    lhs: lhs.parse()?,
                    rhs: rhs.parse()?,
                    output,
                },
                ["NOT", input] => Instruction::Not {
                    input: input.parse()?,
                    output,
                },
                [input] => Instruction::Input {
                    input: input.parse()?,
                    output,
                },
                _ => todo!("{:?}", s),
            });
        }

        unreachable!();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            123 -> x
            456 -> y
            x AND y -> d
            x OR y -> e
            x LSHIFT 2 -> f
            y RSHIFT 2 -> g
            NOT x -> h
            NOT y -> i
        "#;

        // 0 because no wire `a`
        assert_eq!(part_1(data), 0);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 46_065);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 14_134);
    }
}
