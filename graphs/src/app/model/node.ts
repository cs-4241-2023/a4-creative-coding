import { Interactor } from "../interaction/interactor";
import { NodeInteractor } from "../interaction/node-interactor";
import { Coord } from "./coord";
import { IDHolder } from "./id-holder";
import { Interactable } from "./interactable";

/*
Part of the graph model. Stores a single node.
*/

export class Node implements IDHolder, Interactable {

    public name: string;

    constructor(public id: number, public pos: Coord) {
        this.name = id.toString();
    }

    public setPosition(pos: Coord): void {
        this.pos = pos;
    }

    public getInteractor(): Interactor {
        return new NodeInteractor(this);
    }

}