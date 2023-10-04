import { Interactor } from "../interaction/interactor";

export interface Interactable {
    getInteractor(): Interactor;
}