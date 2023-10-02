import { Coord } from "../model/coord";
import { Node } from "../model/node";
import { Interactor } from "./interactor";

export class NodeInteractor extends Interactor {

    constructor(public node: Node) {
        super(true, true);
    }

    public override onDrag(dragOffset: Coord): void {
        this.node.move(dragOffset);
    }

}