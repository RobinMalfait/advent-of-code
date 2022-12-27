use rayon::prelude::*;
use std::{str::FromStr, time::Instant};

use crate::range::{Range, RangeStack};

const INPUT: &str = include_str!("../../../../../data/2022-15.txt");

mod range;

fn main() {
    let now = Instant::now();
    let part_1_result = part_1(INPUT, 2_000_000);
    let duration = now.elapsed();
    println!("Part 1: {:<20}(took: {:>12?})", part_1_result, duration);

    let now = Instant::now();
    let part_2_result = part_2(INPUT, 0, 4_000_000);
    let duration = now.elapsed();
    println!("Part 2: {:<20}(took: {:>12?})", part_2_result, duration);
}

pub fn part_1(data: &str, y: i32) -> i32 {
    let reports = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse().ok())
        .collect::<Vec<Report>>();

    let range_stack: RangeStack = reports
        .iter()
        .filter_map(|report| {
            let m = report.sensor.manhatten_distance_to(&report.beacon);
            let min_y = report.sensor.y - m;
            let max_y = report.sensor.y + m;

            if min_y <= y && y <= max_y {
                let remaining = m.abs_diff(report.sensor.y.abs_diff(y) as i32);
                let min_x = report.sensor.x - (remaining as i32);
                let max_x = report.sensor.x + (remaining as i32);

                Some(min_x..=max_x)
            } else {
                None
            }
        })
        .map(|range| Range::new(*range.start(), *range.end()))
        .collect();

    range_stack
        .ranges
        .iter()
        .map(|range| range.end - range.start)
        .sum::<i32>()
}

pub fn part_2(data: &str, min_value: i32, max_value: i32) -> u128 {
    let reports = data
        .trim()
        .lines()
        .filter_map(|line| line.trim().parse::<Report>().ok())
        .collect::<Vec<Report>>();

    (min_value..=max_value)
        .into_par_iter()
        .map(|value| {
            let y = max_value - value;

            let range_stack: RangeStack = reports
                .iter()
                .filter_map(|report| {
                    let m = report.sensor.manhatten_distance_to(&report.beacon);

                    let min_y = report.sensor.y - m;
                    let max_y = report.sensor.y + m;

                    if min_y <= y && y <= max_y {
                        let remaining = m.abs_diff(report.sensor.y.abs_diff(y) as i32);
                        let min_x = report.sensor.x - (remaining as i32);
                        let max_x = report.sensor.x + (remaining as i32);

                        Some(min_x.clamp(min_value, max_value)..=max_x.clamp(min_value, max_value))
                    } else {
                        None
                    }
                })
                .map(|range| Range::new(*range.start(), *range.end()))
                .collect();

            (range_stack, y)
        })
        .filter(|(range_stack, _)| range_stack.ranges.len() > 1)
        .find_map_first(|(mut range_stack, y)| {
            let z = range_stack.ranges.pop().unwrap();
            let a = range_stack.ranges.pop().unwrap();

            let diff = z.start - a.end;

            // 13 [..] 15
            // → 15 - 13 = 2
            if diff != 2 {
                None
            } else {
                let x = z.start - 1;
                Some(x as u128 * 4_000_000 + y as u128)
            }
        })
        .expect("An answer should exist")
}

#[derive(Debug)]
struct Report {
    sensor: Point,
    beacon: Point,
}

impl FromStr for Report {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if let Some((sensor_raw, beacon_raw)) = s
            .replace("Sensor at ", "")
            .replace("closest beacon is at ", "")
            .split_once(": ")
        {
            Ok(Report {
                sensor: sensor_raw.parse()?,
                beacon: beacon_raw.parse()?,
            })
        } else {
            Err(())
        }
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn manhatten_distance_to(&self, other: &Point) -> i32 {
        (self.x.abs_diff(other.x) + self.y.abs_diff(other.y)) as i32
    }
}

impl FromStr for Point {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if let Some((x_raw, y_raw)) = s.replace("x=", "").replace("y=", "").split_once(", ") {
            Ok(Point {
                x: x_raw.parse().unwrap(),
                y: y_raw.parse().unwrap(),
            })
        } else {
            Err(())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            Sensor at x=2, y=18: closest beacon is at x=-2, y=15
            Sensor at x=9, y=16: closest beacon is at x=10, y=16
            Sensor at x=13, y=2: closest beacon is at x=15, y=3
            Sensor at x=12, y=14: closest beacon is at x=10, y=16
            Sensor at x=10, y=20: closest beacon is at x=10, y=16
            Sensor at x=14, y=17: closest beacon is at x=10, y=16
            Sensor at x=8, y=7: closest beacon is at x=2, y=10
            Sensor at x=2, y=0: closest beacon is at x=2, y=10
            Sensor at x=0, y=11: closest beacon is at x=2, y=10
            Sensor at x=20, y=14: closest beacon is at x=25, y=17
            Sensor at x=17, y=20: closest beacon is at x=21, y=22
            Sensor at x=16, y=7: closest beacon is at x=15, y=3
            Sensor at x=14, y=3: closest beacon is at x=15, y=3
            Sensor at x=20, y=1: closest beacon is at x=15, y=3
        "#;

        assert_eq!(part_1(data, 10), 26);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT, 2_000_000), 6_124_805);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            Sensor at x=2, y=18: closest beacon is at x=-2, y=15
            Sensor at x=9, y=16: closest beacon is at x=10, y=16
            Sensor at x=13, y=2: closest beacon is at x=15, y=3
            Sensor at x=12, y=14: closest beacon is at x=10, y=16
            Sensor at x=10, y=20: closest beacon is at x=10, y=16
            Sensor at x=14, y=17: closest beacon is at x=10, y=16
            Sensor at x=8, y=7: closest beacon is at x=2, y=10
            Sensor at x=2, y=0: closest beacon is at x=2, y=10
            Sensor at x=0, y=11: closest beacon is at x=2, y=10
            Sensor at x=20, y=14: closest beacon is at x=25, y=17
            Sensor at x=17, y=20: closest beacon is at x=21, y=22
            Sensor at x=16, y=7: closest beacon is at x=15, y=3
            Sensor at x=14, y=3: closest beacon is at x=15, y=3
            Sensor at x=20, y=1: closest beacon is at x=15, y=3
        "#;

        assert_eq!(part_2(data, 0, 20), 56_000_011);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT, 0, 4_000_000), 12_555_527_364_986);
    }
}
