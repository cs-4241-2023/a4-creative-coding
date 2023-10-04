import { Coord } from "../model/coord";
import { StateService } from "../services/state.service";
import { ContextMenuOption, Interactor } from "./interactor";

/*
This handles any interaction with the SVG canvas.
*/

export class SvgInteractor extends Interactor {

    constructor(private stateService: StateService) {
        super(true, true);

        // on space bar, create a node
        this.onKeyDown$.subscribe((event) => {
            if (event.key === " ") {
                this.stateService.getGraph().createNode(this.getMousePos());
            }
        });

    }
    
    public override specifyContextMenu(): ContextMenuOption[] {

        return [
            {
                label: "Create node",
                action: () => {
                    this.stateService.getGraph().createNode(this.getMousePos());
                },
                disabled: false
            }
        ];
        
    }

    public override toString(): string {
        return "SvgInteractor()";
    }

}