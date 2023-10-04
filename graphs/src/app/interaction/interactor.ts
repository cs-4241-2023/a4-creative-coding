import { Subject } from "rxjs";
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

    public onSelect$ = new Subject<boolean>();
    public onDeselect$ = new Subject<boolean>();
    public onDragStart$ = new Subject<boolean>();
    public onDrag$ = new Subject<boolean>();
    public onDragEnd$ = new Subject<boolean>();
    public onRightClick$ = new Subject<boolean>();
    public onKeyDown$ = new Subject<KeyboardEvent>();

    public getMousePos: () => Coord = () => { return new Coord(0, 0); };

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
        getMousePos: () => Coord,
        mouseDownAction: (interactor: Interactor, event: MouseEvent) => void,
        mouseUpAction: (interactor: Interactor, event: MouseEvent) => void,
        mouseMoveAction: (interactor: Interactor, event: MouseEvent) => void,
        mouseRightClickAction: (interactor: Interactor, event: MouseEvent) => void): void {

        this.getMousePos = getMousePos;
        this.mouseDownAction = mouseDownAction;
        this.mouseUpAction = mouseUpAction;
        this.mouseMoveAction = mouseMoveAction;
        this.mouseRightClickAction = mouseRightClickAction;
    }


    // redirect mouse events to interaction service as (interactor, event)
    public _onRawMouseDown(event: MouseEvent): void {
        this.mouseDownAction(this, event);
    }

    public _onRawMouseUp(event: MouseEvent): void {
        this.mouseUpAction(this, event);
    }

    public _onRawMouseMove(event: MouseEvent): void {
        this.mouseMoveAction(this, event);
    }

    public _onRawRightClick(event: MouseEvent): void {
        this.mouseRightClickAction(this, event);
    }

    // hooks for interaction service to call.
    // This updates Interactor state and sends events to subscribers.
    public _onSelect(): void {
        this.isSelected = true;
        this.mouseStartPos = this.getMousePos();
        this.onSelect$.next(true);
    }
    public _onDeselect(): void {
        this.isSelected = false;
        this.onDeselect$.next(true);
    }
    public _onDragStart(): void {
        this.isDragged = true;
        this.mouseStartPos = this.getMousePos();
        this.onDragStart$.next(true);
    }
    public _onDrag(): void {
        this.dragOffset = this.getMousePos().sub(this.mouseStartPos!);
        this.onDrag$.next(true);
    }
    public _onDragEnd(): void {
        this.isDragged = false;
        this.mouseStartPos = undefined;
        this.dragOffset = undefined;
        this.onDragEnd$.next(true);
    }

    public _onRightClick(): void {
        this.onRightClick$.next(true);
    }

    public _onKeyDown(event: KeyboardEvent): void {
        this.onKeyDown$.next(event);
    }

    // functions for subclasses to specify behavior
    public specifyContextMenu(): ContextMenuOption[] {
        return [];
    }

    // override this to specify the model that this interactor modifies
    public getModel(): any {
        return undefined
    }

    // for debugging. Override this for more useful information
    public toString(): string {
        return "Unspecified Interactor";
    }
    
}