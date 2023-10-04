import { Component, HostListener, ViewChild } from '@angular/core';
import { AbstractInteractiveComponent } from '../abstract-interactive/abstract-interactive.component';
import { SvgInteractor } from 'src/app/interaction/svg-interactor';
import { ContextMenuOption, Interactor } from 'src/app/interaction/interactor';
import { InteractionService } from 'src/app/services/interaction.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent extends AbstractInteractiveComponent {


  constructor(public override interactionService: InteractionService, private stateService: StateService) {
    super(interactionService);
  }

  // handle keyboard events and send to interaction service
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log("InteractionDirective.onKeyDown", event.key);
    this.interactionService.onKeyDown(event);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    console.log("InteractionDirective.onKeyUp", event.key);
    this.interactionService.onKeyUp(event);
  }


  override registerInteractor(): Interactor {
    return new SvgInteractor(this.stateService);
  }
  
}
