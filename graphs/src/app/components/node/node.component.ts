import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Node } from 'src/app/model/node';
import { AbstractInteractiveComponent } from '../abstract-interactive/abstract-interactive.component';
import { Interactor } from 'src/app/interaction/interactor';
import { NodeInteractor } from 'src/app/interaction/node-interactor';
import { StateService } from 'src/app/services/state.service';
import { InteractionService } from 'src/app/services/interaction.service';


@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent extends AbstractInteractiveComponent {

  public node!: Node;

  override ngOnInit(): void {
    super.ngOnInit();
    this.node = this.model as Node;
  }

  public getX(): number {
    return this.node!.pos.x;
  }

  public getY(): number {
    return this.node!.pos.y;
  }

  public getRadius(): number {
    return 20;
  }

  public getColor(): string {
    return "blue";
  }

  public getStrokeWidth(): number {
    return this.getInteractor().isSelected ? 3 : 0;
  }

}
