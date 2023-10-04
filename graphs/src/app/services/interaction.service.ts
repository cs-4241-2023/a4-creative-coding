import { Injectable } from '@angular/core';
import { ContextMenuOption, Interactor } from '../interaction/interactor';
import { Coord } from '../model/coord';
import { ContextMenuService } from './context-menu.service';
import { ClickCapture, ClickCaptureID } from '../interaction/click-capture';

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

  private mousePos: Coord = new Coord(0, 0); // current mouse position

  private clickCapture: ClickCapture | undefined;

  constructor(private contextMenuService: ContextMenuService) {}


  // select the object and deselect all others
  private selectNewObject(object: Interactor): void {

    let isAlreadySelected = this.selected.has(object);

    // deselect all other objects and call onDeselect().
    // if the object is already selected, do not call onDeselect() on it.
    this.selected.forEach((oldObj) => {
      if (oldObj !== object) {
        oldObj.isSelected = false;
        oldObj._onDeselect();
      }
    });

    // select the object and call onSelect()
    this.selected.clear();
    this.selected.add(object);
    object.isSelected = true;
    if (!isAlreadySelected && object.selectable) object._onSelect();
  }

  // select the object and unselect all others
  private onMouseDown(object: Interactor, event: MouseEvent): void {

    this.mousePos = new Coord(event.clientX, event.clientY);
    event.stopPropagation(); // don't let parent components handle this event

    // if click capture, handle special case
    if (this.clickCapture) {
      this.clickCapture.onClick$.next(this.mousePos);
      this.exitClickCapture();
      return;
    }

    if (event.button !== 0) return; // only handle left click. should not be called on right click/context menu

    console.log("InteractionService.onMouseDown", object, event);

    // hide any context menus
    this.contextMenuService.hideContextMenu();


    this.selectNewObject(object);

    // if the object is draggable, then start dragging it
    this.isDragging = true;
    if (object.draggable) object._onDragStart();
  
  }

  private onMouseRightClick(object: Interactor, event: MouseEvent): void {

    this.mousePos = new Coord(event.clientX, event.clientY);

    event.preventDefault(); // prevent context menu from appearing
    event.stopPropagation(); // don't let parent components handle this event

    // if click capture, handle special case
    if (this.clickCapture) {
      this.clickCapture.onClick$.next(this.mousePos);
      this.exitClickCapture();
      return;
    }

    console.log("InteractionService.onMouseRightClick", object, event);
    this.selectNewObject(object);
    this.isDragging = false;

    // show context menu
    this.contextMenuService.showContextMenu(object, event);

    object._onRightClick();

  }

  private onMouseUp(object: Interactor, event: MouseEvent): void {

    this.mousePos = new Coord(event.clientX, event.clientY);
    event.stopPropagation(); // don't let parent components handle this event

    console.log("InteractionService.onMouseUp", object, event);

    this.selected.forEach((obj) => {
      if (obj.draggable) obj._onDragEnd();
    });
    this.isDragging = false;
  
  }

  // if mouse is down, then drag the selected objects
  private onMouseMove(object: Interactor, event: MouseEvent): void {

    this.mousePos = new Coord(event.clientX, event.clientY);
    event.stopPropagation(); // don't let parent components handle this event

    if (this.clickCapture) {
      this.clickCapture.onMouseMove$.next(this.mousePos);
      return;
    }

    if (this.isDragging) {
      this.selected.forEach((obj) => {
        if (obj.draggable) obj._onDrag();
      });
    }
  
  }

  private onKeyDown(object: Interactor, event: KeyboardEvent): void {

    // if click capture, consume all keyboard events
    if (this.clickCapture) {
      
      // esc while click capture is active will cancel the click capture
      if (event.key === "Escape") this.exitClickCapture();

      return // do not propagate keyboard events to other interactors
    }

    // call onKeyDown on all selected objects
    this.selected.forEach((obj) => {
      obj._onKeyDown(event);
    });

  }

  // registers an interactor to receive mouse events
  public register(interactor: Interactor): void {

    console.log("InteractionService.register", interactor);

    // set up hooks for interactor to call on model events when view sends mouse events
    interactor.initInteraction(
      this.getMousePos.bind(this),
      this.onMouseDown.bind(this),
      this.onMouseUp.bind(this),
      this.onMouseMove.bind(this),
      this.onMouseRightClick.bind(this),
      this.onKeyDown.bind(this)
    );

    this.objects.push(interactor);
  }

  // make sure to unregister when the object is destroyed
  public unregister(interactor: Interactor): void {
    this.objects = this.objects.filter((obj) => obj !== interactor);
  }

  public enterClickCapture(clickCapture: ClickCapture): void {
    this.clickCapture = clickCapture;
  }

  public getClickCapture(): ClickCapture | undefined {
    return this.clickCapture;
  }

  public getClickCaptureID(): ClickCaptureID | undefined {
    return this.clickCapture?.id;
  }

  public exitClickCapture(): void {
    this.clickCapture = undefined;
  }

  // select and start dragging a given object.
  // useful ie. for creating and dragging a new node on creation from context menu
  public startDraggingObject(object: Interactor): void {

    this.selectNewObject(object);

    this.isDragging = true;
    object._onDragStart();
  }

  public getMousePos(): Coord {
    return this.mousePos;
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
