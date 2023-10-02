import { Directive, HostListener, Input } from '@angular/core';
import { Interactor } from '../interaction/interactor';

@Directive({
  selector: '[appInteractable]'
})
export class InteractionDirective {
  @Input() interaction!: Interactor;
  
  constructor() {
    
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    console.log("InteractionDirective.onMouseDown");
    this.interaction.onMouseDown(event);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    console.log("InteractionDirective.onMouseUp");
    this.interaction.onMouseUp(event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    console.log("InteractionDirective.onMouseMove");
    this.interaction.onMouseMove(event);
  }

}
