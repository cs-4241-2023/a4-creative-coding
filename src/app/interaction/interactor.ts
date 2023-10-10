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

    constructor(public selectable: boolean, public draggable: boolean) {

        if (draggable && !selectable) {
            throw new Error("Error: draggable objects must be selectable");
        }

    }

    // set the interaction service's mouse event handlers
    public initInteraction(getMousePos: () => Coord): void {
        this.getMousePos = getMousePos;
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

    // for debugging. Override this for more useful information
    public toString(): string {
        return "Unspecified Interactor";
    }
    
}