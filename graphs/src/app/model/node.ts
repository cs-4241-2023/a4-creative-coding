import { Coord } from "./coord";
import { Displayable } from "./displayable";
import { IDHolder } from "./id-holder";

/*
Part of the graph model. Stores a single node.
*/

export class Node implements Displayable {

    public name: string;

    constructor(public id: number, public pos: Coord) {
        this.name = id.toString();
    }

    public setPosition(pos: Coord): void {
        this.pos = pos;
    }

    public getDisplayID(): string {
        return "Node(" + this.id + ")";
    }

}