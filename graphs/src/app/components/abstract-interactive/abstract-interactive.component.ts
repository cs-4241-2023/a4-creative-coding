import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Interactor } from 'src/app/interaction/interactor';
import { Interactable } from 'src/app/model/interactable';
import { InteractionService } from 'src/app/services/interaction.service';

/*
All interactive components should extend this class. This class binds the component
to an interactor, and handles its construction and destruction. Subclasses will need
to implement registerInteractor() so that this class can bind the interactor.

*/

@Component({
  selector: '[app-abstract-interactive]',
  templateUrl: './abstract-interactive.component.html',
  styleUrls: ['./abstract-interactive.component.css']
})
export abstract class AbstractInteractiveComponent implements OnInit, OnDestroy {
  @Input() model!: Interactable;

  constructor(protected interactionService: InteractionService) { }

  public getInteractor(): Interactor {
    return this.model.getInteractor();
  }

  ngOnInit(): void {
    this.interactionService.register(this.getInteractor());
  }

  ngOnDestroy(): void {
    this.interactionService.unregister(this.getInteractor());
  }

}
