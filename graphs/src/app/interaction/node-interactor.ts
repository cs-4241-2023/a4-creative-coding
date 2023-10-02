import { Coord } from "../model/coord";
import { Node } from "../model/node";
import { Interactor } from "./interactor";

export class NodeInteractor extends Interactor {

    private nodePosBeforeDrag?: Coord;

    constructor(public node: Node) {
        super(true, true);
    }


    public override handleDragStart(event: MouseEvent): void {
        this.nodePosBeforeDrag = this.node.pos;
    }

    public override handleDrag(event: MouseEvent): void {
        this.node.setPosition(this.nodePosBeforeDrag!.add(this.dragOffset!));
    }

    public override handleDragEnd(event: MouseEvent): void {
        this.nodePosBeforeDrag = undefined;
    }

    public override toString(): string {
        return "NodeInteractor(" + this.node.name + ")";
    }

}