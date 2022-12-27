use std::collections::{HashSet, VecDeque};
use std::{str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-18.txt");

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
    let cubes: HashSet<Voxel> = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse().ok())
        .collect();

    cubes
        .iter()
        .flat_map(|cube| cube.sides())
        .filter(|side| !cubes.contains(side))
        .count()
}

pub fn part_2(data: &str) -> usize {
    let cubes: HashSet<Voxel> = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse().ok())
        .collect();

    let min_x = cubes.iter().map(|cube| cube.x).min().unwrap();
    let max_x = cubes.iter().map(|cube| cube.x).max().unwrap();

    let min_y = cubes.iter().map(|cube| cube.y).min().unwrap();
    let max_y = cubes.iter().map(|cube| cube.y).max().unwrap();

    let min_z = cubes.iter().map(|cube| cube.z).min().unwrap();
    let max_z = cubes.iter().map(|cube| cube.z).max().unwrap();

    let leaks = |cube: &Voxel| -> bool {
        let mut seen: HashSet<Voxel> = Default::default();
        let mut q: VecDeque<Voxel> = vec![*cube].into();

        while !q.is_empty() {
            let next = q.pop_front().unwrap();

            if seen.contains(&next) || cubes.contains(&next) {
                continue;
            }

            seen.insert(next);

            if next.x < min_x
                || next.x > max_x
                || next.y < min_y
                || next.y > max_y
                || next.z < min_z
                || next.z > max_z
            {
                return true;
            }

            q.extend(next.sides());
        }

        false
    };

    cubes
        .iter()
        .flat_map(|cube| cube.sides())
        .filter(leaks)
        .count()
}

#[derive(Debug, Clone, Copy, Hash, PartialEq, Eq, PartialOrd, Ord)]
struct Voxel {
    x: i32,
    y: i32,
    z: i32,
}

impl Voxel {
    fn sides(&self) -> Vec<Self> {
        let mut sides = vec![];

        for d in [-1, 1] {
            sides.push(Self {
                x: self.x + d,
                ..*self
            });
            sides.push(Self {
                y: self.y + d,
                ..*self
            });
            sides.push(Self {
                z: self.z + d,
                ..*self
            });
        }

        sides
    }
}

impl FromStr for Voxel {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut values: Vec<i32> = s.split(',').filter_map(|x| x.parse().ok()).rev().collect();
        Ok(Voxel {
            x: values.pop().unwrap(),
            y: values.pop().unwrap(),
            z: values.pop().unwrap(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample_simple() {
        let data = r#"
            1,1,1
            2,1,1
        "#;

        assert_eq!(part_1(data), 10);
    }

    #[test]
    fn part_1_sample() {
        let data = r#"
            2,2,2
            1,2,2
            3,2,2
            2,1,2
            2,3,2
            2,2,1
            2,2,3
            2,2,4
            2,2,6
            1,2,5
            3,2,5
            2,1,5
            2,3,5
        "#;

        assert_eq!(part_1(data), 64);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 3374);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            2,2,2
            1,2,2
            3,2,2
            2,1,2
            2,3,2
            2,2,1
            2,2,3
            2,2,4
            2,2,6
            1,2,5
            3,2,5
            2,1,5
            2,3,5
        "#;

        assert_eq!(part_2(data), 58);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 2010);
    }
}
