export default function (blob: string, seconds: number) {
  let reindeers = blob
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .map(parse)

  for (let _ of Array(seconds)) {
    for (let reindeer of reindeers) {
      reindeer.tick()
    }
  }

  return reindeers.map((r) => r.distance).reduce((a, b) => Math.max(a, b))
}

function parse(input: string) {
  let parts = input.slice(0, -1).split(' ')

  return new Reindeer(parts.at(0), Number(parts.at(3)), Number(parts.at(6)), Number(parts.at(13)))
}

class Reindeer {
  public distance = 0
  private state: { name: 'flying'; left: number } | { name: 'resting'; left: number } | null = null

  constructor(
    public name: string,
    public speed: number,
    public fly_duration: number,
    public rest_duration: number
  ) {}

  tick() {
    if (this.state === null) {
      this.state = { name: 'flying', left: this.fly_duration }
    }

    this.state.left -= 1

    if (this.state.name === 'flying') {
      this.distance += this.speed

      if (this.state.left === 0) {
        this.state = { name: 'resting', left: this.rest_duration }
      }
    } else if (this.state.name === 'resting') {
      if (this.state.left === 0) {
        this.state = { name: 'flying', left: this.fly_duration }
      }
    }
  }
}
