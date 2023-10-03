import { Interactor } from "./interactor";

/*
This handles any interaction with the SVG canvas.
*/

export class SvgInteractor extends Interactor {

    constructor() {
        super(true, true);
    }

    public override toString(): string {
        return "SvgInteractor()";
    }

    public override handleDragStart(event: MouseEvent): void {
        //console.log("drag start");
    }
    public override handleDragEnd(event: MouseEvent): void {
        //console.log("drag end");
    }

}