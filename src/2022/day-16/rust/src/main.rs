use std::collections::BTreeSet;
use std::{
    collections::{HashMap, VecDeque},
    time::Instant,
};

const INPUT: &str = include_str!("../../../../../data/2022-16.txt");

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
    let graph: HashMap<Valve, Vec<String>> = data
        .trim()
        .lines()
        .filter_map(|line| Valve::parse(line.trim()).ok())
        .collect::<HashMap<_, _>>();
    let string_to_valve: HashMap<String, Valve> = graph
        .keys()
        .map(|valve| (valve.name.clone(), valve.clone()))
        .collect();

    solve(
        &graph,
        &string_to_valve,
        string_to_valve.get("AA").expect("Start AA exists"),
        30,
        Default::default(),
        &Turn::Human,
        &mut Default::default(),
    )
}

pub fn part_2(data: &str) -> i32 {
    let graph: HashMap<Valve, Vec<String>> = data
        .trim()
        .lines()
        .filter_map(|line| Valve::parse(line.trim()).ok())
        .collect::<HashMap<_, _>>();
    let string_to_valve: HashMap<String, Valve> = graph
        .keys()
        .map(|valve| (valve.name.clone(), valve.clone()))
        .collect();

    solve(
        &graph,
        &string_to_valve,
        string_to_valve.get("AA").expect("Start AA exists"),
        26,
        Default::default(),
        &Turn::Elephant,
        &mut Default::default(),
    )
}

#[derive(Debug, Hash, PartialEq, Eq, PartialOrd, Ord, Clone, Copy)]
enum Turn {
    Human,
    Elephant,
}

fn solve(
    graph: &HashMap<Valve, Vec<String>>,
    string_to_valve: &HashMap<String, Valve>,
    current: &Valve,
    minutes_left: i32,
    seen: BTreeSet<Valve>,
    turn: &Turn,
    cache: &mut HashMap<(Valve, BTreeSet<Valve>, i32, Turn), i32>,
) -> i32 {
    let cache_key = (current.clone(), seen.clone(), minutes_left, *turn);

    if cache.contains_key(&cache_key) {
        return *cache.get(&cache_key).unwrap();
    }

    if minutes_left <= 0 {
        return match turn {
            Turn::Human => 0,
            Turn::Elephant => solve(
                graph,
                string_to_valve,
                string_to_valve.get("AA").expect("Start AA exists"),
                26,
                seen,
                &Turn::Human,
                cache,
            ),
        };
    }

    let mut best_solution = 0;

    if !seen.contains(current) && current.rate > 0 {
        let mut new_seen = seen.clone();
        new_seen.insert(current.clone());

        let pressure = current.rate * (minutes_left - 1);

        best_solution = best_solution.max(
            pressure
                + solve(
                    graph,
                    string_to_valve,
                    current,
                    minutes_left - 1,
                    new_seen.clone(),
                    turn,
                    cache,
                ),
        );
    }

    if let Some(others) = graph.get(current) {
        for other in others {
            best_solution = best_solution.max(solve(
                graph,
                string_to_valve,
                string_to_valve.get(other).unwrap(),
                minutes_left - 1,
                seen.clone(),
                turn,
                cache,
            ));
        }
    }

    cache.insert(cache_key, best_solution);

    best_solution
}

#[derive(Debug, PartialEq, Eq, Clone, Hash, Ord, PartialOrd)]
struct Valve {
    name: String,
    rate: i32,
}

impl Valve {
    fn parse(s: &str) -> Result<(Valve, Vec<String>), ()> {
        let list = s
            .replace("Valve ", "")
            .replace(" has flow rate=", ", ")
            .replace("; tunnels lead to valves ", ", ")
            .replace("; tunnel leads to valve ", ", ");
        let mut info: VecDeque<_> = list.split(", ").collect();

        Ok((
            Valve {
                name: info.pop_front().unwrap().to_string(),
                rate: info.pop_front().unwrap().parse::<i32>().unwrap(),
            },
            info.into_iter().map(|x| x.to_string()).collect::<Vec<_>>(),
        ))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
            Valve BB has flow rate=13; tunnels lead to valves CC, AA
            Valve CC has flow rate=2; tunnels lead to valves DD, BB
            Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
            Valve EE has flow rate=3; tunnels lead to valves FF, DD
            Valve FF has flow rate=0; tunnels lead to valves EE, GG
            Valve GG has flow rate=0; tunnels lead to valves FF, HH
            Valve HH has flow rate=22; tunnel leads to valve GG
            Valve II has flow rate=0; tunnels lead to valves AA, JJ
            Valve JJ has flow rate=21; tunnel leads to valve II
        "#;

        assert_eq!(part_1(data), 1_651);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 1_716);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
            Valve BB has flow rate=13; tunnels lead to valves CC, AA
            Valve CC has flow rate=2; tunnels lead to valves DD, BB
            Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
            Valve EE has flow rate=3; tunnels lead to valves FF, DD
            Valve FF has flow rate=0; tunnels lead to valves EE, GG
            Valve GG has flow rate=0; tunnels lead to valves FF, HH
            Valve HH has flow rate=22; tunnel leads to valve GG
            Valve II has flow rate=0; tunnels lead to valves AA, JJ
            Valve JJ has flow rate=21; tunnel leads to valve II
        "#;

        assert_eq!(part_2(data), 1707);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 2504);
    }
}
