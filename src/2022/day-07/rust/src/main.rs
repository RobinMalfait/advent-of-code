use std::{collections::HashMap, path::PathBuf, str::FromStr, time::Instant};

const INPUT: &str = include_str!("../../../../../data/2022-07.txt");

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
    let fs = build_file_system(data);

    const SIZE_AT_MOST: i32 = 100_000;

    fs.ls()
        .into_iter()
        .filter(|ident| ident.path != PathBuf::from("/"))
        .filter(|ident| ident.size <= SIZE_AT_MOST)
        .map(|ident| ident.size)
        .sum()
}

pub fn part_2(data: &str) -> i32 {
    let fs = build_file_system(data);

    const TOTAL_AVAILABLE: i32 = 70_000_000;
    const REQUIRED_SPACE: i32 = 30_000_000;

    let space_to_free = REQUIRED_SPACE - (TOTAL_AVAILABLE - fs.du("/".into()));

    fs.ls()
        .into_iter()
        .filter(|ident| ident.size >= space_to_free)
        .map(|ident| ident.size)
        .min()
        .unwrap()
}

fn build_file_system(data: &str) -> FileSystem {
    let mut fs: FileSystem = FileSystem::default();
    let mut pwd = PathBuf::new();

    for output in data
        .trim()
        .lines()
        .flat_map(|line| line.parse::<Terminal>())
    {
        match output {
            Terminal::Command(path) => match path.as_str() {
                "/" => {
                    pwd = PathBuf::from("/");
                }
                ".." => {
                    pwd.pop();
                }
                _ => {
                    pwd.push(path);
                }
            },
            Terminal::Output(output) => {
                fs.0.entry(pwd.clone())
                    .and_modify(|x| x.push(output.clone()))
                    .or_insert_with(|| vec![output.clone()]);
            }
        }
    }

    fs
}

#[derive(Debug)]
enum Terminal {
    Command(String),
    Output(Ident),
}

#[derive(Debug, Clone)]
enum Ident {
    File(i32, String),
    Dir(String),
}

impl FromStr for Terminal {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = s.split(' ').collect();
        match parts[0] {
            "$" => Ok(Terminal::Command(match parts[1] {
                "cd" => parts[2].into(),
                _ => return Err(format!("Unknown command: {}", parts[1])),
            })),
            "dir" => Ok(Terminal::Output(Ident::Dir(parts[1].into()))),
            _ => Ok(Terminal::Output(Ident::File(
                parts[0].parse::<i32>().expect("number"),
                parts[1].into(),
            ))),
        }
    }
}

#[derive(Default)]
struct FileSystem(HashMap<PathBuf, Vec<Ident>>);

impl FileSystem {
    // Like the terminal command: du
    fn du(&self, dir: PathBuf) -> i32 {
        match self.0.get(&dir) {
            Some(idents) => idents
                .iter()
                .map(|ident| match ident {
                    Ident::File(size, _) => *size,
                    Ident::Dir(name) => self.du(dir.clone().join(name)),
                })
                .sum(),
            None => 0,
        }
    }

    // Like the terminal command: ls
    fn ls(&self) -> Vec<IdentInfo> {
        self.0
            .keys()
            .map(|path| IdentInfo {
                path: path.to_path_buf(),
                size: self.du(path.to_path_buf()),
            })
            .collect()
    }
}

#[derive(Debug)]
struct IdentInfo {
    path: PathBuf,
    size: i32,
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = include_str!("../../../../../data/2022-07.sample.txt");

    #[test]
    fn part_1_sample() {
        assert_eq!(part_1(SAMPLE), 95437);
    }

    #[test]
    fn part_1_real() {
        assert_eq!(part_1(INPUT), 1477771);
    }

    #[test]
    fn part_2_sample() {
        assert_eq!(part_2(SAMPLE), 24933642);
    }

    #[test]
    fn part_2_real() {
        assert_eq!(part_2(INPUT), 3579501);
    }
}
