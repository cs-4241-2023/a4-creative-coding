import { Component, OnDestroy, OnInit } from '@angular/core';
import { Interactor } from 'src/app/interaction/interactor';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: '[app-abstract-interactive]',
  templateUrl: './abstract-interactive.component.html',
  styleUrls: ['./abstract-interactive.component.css']
})
export abstract class AbstractInteractiveComponent implements OnInit, OnDestroy {

  protected interactor!: Interactor;

  constructor(protected interactionService: InteractionService) { }

  abstract registerInteractor(): Interactor;

  ngOnInit(): void {
    this.interactor = this.registerInteractor();
    this.interactionService.register(this.interactor);
  }

  ngOnDestroy(): void {
    this.interactionService.unregister(this.interactor);
  }

}
