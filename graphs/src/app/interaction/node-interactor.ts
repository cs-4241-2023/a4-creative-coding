import { Coord } from "../model/coord";
import { Node } from "../model/node";
import { ContextMenuOption, Interactor } from "./interactor";

/*
This interactor defines the following behaviors:
- Dragging the node moves it
*/

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
    
    public override specifyContextMenu(): ContextMenuOption[] {

        return [
            {
                label: "Delete",
                action: () => {
                    console.log("delete node");
                }
            }
        ];
        
    }

    public override toString(): string {
        return "NodeInteractor(" + this.node.name + ")";
    }

}