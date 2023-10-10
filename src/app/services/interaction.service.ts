import { Injectable } from '@angular/core';
import { ContextMenuOption, Interactor } from '../interaction/interactor';
import { Coord } from '../model/coord';
import { ContextMenuService } from './context-menu.service';
import { ClickCapture, ClickCaptureID } from '../interaction/click-capture';
import { Subject } from 'rxjs';

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

  private heldKeys: Set<string> = new Set<string>(); // keys currently being held down

  private mousePos: Coord = new Coord(0, 0); // current mouse position
  private mouseMovedAfterDown: boolean = false; // whether the mouse has moved since the last mouse down event

  public hoveringObject?: Interactor; // object that the mouse is currently hovering over

  // a SINGULAR notification that a drag has ended. Use when you don't want to receive
  // multiple notifications when multiple objects are finished dragging. useful i.e. for saving / doing computations
  public onDragEndOnce$ = new Subject<boolean>();

  private clickCapture: ClickCapture | undefined;

  constructor(private contextMenuService: ContextMenuService) {}


  // select the object and deselect all others
  private selectNewObject(object: Interactor, deselectOldObjects: boolean = true): void {

    let isAlreadySelected = this.selected.has(object);

    if (deselectOldObjects) {
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
    }

    if (isAlreadySelected) return;


    this.selected.add(object);
    if (object.selectable) object._onSelect();
  }

  // select the object and unselect all others
  public _onMouseDown(object: Interactor, event: MouseEvent): void {

    this.mousePos = new Coord(event.clientX, event.clientY);
    
    this.mouseMovedAfterDown = false;

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

    // don't deselect old objects if shift is held down (ie. multi-select)
    let alreadySelected = this.selected.has(object);
    this.selectNewObject(object, !this.isPressingKey("Shift") && !alreadySelected);
    
    this.isDragging = true;

    // if the object is draggable, then start dragging it
    this.selected.forEach((obj) => {
      if (obj.draggable) obj._onDragStart();
    });
  
  }

  public _onMouseRightClick(object: Interactor, event: MouseEvent): void {

    this.mousePos = new Coord(event.clientX, event.clientY);
    this.mouseMovedAfterDown = false;

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

  public _onMouseUp(object: Interactor, event: MouseEvent): void {

    this.mousePos = new Coord(event.clientX, event.clientY);
    event.stopPropagation(); // don't let parent components handle this event

    // if it was a click, deselect objects that were not clicked on
    // if shift is held down, don't do this (ie. multi-select)
    if (!this.mouseMovedAfterDown && !this.isPressingKey("Shift")) {
      // deselect all objects that are not object

      let objectsToRemove = new Set<Interactor>();
      this.selected.forEach((obj) => {
        if (obj !== object) {
          obj._onDeselect();
          objectsToRemove.add(obj);
        }
      });
      objectsToRemove.forEach((obj) => this.selected.delete(obj));

    }

    console.log("InteractionService.onMouseUp", object, event);

    let somethingDragged = false;
    this.selected.forEach((obj) => {
      if (obj.draggable) {
        somethingDragged = true;
        obj._onDragEnd();
      }
    });

    // something was changed after drag
    if (this.isDragging && this.mouseMovedAfterDown && somethingDragged) {
      this.onDragEndOnce$.next(true);
    }

    this.isDragging = false;
  
  }

  // if mouse is down, then drag the selected objects
  public _onMouseMove(object: Interactor, event: MouseEvent): void {

    this.mousePos = new Coord(event.clientX, event.clientY);
    this.mouseMovedAfterDown = true;

    this.hoveringObject = object;

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

  public onKeyDown(event: KeyboardEvent): void {

    console.log(event.key);

    // add key to heldKeys
    if (!this.heldKeys.has(event.key)) {
      this.heldKeys.add(event.key);
    }

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

  public onKeyUp(event: KeyboardEvent): void {

    // remove key from heldKeys
    if (this.heldKeys.has(event.key)) {
      this.heldKeys.delete(event.key);
    }

  }

  public isPressingKey(key: string): boolean {
    return this.heldKeys.has(key);
  }

  // registers an interactor to receive mouse events
  public register(interactor: Interactor): void {
    interactor.initInteraction(this.getMousePos.bind(this));
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

  public getHoveringObject(): Interactor | undefined {
    return this.hoveringObject;
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
