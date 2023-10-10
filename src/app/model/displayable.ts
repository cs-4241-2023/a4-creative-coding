/*
If displayable, edit panel will be displayed for when this model is selected.
*/

import { IDHolder } from "./id-holder";

export interface Displayable extends IDHolder {
    getDisplayID(): string;
    name: string;
}