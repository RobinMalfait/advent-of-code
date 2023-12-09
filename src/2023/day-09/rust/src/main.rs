use std::time::Instant;

const INPUT: &str = include_str!("../../../../../data/2023-09.txt");

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
    data.trim()
        .lines()
        .map(|line| {
            line.split_whitespace()
                .map(|x| x.parse::<i32>().unwrap())
                .collect::<Vec<_>>()
        })
        .map(next)
        .sum()
}

pub fn part_2(data: &str) -> i32 {
    data.trim()
        .lines()
        .map(|line| {
            line.split_whitespace()
                .map(|x| x.parse::<i32>().unwrap())
                .collect::<Vec<_>>()
        })
        .map(previous)
        .sum()
}

fn next(history: Vec<i32>) -> i32 {
    let mut sum = 0;

    let diffs = history
        .windows(2)
        .map(|x| match x {
            [a, b] => b - a,
            _ => unreachable!(),
        })
        .collect::<Vec<_>>();
    if !diffs.iter().all(|x| *x == 0) {
        sum += next(diffs)
    }

    return history.last().unwrap() + sum;
}

fn previous(history: Vec<i32>) -> i32 {
    let mut sum = 0;

    let diffs = history
        .windows(2)
        .map(|x| match x {
            [a, b] => b - a,
            _ => unreachable!(),
        })
        .collect::<Vec<_>>();
    if !diffs.iter().all(|x| *x == 0) {
        sum += previous(diffs)
    }

    return history.first().unwrap() - sum;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_1_sample() {
        //     [
        //       `
        //
        //       `,
        //       18,
        //     ],
        //     [
        //       `
        //
        //       `,
        //       28,
        //     ],
        //     [
        //       `
        //
        //       `,
        //       68,
        //     ],
        //     [
        //       `
        //       `,
        //       114,
        //     ],
        let data = r#"
          0 3 6 9 12 15
        "#;

        assert_eq!(part_1(data), 18);

        let data = r#"
          1 3 6 10 15 21
        "#;

        assert_eq!(part_1(data), 28);

        let data = r#"
          10 13 16 21 30 45
        "#;

        assert_eq!(part_1(data), 68);

        let data = r#"
            0 3 6 9 12 15
            1 3 6 10 15 21
            10 13 16 21 30 45
        "#;

        assert_eq!(part_1(data), 114);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 1666172641);
    }

    #[test]
    fn part_2_sample() {
        let data = r#"
          10  13  16  21  30  45
        "#;

        assert_eq!(part_2(data), 5);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 933);
    }
}
// describe('Part 1', () => {
//
//   it.each([
//   ])('should produce the correct value for example %#', (input, expected) => {
//     expect(part1(input)).toBe(expected)
//   })
//
//   it('should produce the correct value for the input data', async () => {
//     expect(part1(await data)).toMatchInlineSnapshot(`1666172641`)
//   })
// })
//
// describe('Part 2', () => {
//   it.each([
//     [
//       `
//         10  13  16  21  30  45
//       `,
//       5,
//     ],
//   ])('should produce the correct value for example %#', (input, expected) => {
//     expect(part2(input)).toBe(expected)
//   })
//
//   it('should produce the correct value for the input data', async () => {
//     expect(part2(await data)).toMatchInlineSnapshot(`933`)
//   })
// })
