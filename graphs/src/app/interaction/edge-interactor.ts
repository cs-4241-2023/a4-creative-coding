import { Coord } from "../model/coord";
import { Edge } from "../model/edge";
import { Node } from "../model/node";
import { StateService } from "../services/state.service";
import { Interactor } from "./interactor";

/*
This interactor defines the following behaviors:
- Dragging the node moves it
*/

export class EdgeInteractor extends Interactor {

    private startPosBeforeDrag?: Coord;
    private endPosBeforeDrag?: Coord;

    constructor(public edge: Edge, private stateService: StateService) {
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