import { Coord } from "./coord";
import { IDHolder } from "./id-holder";

/*
Part of the graph model. Stores a single node.
*/

export class Node implements IDHolder {

    public name: string;

    constructor(public id: number, public pos: Coord) {
        this.name = id.toString();
    }

}