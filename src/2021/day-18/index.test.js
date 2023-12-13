import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2021-18.txt'), 'utf8')
let slightlyLarger = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`
let homework = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`

describe('Part 1', () => {
  it.each([
    ['[1,2]', 7],
    ['[[1,2],3]', 27],
    ['[9,[8,7]]', 103],
    ['[[1,9],[8,5]]', 131],
    ['[[[[1,2],[3,4]],[[5,6],[7,8]]],9]', 1443],
    ['[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]', 1875],
    ['[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]', 2763],
    ['[[1,2],[[3,4],5]]', 143],
    ['[[[[0,7],4],[[7,8],[6,0]]],[8,1]]', 1384],
    ['[[[[1,1],[2,2]],[3,3]],[4,4]]', 445],
    ['[[[[3,0],[5,3]],[4,4]],[5,5]]', 791],
    ['[[[[5,0],[7,4]],[5,5]],[6,6]]', 1137],
    ['[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]', 3488],
    [homework, 4140],
    [slightlyLarger, 3488],
    ['[[[[4,3],4],4],[7,[[8,4],9]]]\n[1,1]', 1384],
    ['[[[[[9,8],1],2],3],4]', 548],
    ['[7,[6,[5,[4,[3,2]]]]]', 285],
    ['[[6,[5,[4,[3,2]]]],1]', 402],
    ['[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]', 633],
    ['[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]', 633],
    ['[1,1]\n[2,2]\n[3,3]\n[4,4]', 445],
    ['[1,1]\n[2,2]\n[3,3]\n[4,4]\n[5,5]', 791],
    ['[[[[1,1],[2,2]],[3,3]],[4,4]]\n[5,5]', 791],
    ['[1,1]\n[2,2]\n[3,3]\n[4,4]\n[5,5]\n[6,6]', 1137],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`4323`)
  })
})

describe('Part 2', () => {
  it.each([[homework, 3993]])(
    'should produce the correct value for example %#',
    (input, expected) => {
      expect(part2(input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`4749`)
  })
})
