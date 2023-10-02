import { Interactor } from "./interactor";

export class SvgInteractor extends Interactor {

    constructor() {
        super(true, true);
    }

    public override toString(): string {
        return "SvgInteractor()";
    }

}