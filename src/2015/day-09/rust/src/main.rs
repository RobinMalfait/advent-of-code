use std::collections::HashSet;
use std::str::FromStr;
use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2015-09.txt");

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
    let edges = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse::<Edge>().ok())
        .collect::<Vec<_>>();
    let locations: HashSet<Location> = edges
        .iter()
        .flat_map(|x| [x.from.clone(), x.to.clone()])
        .collect();

    dbg!(edges);

    0
}

pub fn part_2(data: &str) -> i32 {
    0
}

#[derive(Debug, Hash, PartialEq, Eq, Clone)]
struct Location {
    name: String,
}

impl FromStr for Location {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(Location {
            name: s.trim().to_string(),
        })
    }
}

#[derive(Debug)]
struct Edge {
    from: Location,
    to: Location,
    distance: i32,
}

impl FromStr for Edge {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut parts = s.split(' ');

        let from = parts.next().unwrap().parse::<Location>()?;
        let _ = parts.next();
        let to = parts.next().unwrap().parse::<Location>()?;
        let _ = parts.next();
        let distance = parts.next().unwrap().parse::<i32>().map_err(|_| ())?;

        Ok(Edge { from, to, distance })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
          London to Dublin = 464
          London to Belfast = 518
          Dublin to Belfast = 141
        "#;

        assert_eq!(part_1(data), 605);
    }

    #[test]
    #[ignore]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 0);
    }

    #[test]
    #[ignore]
    fn part_2_sample() {
        let data = r#"
        "#;

        assert_eq!(part_2(data), 0);
    }

    #[test]
    #[ignore]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 0);
    }
}
