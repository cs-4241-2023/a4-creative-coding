import { Coord } from "../model/coord";

export abstract class Interactor {

    public isSelected: boolean = false;
    public isDragged: boolean = false;
    public mouseStartPos?: Coord;
    public dragOffset?: Coord;

    private mouseDownAction: (interactor: Interactor, event: MouseEvent) => void = (event) => {};
    private mouseUpAction: (interactor: Interactor, event: MouseEvent) => void = (event) => {};
    private mouseMoveAction: (interactor: Interactor, event: MouseEvent) => void = (event) => {};


    constructor(selectable: boolean, draggable: boolean) {

        if (draggable && !selectable) {
            throw new Error("Error: draggable objects must be selectable");
        }

    }

    public initInteraction(
        mouseDownAction: (interactor: Interactor, event: MouseEvent) => void,
        mouseUpAction: (interactor: Interactor, event: MouseEvent) => void,
        mouseMoveAction: (interactor: Interactor, event: MouseEvent) => void): void {

        this.mouseDownAction = mouseDownAction;
        this.mouseUpAction = mouseUpAction;
        this.mouseMoveAction = mouseMoveAction;
    }

    // hooks for views to call on events
    public onMouseDown(event: MouseEvent): void {this.mouseDownAction(this, event); }
    public onMouseUp(event: MouseEvent): void {this.mouseUpAction(this, event); }
    public onMouseMove(event: MouseEvent): void {this.mouseMoveAction(this, event); }

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

    // for debugging. Override this for more useful information
    public toString(): string {
        return "Unspecified Interactor";
    }
    
}