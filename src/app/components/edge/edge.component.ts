import { Component, Input } from '@angular/core';
import { Edge } from 'src/app/model/edge';
import { Node } from 'src/app/model/node';
import { Graph } from 'src/app/model/graph';
import { StateService } from 'src/app/services/state.service';
import { Interactor } from 'src/app/interaction/interactor';
import { AbstractInteractiveComponent } from '../abstract-interactive/abstract-interactive.component';
import { InteractionService } from 'src/app/services/interaction.service';
import { EdgeInteractor } from 'src/app/interaction/edge-interactor';
import { SaveService } from 'src/app/services/save.service';

@Component({
  selector: '[app-edge]',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.css']
})
export class EdgeComponent extends AbstractInteractiveComponent {

  @Input() edge!: Edge;

  constructor(private is: InteractionService, private stateService: StateService, private saveService: SaveService) {
    super(is);
  }

  override registerInteractor(): Interactor {
    return new EdgeInteractor(this.edge, this.stateService, this.saveService);
  }


  private getGraph(): Graph {
    return this.stateService.getGraph();
  }

  public start(): Node {
    return this.edge!.getStartNode(this.getGraph());
  }

  public end(): Node {
    return this.edge!.getEndNode(this.getGraph());
  }

  public getWidth(): number {
    return this.getInteractor().isSelected ? 8 : 5;
  }

}
