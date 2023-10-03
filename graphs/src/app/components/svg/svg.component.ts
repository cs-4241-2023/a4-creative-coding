import { Component, ViewChild } from '@angular/core';
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


  override registerInteractor(): Interactor {
    return new SvgInteractor(this.stateService);
  }


  
}
