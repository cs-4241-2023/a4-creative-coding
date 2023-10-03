import { ClickCapture, ClickCaptureID } from "./click-capture";

export class CreateNodeCapture extends ClickCapture {
    constructor(parentNode: Node) {
        super(ClickCaptureID.CREATE_NODE);
    }

    
}