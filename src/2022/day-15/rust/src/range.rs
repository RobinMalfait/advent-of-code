use std::cmp;
use std::iter::FromIterator;

#[derive(Debug, Copy, Clone)]
pub struct Range {
    pub start: i32,
    pub end: i32,
}

impl Range {
    pub fn new(start: i32, end: i32) -> Range {
        Range { start, end }
    }

    fn overlaps_inclusive(&self, other: &Range) -> bool {
        !(self.end < other.start || self.start > other.end)
    }

    fn merge(&mut self, other: &Range) {
        self.start = cmp::min(self.start, other.start);
        self.end = cmp::max(self.end, other.end);
    }
}

#[derive(Debug, Clone, Default)]
pub struct RangeStack {
    pub ranges: Vec<Range>,
}

impl RangeStack {
    pub fn add(&mut self, range: &Range) {
        if let Some(last) = self.ranges.last_mut() {
            if last.overlaps_inclusive(range) {
                last.merge(range);
                return;
            }
        }

        self.ranges.push(*range);
    }
}

impl FromIterator<Range> for RangeStack {
    fn from_iter<I>(iterator: I) -> Self
    where
        I: IntoIterator<Item = Range>,
    {
        let mut raw_ranges: Vec<_> = iterator.into_iter().collect();
        raw_ranges.sort_by(|a, b| a.start.cmp(&b.start));

        let mut range_stack = RangeStack { ranges: Vec::new() };

        for range in &raw_ranges {
            range_stack.add(range);
        }

        range_stack
    }
}

impl<'a> FromIterator<&'a Range> for RangeStack {
    fn from_iter<I>(iterator: I) -> Self
    where
        I: IntoIterator<Item = &'a Range>,
    {
        iterator.into_iter().cloned().collect()
    }
}
