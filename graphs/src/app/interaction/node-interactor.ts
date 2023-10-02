import { Coord } from "../model/coord";
import { Node } from "../model/node";
import { Interactor } from "./interactor";

export class NodeInteractor extends Interactor {

    constructor(public node: Node) {
        super(true, true);
    }

    public override onSelect(): void {
        console.log(this.node.name, "selected");
    }

    public override onDeselect(): void {
        console.log(this.node.name, "deselected");
    }

    public override onDrag(dragOffset: Coord): void {
        this.node.move(dragOffset);
    }

}