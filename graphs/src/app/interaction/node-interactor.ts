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

        this.onDragStart$.subscribe((event) => {
            this.nodePosBeforeDrag = this.node.pos;
        });

        this.onDrag$.subscribe((event) => {
            this.node.setPosition(this.nodePosBeforeDrag!.add(this.dragOffset!));
        });

        this.onDragEnd$.subscribe((event) => {
            this.nodePosBeforeDrag = undefined;
        });

    }
    
    public override specifyContextMenu(): ContextMenuOption[] {

        return [
            {
                label: "Delete",
                action: () => {
                    console.log("delete node");
                },
                disabled: false
            }
        ];
        
    }

    public override toString(): string {
        return "NodeInteractor(" + this.node.name + ")";
    }

}