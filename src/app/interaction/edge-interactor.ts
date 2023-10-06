import { Coord } from "../model/coord";
import { Edge } from "../model/edge";
import { Node } from "../model/node";
import { SaveService } from "../services/save.service";
import { StateService } from "../services/state.service";
import { ContextMenuOption, Interactor } from "./interactor";

/*
This interactor defines the following behaviors:
- Dragging the node moves it
*/

export class EdgeInteractor extends Interactor {

    private startPosBeforeDrag?: Coord;
    private endPosBeforeDrag?: Coord;

    constructor(public edge: Edge, private stateService: StateService, private saveService: SaveService) {
        super(true, true);

        this.onDragStart$.subscribe((event) => {
            this.startPosBeforeDrag = this.getStartNode().pos;
            this.endPosBeforeDrag = this.getEndNode().pos;
        });

        this.onDrag$.subscribe((event) => {
            this.getStartNode().setPosition(this.startPosBeforeDrag!.add(this.dragOffset!));
            this.getEndNode().setPosition(this.endPosBeforeDrag!.add(this.dragOffset!));
        });

        this.onDragEnd$.subscribe((event) => {
            this.startPosBeforeDrag = undefined;
            this.endPosBeforeDrag = undefined;
        });

        // if backspace, delete
        this.onKeyDown$.subscribe((event) => {
            if (event.key === "Backspace") {
                this.stateService.getGraph().deleteEdge(this.edge);
                this.saveService.save();
            }
        });

    }

    public override specifyContextMenu(): ContextMenuOption[] {

        return [
            {
                label: "Delete edge",
                action: () => {
                    console.log("Delete edge");
                    this.stateService.getGraph().deleteEdge(this.edge);
                    this.saveService.save();
                },
                disabled: false
            }
        ];
        
    }

    private getStartNode(): Node {
        return this.edge.getStartNode(this.stateService.getGraph());
    }

    private getEndNode(): Node {
        return this.edge.getEndNode(this.stateService.getGraph());
    }

    public override toString(): string {
        return "EdgeInteractor(" + this.getStartNode().name + "," + this.getEndNode().name + ")";
    }
    

}