use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2016-03.txt");

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
    let triangles = data
        .trim()
        .lines()
        .map(|line| {
            line.split_whitespace()
                .filter_map(|s| s.parse::<i32>().ok())
                .collect::<Vec<i32>>()
        })
        .collect::<Vec<_>>();

    triangles.iter().filter(|t| is_valid_triangle(t)).count() as i32
}

pub fn part_2(data: &str) -> i32 {
    let triangles = data
        .trim()
        .lines()
        .map(|line| {
            line.split_whitespace()
                .filter_map(|s| s.parse::<i32>().ok())
                .collect::<Vec<i32>>()
        })
        .collect::<Vec<_>>();

    let columns = transpose(triangles);
    let columns = columns.into_iter().flatten().collect::<Vec<_>>();
    let columns = columns.chunks(3).collect::<Vec<_>>();
    columns.iter().filter(|t| is_valid_triangle(t)).count() as i32
}

fn is_valid_triangle(triangle: &[i32]) -> bool {
    triangle[0] + triangle[1] > triangle[2]
        && triangle[0] + triangle[2] > triangle[1]
        && triangle[1] + triangle[2] > triangle[0]
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
        assert_eq!(part_1("5 10 25"), 0);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 982);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 1826);
    }
}
