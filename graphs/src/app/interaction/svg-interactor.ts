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

}