import { Coord } from "../model/coord";

export abstract class Interactor {

    public isSelected: boolean = false;
    public isDragged: boolean = false;

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


    // hooks for subclasses to override to update model state
    public onSelect(): void {}
    public onDeselect(): void {}
    public onDragStart(): void {}
    public onDrag(dragOffset: Coord): void {}
    public onDragEnd(): void {}
    
}