import { Coord } from "../model/coord";
import { Node } from "../model/node";
import { ClickCapture, ClickCaptureID } from "./click-capture";

export class CreateNodeCapture extends ClickCapture {
    constructor(private parentNode: Node) {
        super(ClickCaptureID.CREATE_NODE);
    }

    public getNodePosition(): Coord {
        return this.parentNode.pos;
    }

    
}