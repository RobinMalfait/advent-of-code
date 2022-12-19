use rayon::prelude::*;

use std::{
    collections::{HashSet, VecDeque},
    fmt::Display,
    hash::Hash,
    str::FromStr,
    time::Instant,
};

const INPUT: &str = include_str!("../../../../../data/2022-19.txt");

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

pub fn part_1(data: &str) -> i32 {
    data.trim()
        .lines()
        .filter_map(|line| line.trim().parse().ok())
        .par_bridge()
        .map(|b: Blueprint| b.id * apply_blueprint(State::new(24), b))
        .sum()
}

pub fn part_2(data: &str) -> i32 {
    data.trim()
        .lines()
        .filter_map(|line| line.trim().parse().ok())
        .take(3)
        .par_bridge()
        .map(|b: Blueprint| apply_blueprint(State::new(32), b))
        .product()
}

fn apply_blueprint(state: State, blueprint: Blueprint) -> i32 {
    let mut seen: HashSet<State> = Default::default();
    let mut q: VecDeque<State> = VecDeque::new();
    q.push_back(state);

    let mut max_geode = 0;

    while let Some(state) = q.pop_front() {
        max_geode = max_geode.max(state.geode);

        if state.minutes_left <= 0 {
            continue;
        }

        let state = state.optimize_for(&blueprint);

        if seen.contains(&state) {
            continue;
        }

        seen.insert(state);

        q.push_back(state.tick());
        q.extend(blueprint.robots.iter().filter_map(|robot| state.buy(robot)));
    }

    max_geode
}

#[derive(Debug)]
struct Blueprint {
    id: i32,
    robots: Vec<Robot>,
    max_ore_required: i32,
    max_clay_required: i32,
    max_obsidian_required: i32,
}

impl Display for Blueprint {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "Blueprint {}: {}",
            self.id,
            self.robots
                .iter()
                .map(|robot| robot.to_string())
                .collect::<Vec<_>>()
                .join(" ")
        )
    }
}

#[derive(Debug, Eq, Clone, Copy, Default, PartialOrd, Ord)]
struct State {
    // Time left
    minutes_left: i32,

    // Resources
    ore: i32,
    clay: i32,
    obsidian: i32,
    geode: i32,

    // Robots
    ore_robots: i32,
    clay_robots: i32,
    obsidian_robots: i32,
    geode_robots: i32,
}

impl PartialEq for State {
    fn eq(&self, other: &Self) -> bool {
        // self.minutes_left == other.minutes_left && // Explicitly ignoring this one
        self.ore == other.ore
            && self.clay == other.clay
            && self.obsidian == other.obsidian
            && self.geode == other.geode
            && self.ore_robots == other.ore_robots
            && self.clay_robots == other.clay_robots
            && self.obsidian_robots == other.obsidian_robots
            && self.geode_robots == other.geode_robots
    }
}

impl Hash for State {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        // self.minutes_left.hash(state); // Explicitly ignoring this one
        self.ore.hash(state);
        self.clay.hash(state);
        self.obsidian.hash(state);
        self.geode.hash(state);
        self.ore_robots.hash(state);
        self.clay_robots.hash(state);
        self.obsidian_robots.hash(state);
        self.geode_robots.hash(state);
    }
}

impl State {
    fn new(minutes_left: i32) -> Self {
        Self {
            ore_robots: 1, // You have exactly one ore-collecting robot
            minutes_left,
            ..Default::default()
        }
    }

    // It was running for a few minutes and already taking up 80gb+ of RAM, so... had to optimize
    // it in some way shape or form. The goal is to limit the amount of states we can be in and
    // reduce the search space.
    fn optimize_for(&self, blueprint: &Blueprint) -> Self {
        Self {
            // We only require X amount of a certain mineral, there is no need to build more robots
            // than this.
            ore_robots: self.ore_robots.min(blueprint.max_ore_required),
            clay_robots: self.clay_robots.min(blueprint.max_clay_required),
            obsidian_robots: self.obsidian_robots.min(blueprint.max_obsidian_required),

            // We only require X amount of a certain mineral, and every minute we get an additional
            // mineral. This means that "overstock" is going to be useless and will only increase
            // our search space.
            ore: self.ore.min(
                self.minutes_left * blueprint.max_ore_required
                    - self.ore_robots.min(blueprint.max_ore_required) * (self.minutes_left - 1),
            ),
            clay: self.clay.min(
                self.minutes_left * blueprint.max_clay_required
                    - self.clay_robots.min(blueprint.max_clay_required) * (self.minutes_left - 1),
            ),
            obsidian: self.obsidian.min(
                self.minutes_left * blueprint.max_obsidian_required
                    - self.obsidian_robots.min(blueprint.max_obsidian_required)
                        * (self.minutes_left - 1),
            ),
            ..*self
        }
    }

    fn tick(&self) -> Self {
        Self {
            minutes_left: self.minutes_left - 1,
            ore: self.ore + self.ore_robots,
            clay: self.clay + self.clay_robots,
            obsidian: self.obsidian + self.obsidian_robots,
            geode: self.geode + self.geode_robots,
            ..*self
        }
    }

    fn buy(&self, robot: &Robot) -> Option<Self> {
        let mut state = *self;

        let prices = match robot {
            Robot::Ore(prices)
            | Robot::Clay(prices)
            | Robot::Obsidian(prices)
            | Robot::Geode(prices) => prices,
        };

        for price in prices {
            match price {
                Mineral::Ore(amount) if state.ore >= *amount => state.ore -= amount,
                Mineral::Clay(amount) if state.clay >= *amount => state.clay -= amount,
                Mineral::Obsidian(amount) if state.obsidian >= *amount => state.obsidian -= amount,
                _ => return None,
            }
        }

        let mut state = state.tick();

        match robot {
            Robot::Ore(_) => state.ore_robots += 1,
            Robot::Clay(_) => state.clay_robots += 1,
            Robot::Obsidian(_) => state.obsidian_robots += 1,
            Robot::Geode(_) => state.geode_robots += 1,
        }

        Some(state)
    }
}

#[derive(Debug)]
enum Mineral {
    Ore(i32),
    Clay(i32),
    Obsidian(i32),
}

impl Display for Mineral {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Mineral::Ore(value) => write!(f, "{} ore", value),
            Mineral::Clay(value) => write!(f, "{} clay", value),
            Mineral::Obsidian(value) => write!(f, "{} obsidian", value),
        }
    }
}

#[derive(Debug)]
enum Robot {
    Ore(Vec<Mineral>),
    Clay(Vec<Mineral>),
    Obsidian(Vec<Mineral>),
    Geode(Vec<Mineral>),
}

impl Display for Robot {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "Each {} robot costs {}.",
            match self {
                Robot::Ore(_) => "ore",
                Robot::Clay(_) => "clay",
                Robot::Obsidian(_) => "obsidian",
                Robot::Geode(_) => "geode",
            },
            match self {
                Robot::Ore(minerals)
                | Robot::Clay(minerals)
                | Robot::Obsidian(minerals)
                | Robot::Geode(minerals) => minerals,
            }
            .iter()
            .map(|mineral| mineral.to_string())
            .collect::<Vec<_>>()
            .join(" and ")
        )
    }
}

impl FromStr for Blueprint {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut values = s
            .split(&[' ', ':'])
            .filter_map(|part| part.parse::<i32>().ok());

        let id = values.next().ok_or(())?;
        let mut robots = vec![
            Robot::Ore(vec![Mineral::Ore(values.next().ok_or(())?)]),
            Robot::Clay(vec![Mineral::Ore(values.next().ok_or(())?)]),
            Robot::Obsidian(vec![
                Mineral::Ore(values.next().ok_or(())?),
                Mineral::Clay(values.next().ok_or(())?),
            ]),
            Robot::Geode(vec![
                Mineral::Ore(values.next().ok_or(())?),
                Mineral::Obsidian(values.next().ok_or(())?),
            ]),
        ];

        // PERF: we are interested in `geode`, therefore we need to make `Geode` robots. If we have
        // enough resources to build a geode robot then we should do that before any other robot.
        //
        // This should optimize the search space.
        robots.reverse();

        // PERF: Calculate how many minerals we need at most to build any robot. More minerals will
        // result in more states than necesary.
        let mut max_ore = 0;
        let mut max_clay = 0;
        let mut max_obsidian = 0;

        for robot in &robots {
            let minerals = match robot {
                Robot::Ore(minerals)
                | Robot::Clay(minerals)
                | Robot::Obsidian(minerals)
                | Robot::Geode(minerals) => minerals,
            };

            for mineral in minerals {
                match mineral {
                    Mineral::Ore(amount) => max_ore = max_ore.max(*amount),
                    Mineral::Clay(amount) => max_clay = max_clay.max(*amount),
                    Mineral::Obsidian(amount) => max_obsidian = max_obsidian.max(*amount),
                }
            }
        }

        Ok(Blueprint {
            id,
            robots,
            max_ore_required: max_ore,
            max_clay_required: max_clay,
            max_obsidian_required: max_obsidian,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2022-19.sample.txt");

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), 33);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 1675);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(part_2(SAMPLE), 3472);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 6840);
    }
}
