import { Coord } from "../model/coord";

/*
You should subclass Interactor to create Interactors specific to your interactive components, like nodes
and edges. Your subclass will define how the model should be modified when events like
selection and dragging occur.

You can override hooks like handleSelect and handleDrag to define how they will update model state.
In those functions, you can use public fields defined here like isSelected and dragOffset for your
convenience. These fields will be updated in this class.

You should only define hooks that change the model. Superficial changes that only affect the component,
like changing the color when it is selected, only need to be specified the view.

*/

export interface ContextMenuOption {
    label: string;
    action: () => void;
    disabled: boolean;
  }

export abstract class Interactor {

    public isSelected: boolean = false;
    public isDragged: boolean = false;
    public mouseStartPos?: Coord;
    public dragOffset?: Coord;

    private mouseDownAction: (interactor: Interactor, event: MouseEvent) => void = (event) => {};
    private mouseUpAction: (interactor: Interactor, event: MouseEvent) => void = (event) => {};
    private mouseMoveAction: (interactor: Interactor, event: MouseEvent) => void = (event) => {};
    private mouseRightClickAction: (interactor: Interactor, event: MouseEvent) => void = (event) => {};


    constructor(public selectable: boolean, public draggable: boolean) {

        if (draggable && !selectable) {
            throw new Error("Error: draggable objects must be selectable");
        }

    }

    // set the interaction service's mouse event handlers
    public initInteraction(
        mouseDownAction: (interactor: Interactor, event: MouseEvent) => void,
        mouseUpAction: (interactor: Interactor, event: MouseEvent) => void,
        mouseMoveAction: (interactor: Interactor, event: MouseEvent) => void,
        mouseRightClickAction: (interactor: Interactor, event: MouseEvent) => void): void {

        this.mouseDownAction = mouseDownAction;
        this.mouseUpAction = mouseUpAction;
        this.mouseMoveAction = mouseMoveAction;
        this.mouseRightClickAction = mouseRightClickAction;
    }

    // redirect mouse events to interaction service as (interactor, event)
    public onMouseDown(event: MouseEvent): void {this.mouseDownAction(this, event); }
    public onMouseUp(event: MouseEvent): void {this.mouseUpAction(this, event); }
    public onMouseMove(event: MouseEvent): void {this.mouseMoveAction(this, event); }
    public onRightClick(event: MouseEvent): void {this.mouseRightClickAction(this, event); }

    // hooks for interaction service to call. This updates mouse state and calls subclass hooks
    public onSelect(event: MouseEvent): void {
        this.isSelected = true;
        this.handleSelect(event);
    }
    public onDeselect(event: MouseEvent): void {
        this.isSelected = false;
        this.handleDeselect(event);
    }
    public onDragStart(event: MouseEvent): void {
        this.mouseStartPos = new Coord(event.clientX, event.clientY);
        this.isDragged = true;
        this.handleDragStart(event);
    }
    public onDrag(event: MouseEvent): void {
        this.dragOffset = new Coord(event.clientX, event.clientY).sub(this.mouseStartPos!);
        this.handleDrag(event);
    }
    public onDragEnd(event: MouseEvent): void {
        this.isDragged = false;
        this.mouseStartPos = undefined;
        this.dragOffset = undefined;
        this.handleDragEnd(event);
    }

    // hooks for subclasses to override to update model state
    protected handleSelect(event: MouseEvent): void {}
    protected handleDeselect(event: MouseEvent): void {}
    protected handleDragStart(event: MouseEvent): void {}
    protected handleDrag(event: MouseEvent): void {}
    protected handleDragEnd(event: MouseEvent): void {}

    // functions for subclasses to specify behavior
    public specifyContextMenu(): ContextMenuOption[] {
        return [];
    }

    // for debugging. Override this for more useful information
    public toString(): string {
        return "Unspecified Interactor";
    }
    
}