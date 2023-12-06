use std::str::FromStr;
use std::{collections::BTreeMap, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2023-05.txt");

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
    let program: Program = data.trim().parse().unwrap();

    program
        .seeds
        .iter()
        .map(|seed| {
            let a = locate(*seed, &program.maps["seed-to-soil"]);
            let b = locate(a, &program.maps["soil-to-fertilizer"]);
            let c = locate(b, &program.maps["fertilizer-to-water"]);
            let d = locate(c, &program.maps["water-to-light"]);
            let e = locate(d, &program.maps["light-to-temperature"]);
            let f = locate(e, &program.maps["temperature-to-humidity"]);

            locate(f, &program.maps["humidity-to-location"])
        })
        .min()
        .unwrap() as i32
}

pub fn part_2(data: &str) -> i32 {
    let program: Program = data.trim().parse().unwrap();

    program
        .seeds
        .chunks(2)
        .filter_map(|pairs| {
            let [start, len] = pairs[..2] else { panic!("Invalid chunk"); };
            let q = vec![(start, start + len)];

            let a = locate_range(&q, &program.maps["seed-to-soil"]);
            let b = locate_range(&a, &program.maps["soil-to-fertilizer"]);
            let c = locate_range(&b, &program.maps["fertilizer-to-water"]);
            let d = locate_range(&c, &program.maps["water-to-light"]);
            let e = locate_range(&d, &program.maps["light-to-temperature"]);
            let f = locate_range(&e, &program.maps["temperature-to-humidity"]);
            let g = locate_range(&f, &program.maps["humidity-to-location"]);

            g.iter().map(|x| x.0).min()
        })
        .min()
        .unwrap() as i32
}

fn locate(input: i64, ranges: &Vec<(i64, i64, i64)>) -> i64 {
    for (dst, src, len) in ranges {
        if input >= *src && input < src + len {
            return dst + (input - src);
        }
    }

    input
}

fn locate_range(seed_ranges: &[(i64, i64)], map_ranges: &[(i64, i64, i64)]) -> Vec<(i64, i64)> {
    let mut next_seed_ranges = Vec::from(seed_ranges);
    let mut done = vec![];

    for (dst, src, len) in map_ranges {
        let dst = *dst;
        let working_seed_ranges = next_seed_ranges.clone();
        next_seed_ranges.clear();

        let range_start = *src;
        let range_end = src + len;

        for (seed_start, seed_end) in working_seed_ranges {
            // Comparison chart:
            // 0.          ├──────────────────────────┤              Range we are comparing with (range_start, range_end)
            //             ┊                          ┊
            // 1. ├──────┤ ┊                          ┊              Completely before
            //             ┊                          ┊
            // 2.          ┊                          ┊ ├───────┤    Completely after
            //             ┊                          ┊
            // 3.        ├──────────────────────────────┤            Completely overlapping
            //             ┊                          ┊
            // 4.    ├───────────┤                    ┊              Overlapping start
            //             ┊                          ┊
            // 5.          ┊                    ├───────────┤        Overlapping end
            //             ┊                          ┊
            // 6.          ┊      ├────────────┤      ┊              Completely inside

            // 🎶 Cut my ranges into pieces, this is my last resort. Suffication computing.

            // 0.          ├──────────────────────────┤
            // 1. ├──────┤ ┊                          ┊
            if seed_end < range_start {
                next_seed_ranges.push((seed_start, seed_end.min(range_start)));
            }
            // 0.          ├──────────────────────────┤
            // 2.          ┊                          ┊ ├───────┤
            else if seed_start > range_end {
                next_seed_ranges.push((range_end.max(seed_start), seed_end));
            }
            // 0.          ├──────────────────────────┤
            // 3.        ├──────────────────────────────┤
            else if seed_start <= range_start && seed_end >= range_end {
                // Before part
                next_seed_ranges.push((seed_start, range_start));

                // Middle part
                done.push((dst, dst + (range_end - range_start)));

                // After part
                next_seed_ranges.push((range_end, seed_end));
            }
            // 0.          ├──────────────────────────┤
            // 4.    ├───────────┤                    ┊
            else if seed_start < range_start && seed_end > range_start {
                // Before part
                next_seed_ranges.push((seed_start, range_start));

                // Middle part
                done.push((dst, dst + (seed_end - range_start)));
            }
            // 0.          ├──────────────────────────┤
            // 5.          ┊                    ├───────────┤
            else if seed_start < range_end && seed_end > range_end {
                // Middle part
                done.push((
                    dst + (seed_start - range_start),
                    dst + (range_end - range_start),
                ));

                // After part
                next_seed_ranges.push((range_end, seed_end));
            }
            // 0.          ├──────────────────────────┤
            // 6.          ┊      ├────────────┤      ┊
            else if seed_start >= range_start && seed_end <= range_end {
                done.push((
                    dst + (seed_start - range_start),
                    dst + (seed_end - range_start),
                ));
            }
        }
    }

    done.extend(next_seed_ranges);
    done
}

#[derive(Debug)]
struct Program {
    seeds: Vec<i64>,
    maps: BTreeMap<String, Vec<(i64, i64, i64)>>,
}

impl FromStr for Program {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut info = s.split("\n\n");
        let seeds = info
            .next()
            .unwrap()
            .trim()
            .replace("seeds: ", "")
            .split_whitespace()
            .filter_map(|x| x.parse().ok())
            .collect::<Vec<i64>>();

        let mut maps = BTreeMap::new();
        for map in info {
            let mut line = map.trim().split('\n');
            let name = line.next().unwrap().replace(" map:", "");
            let mut map = Vec::new();

            for line in line {
                let line = line
                    .split_whitespace()
                    .filter_map(|x| x.parse().ok())
                    .collect::<Vec<i64>>();
                map.push((line[0], line[1], line[2]));
            }

            maps.insert(name, map);
        }

        Ok(Self { seeds, maps })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
            seeds: 79 14 55 13

            seed-to-soil map:
            50 98 2
            52 50 48

            soil-to-fertilizer map:
            0 15 37
            37 52 2
            39 0 15

            fertilizer-to-water map:
            49 53 8
            0 11 42
            42 0 7
            57 7 4

            water-to-light map:
            88 18 7
            18 25 70

            light-to-temperature map:
            45 77 23
            81 45 19
            68 64 13

            temperature-to-humidity map:
            0 69 1
            1 0 69

            humidity-to-location map:
            60 56 37
            56 93 4
        "#;

        assert_eq!(part_1(data), 35);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 31599214);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
            seeds: 79 14 55 13

            seed-to-soil map:
            50 98 2
            52 50 48

            soil-to-fertilizer map:
            0 15 37
            37 52 2
            39 0 15

            fertilizer-to-water map:
            49 53 8
            0 11 42
            42 0 7
            57 7 4

            water-to-light map:
            88 18 7
            18 25 70

            light-to-temperature map:
            45 77 23
            81 45 19
            68 64 13

            temperature-to-humidity map:
            0 69 1
            1 0 69

            humidity-to-location map:
            60 56 37
            56 93 4
        "#;

        assert_eq!(part_2(data), 46);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 20358599);
    }
}
