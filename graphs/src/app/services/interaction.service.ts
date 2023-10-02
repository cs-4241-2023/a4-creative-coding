import { Injectable } from '@angular/core';
import { Interactor } from '../interaction/interactor';
import { Coord } from '../model/coord';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private objects: Interactor[] = [];

  private selected = new Set<Interactor>(); // set of currently-selected objects
  private isDragging: boolean = false; // whether the selected objects are being dragged

  constructor() { }

  // select the object and unselect all others
  private onMouseDown(object: Interactor, event: MouseEvent): void {

    this.isDragging = true;

    let isAlreadySelected = this.selected.has(object);

    // deselect all other objects and call onDeselect().
    // if the object is already selected, do not call onDeselect() on it.
    this.selected.forEach((oldObj) => {
      if (oldObj !== object) {
        oldObj.isSelected = false;
        oldObj.onDeselect();
      }
    });

    // select the object and call onSelect()
    this.selected.clear();
    this.selected.add(object);
    object.isSelected = true;
    if (!isAlreadySelected) object.onSelect();
  
    console.log("onMouseDown", object, event)
    event.stopPropagation(); // don't let parent components handle this event
  }

  private onMouseUp(object: Interactor, event: MouseEvent): void {

    this.isDragging = false;
  
    console.log("onMouseUp", object, event)
    event.stopPropagation(); // don't let parent components handle this event
  }

  // if mouse is down, then drag the selected objects
  private onMouseMove(object: Interactor, event: MouseEvent): void {

    if (this.isDragging) {
      let dragOffset = new Coord(event.movementX, event.movementY);
      this.selected.forEach((obj) => obj.onDrag(dragOffset));
    }
  
    console.log("onMouseMove", object, event)
    event.stopPropagation(); // don't let parent components handle this event
  }

  public register(interactor: Interactor): void {

    // set up hooks for interactor to call on model events when view sends mouse events
    interactor.initInteraction(this.onMouseDown, this.onMouseUp, this.onMouseMove);

    this.objects.push(interactor);
  }

  // make sure to unregister when the object is destroyed
  public unregister(interactor: Interactor): void {
    this.objects = this.objects.filter((obj) => obj !== interactor);
  }

}
