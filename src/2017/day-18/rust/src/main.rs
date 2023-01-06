use std::collections::{HashMap, VecDeque};
use std::{num::ParseIntError, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2017-18.txt");

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

pub fn part_1(data: &str) -> i64 {
    let instructions = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse::<Instruction>().ok())
        .collect::<Vec<Instruction>>();

    let mut vm = Vm::new(&instructions);

    if let Message::FinishWithValue(value) = vm.run() {
        value
    } else {
        panic!("VM did not finish with a value");
    }
}

pub fn part_2(data: &str) -> i64 {
    let instructions = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse::<Instruction>().ok())
        .collect::<Vec<Instruction>>();

    let mut vm_0 = Vm::new_with_p(&instructions, 0);
    let mut vm_1 = Vm::new_with_p(&instructions, 1);

    let mut result = 0;

    loop {
        match (vm_0.run(), vm_1.run()) {
            (Message::Done, Message::Done) => return result,
            (Message::Interupt, Message::Interupt) => return result,
            (Message::Send(value_from_vm_0), Message::Send(value_from_vm_1)) => {
                vm_1.message_queue.push_back(value_from_vm_0);
                vm_0.message_queue.push_back(value_from_vm_1);
                result += 1;
            }
            (Message::Send(value), _) => {
                vm_1.message_queue.push_back(value);
            }
            (_, Message::Send(value)) => {
                vm_0.message_queue.push_back(value);
                result += 1;
            }
            _ => {}
        }
    }
}

enum Part {
    One,
    Two,
}

struct Vm {
    registers: HashMap<char, i64>,
    frequency: i64,
    instructions: Vec<Instruction>,
    idx: usize,
    part: Part,
    message_queue: VecDeque<i64>,
}

#[derive(Debug, PartialEq)]
enum Message {
    Send(i64),
    Interupt,
    FinishWithValue(i64),
    Done,
}

impl Vm {
    fn new(instructions: &[Instruction]) -> Self {
        Self {
            registers: Default::default(),
            frequency: 0,
            instructions: instructions.to_vec(),
            idx: 0,
            part: Part::One,
            message_queue: Default::default(),
        }
    }

    fn new_with_p(instructions: &[Instruction], p: i64) -> Self {
        let mut registers: HashMap<char, i64> = Default::default();
        registers.insert('p', p);

        Self {
            registers,
            frequency: 0,
            instructions: instructions.to_vec(),
            idx: 0,
            part: Part::Two,
            message_queue: Default::default(),
        }
    }

    fn resolve(&self, value: &Value) -> i64 {
        match value {
            Value::Register(c) => *self.registers.get(c).unwrap_or(&0),
            Value::Literal(n) => *n,
        }
    }

    fn store(&mut self, register: char, value: i64) {
        self.registers.insert(register, value);
    }

    fn update_with<F>(&mut self, register: char, update: F)
    where
        F: FnOnce(i64) -> i64,
    {
        self.registers
            .entry(register)
            .and_modify(|v| *v = update(*v));
    }

    fn run(&mut self) -> Message {
        while let Some(instruction) = self.instructions.get(self.idx) {
            match instruction {
                Instruction::Snd(value) => match self.part {
                    Part::One => self.frequency = self.resolve(value),
                    Part::Two => {
                        let value = self.resolve(value);
                        self.idx += 1;
                        return Message::Send(value);
                    }
                },
                Instruction::Rcv(register) => match self.part {
                    Part::One => {
                        if self.resolve(register) != 0 {
                            self.idx += 1;
                            return Message::FinishWithValue(self.frequency);
                        }
                    }
                    Part::Two => {
                        if let Some(value) = self.message_queue.pop_front() {
                            if let Value::Register(register) = register {
                                self.store(*register, value);
                            }
                        } else {
                            return Message::Interupt;
                        }
                    }
                },
                Instruction::Set(Value::Register(register), value) => {
                    self.store(*register, self.resolve(value));
                }
                Instruction::Add(Value::Register(register), value) => {
                    let value = self.resolve(value);
                    self.update_with(*register, |v| v + value);
                }
                Instruction::Mul(Value::Register(register), value) => {
                    let value = self.resolve(value);
                    self.update_with(*register, |v| v * value);
                }
                Instruction::Mod(Value::Register(register), value) => {
                    let value = self.resolve(value);
                    self.update_with(*register, |v| v % value);
                }
                Instruction::Jgz(register, value) => {
                    if self.resolve(register) > 0 {
                        self.idx += self.resolve(value) as usize;
                        continue;
                    }
                }
                x => todo!("{:?}", x),
            }

            self.idx += 1;
        }

        Message::Done
    }
}

#[derive(Debug, Clone)]
enum Instruction {
    Snd(Value),
    Set(Value, Value),
    Add(Value, Value),
    Mul(Value, Value),
    Mod(Value, Value),
    Rcv(Value),
    Jgz(Value, Value),
}

impl FromStr for Instruction {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut parts = s.split_whitespace();
        Ok(match parts.next().unwrap() {
            "snd" => Instruction::Snd(parts.next().unwrap().parse()?),
            "set" => Instruction::Set(
                parts.next().unwrap().parse()?,
                parts.next().unwrap().parse()?,
            ),
            "add" => Instruction::Add(
                parts.next().unwrap().parse()?,
                parts.next().unwrap().parse()?,
            ),
            "mul" => Instruction::Mul(
                parts.next().unwrap().parse()?,
                parts.next().unwrap().parse()?,
            ),
            "mod" => Instruction::Mod(
                parts.next().unwrap().parse()?,
                parts.next().unwrap().parse()?,
            ),
            "rcv" => Instruction::Rcv(parts.next().unwrap().parse()?),
            "jgz" => Instruction::Jgz(
                parts.next().unwrap().parse()?,
                parts.next().unwrap().parse()?,
            ),
            command => panic!("Unknown command: {:#?}", command),
        })
    }
}

#[derive(Debug, Clone)]
enum Value {
    Register(char),
    Literal(i64),
}

impl FromStr for Value {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if let Ok(literal) = s.parse::<i64>() {
            Ok(Value::Literal(literal))
        } else {
            Ok(Value::Register(s.chars().next().unwrap()))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            set a 1
            add a 2
            mul a a
            mod a 5
            snd a
            set a 0
            rcv a
            jgz a -1
            set a 1
            jgz a -2
        "#;

        assert_eq!(part_1(data), 4);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 2951);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            snd 1
            snd 2
            snd p
            rcv a
            rcv b
            rcv c
            rcv d
        "#;

        assert_eq!(part_2(data), 3);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 7366);
    }
}
