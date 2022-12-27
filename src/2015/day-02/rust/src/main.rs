use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2015-02.txt");

fn main() {
    let now = Instant::now();
    let part_1_result = part_1(INPUT);
    let duration = now.elapsed();
    println!("Part 1: {}\t\t(took: {:>12?})", part_1_result, duration);

    let now = Instant::now();
    let part_2_result = part_2(INPUT);
    let duration = now.elapsed();
    println!("Part 2: {}\t\t(took: {:>12?})", part_2_result, duration);
}

pub fn part_1(data: &str) -> i32 {
    data.trim()
        .lines()
        .map(|x| {
            let (l, w, h) = if let [l, w, h] = x
                .split('x')
                .map(|x| x.parse::<i32>().unwrap())
                .collect::<Vec<_>>()[..]
            {
                (l, w, h)
            } else {
                (0, 0, 0)
            };

            let additional = vec![l * w, w * h, h * l].into_iter().min().unwrap();

            2 * l * w + 2 * w * h + 2 * h * l + additional
        })
        .sum()
}

pub fn part_2(data: &str) -> i32 {
    data.trim()
        .lines()
        .map(|x| {
            let mut sides: Vec<i32> = x.split('x').map(|x| x.parse::<i32>().unwrap()).collect();
            sides.sort();

            let mut sides = sides.iter();

            let l = sides.next().unwrap();
            let w = sides.next().unwrap();
            let h = sides.next().unwrap();

            2 * l + 2 * w + l * w * h
        })
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        let data = r#"
          2x3x4
        "#;

        assert_eq!(part_1(data), 58);

        let data = r#"
          1x1x10
        "#;

        assert_eq!(part_1(data), 43);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 1598415);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
          2x3x4
        "#;

        assert_eq!(part_2(data), 34);

        let data = r#"
          1x1x10
        "#;

        assert_eq!(part_2(data), 14);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 3812909);
    }
}
