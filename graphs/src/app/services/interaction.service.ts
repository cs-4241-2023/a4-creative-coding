import { Injectable } from '@angular/core';
import { ContextMenuOption, Interactor } from '../interaction/interactor';
import { Coord } from '../model/coord';

/*
This service keeps track of global state for the interaction system, such as which
objects are selected, and whether they are being dragged. It takes in raw mouse events
from the view and converts them to selection and drag events, which are then sent to
Interactors.
*/

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private objects: Interactor[] = [];

  private selected = new Set<Interactor>(); // set of currently-selected objects
  private isDragging: boolean = false; // whether the selected objects are being dragged


  // select the object and deselect all others
  private selectNewObject(object: Interactor, event: MouseEvent): void {

    let isAlreadySelected = this.selected.has(object);

    // deselect all other objects and call onDeselect().
    // if the object is already selected, do not call onDeselect() on it.
    this.selected.forEach((oldObj) => {
      if (oldObj !== object) {
        oldObj.isSelected = false;
        oldObj._onDeselect(event);
      }
    });

    // select the object and call onSelect()
    this.selected.clear();
    this.selected.add(object);
    object.isSelected = true;
    if (!isAlreadySelected && object.selectable) object._onSelect(event);
  }

  // select the object and unselect all others
  private onMouseDown(object: Interactor, event: MouseEvent): void {

    if (event.button !== 0) return; // only handle left click. should not be called on right click/context menu

    console.log("InteractionService.onMouseDown", object, event);


    this.selectNewObject(object, event);

    // if the object is draggable, then start dragging it
    this.isDragging = true;
    if (object.draggable) object._onDragStart(event);
  
    event.stopPropagation(); // don't let parent components handle this event
  }

  private onMouseRightClick(object: Interactor, event: MouseEvent): void {

    console.log("InteractionService.onMouseRightClick", object, event);
    this.selectNewObject(object, event);
    this.isDragging = false;

    object._onRightClick(event);

    event.stopPropagation();
  }

  private onMouseUp(object: Interactor, event: MouseEvent): void {

    console.log("InteractionService.onMouseUp", object, event);

    this.selected.forEach((obj) => {
      if (obj.draggable) obj._onDragEnd(event);
    });
    this.isDragging = false;
  
    event.stopPropagation(); // don't let parent components handle this event
  }

  // if mouse is down, then drag the selected objects
  private onMouseMove(object: Interactor, event: MouseEvent): void {

    if (this.isDragging) {
      this.selected.forEach((obj) => {
        if (obj.draggable) obj._onDrag(event);
      });
    }
  
    event.stopPropagation(); // don't let parent components handle this event
  }

  // registers an interactor to receive mouse events
  public register(interactor: Interactor): void {

    console.log("InteractionService.register", interactor);

    // set up hooks for interactor to call on model events when view sends mouse events
    interactor.initInteraction(
      this.onMouseDown.bind(this),
      this.onMouseUp.bind(this),
      this.onMouseMove.bind(this),
      this.onMouseRightClick.bind(this)
    );

    this.objects.push(interactor);
  }

  // make sure to unregister when the object is destroyed
  public unregister(interactor: Interactor): void {
    this.objects = this.objects.filter((obj) => obj !== interactor);
  }

  public getObjectDebug(): string[] {
    return this.objects.map((obj) => obj.toString());
  }

  public getSelectedDebug(): string[] {
    return Array.from(this.selected).map((obj) => obj.toString());
  }

  public getDragging(): boolean {
    return this.isDragging;
  }

}
