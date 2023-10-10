export class Coord {
    constructor(
        public readonly x: number,
        public readonly y: number
    ) {}

    public add(other: Coord): Coord {
        return new Coord(this.x + other.x, this.y + other.y);
    }

    public sub(other: Coord): Coord {
        return new Coord(this.x - other.x, this.y - other.y);
    }

    public equals(other: Coord): boolean {
        return this.x === other.x && this.y === other.y;
    }

}