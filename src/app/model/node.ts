import { Coord } from "./coord";
import { IDHolder } from "./id-holder";

/*
Part of the graph model. Stores a single node.
*/

export class Node implements IDHolder {

    public name: string;

    constructor(public id: number, public pos: Coord, name?: string) {
        if (name) this.name = name;
        else this.name = id.toString();
    }

    public setPosition(pos: Coord): void {
        this.pos = pos;
    }

}