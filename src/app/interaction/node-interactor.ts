import { Coord } from "../model/coord";
import { Node } from "../model/node";
import { InteractionService } from "../services/interaction.service";
import { SaveService } from "../services/save.service";
import { StateService } from "../services/state.service";
import { ClickCapture, ClickCaptureID } from "./click-capture";
import { CreateNodeCapture } from "./create-node-capture";
import { ContextMenuOption, Interactor } from "./interactor";

/*
This interactor defines the following behaviors:
- Dragging the node moves it
*/

export class NodeInteractor extends Interactor {

    private nodePosBeforeDrag?: Coord;

    constructor(public node: Node, private stateService: StateService,
        private interactionService: InteractionService,
        private saveService: SaveService) {
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

        // if backspace, delete
        this.onKeyDown$.subscribe((event) => {
            if (event.key === "Backspace") {
                this.stateService.getGraph().deleteNode(this.node);
                this.saveService.save();
            }
        });

    }
    
    public override specifyContextMenu(): ContextMenuOption[] {

        return [
            {
                label: "Create edge",
                action: () => {
                    console.log("Create edge");
                    this.enterCreateNodeCaptureMode();
                },
                disabled: false
            },
            {
                label: "Delete",
                action: () => {
                    this.stateService.getGraph().deleteNode(this.node);
                    this.saveService.save();
                },
                disabled: false
            }
        ];
        
    }

    private enterCreateNodeCaptureMode(): void {

        const capture = new CreateNodeCapture(this.node, this.interactionService);
        capture.onClick$.subscribe((mousePos) => {
            
            if (capture.getHoveringNode() === undefined) { // if not hovering over a node, create a new node to attach to
                this.stateService.getGraph().createNodeWithLink(mousePos, this.node);
            } else { // if hovering over a node, create a link to that node
                this.stateService.getGraph().createLink(this.node, capture.getHoveringNode()!);
            }
            this.saveService.save();
            
        });
        this.interactionService.enterClickCapture(capture);
    }

    public override toString(): string {
        return "NodeInteractor(" + this.node.name + ")";
    }

}