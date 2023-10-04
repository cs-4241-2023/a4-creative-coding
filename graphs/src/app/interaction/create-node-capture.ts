import { Coord } from "../model/coord";
import { Node } from "../model/node";
import { InteractionService } from "../services/interaction.service";
import { ClickCapture, ClickCaptureID } from "./click-capture";
import { NodeInteractor } from "./node-interactor";

export class CreateNodeCapture extends ClickCapture {


    private hoveringNode?: Node;

    constructor(private parentNode: Node, private interactionService: InteractionService) {
        super(ClickCaptureID.CREATE_NODE);


        // on mouse move, if hovering over a node, store it
        this.onMouseMove$.subscribe((event) => {
            const hovering = interactionService.getHoveringObject();
            if (hovering instanceof NodeInteractor) {
                this.hoveringNode = hovering.node;
            } else {
                this.hoveringNode = undefined;
            }
        });

    }

    public getNodePosition(): Coord {
        return this.parentNode.pos;
    }

    public getHoveringNode(): Node | undefined {
        return this.hoveringNode;
    }

    
}