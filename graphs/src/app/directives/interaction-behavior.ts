import { Directive, HostListener, Input } from '@angular/core';
import { Interactor } from '../interaction/interactor';

/*
InteractionDirectives are attached to some component that MUST extend AbstractInteractiveComponent.
They consume raw mouse events and send them to the global Interaction service, which will convert
those events to selection and drag events.
*/

@Directive({
  selector: '[appInteractable]'
})
export class InteractionDirective {
  @Input() interaction!: Interactor;
  
  constructor() {
    
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.interaction._onRawMouseDown(event);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.interaction._onRawMouseUp(event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.interaction._onRawMouseMove(event);
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    this.interaction._onRawRightClick(event);
  }

}
